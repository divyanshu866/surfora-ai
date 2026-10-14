import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { CREDIT_POLICY, getCreditCost } from "./credit-costs";
function utcDayStart(date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function utcMonthStart(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addUtcMonthsClamped(date, months) {
  const firstOfTargetMonth = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1),
  );

  const lastDay = new Date(
    Date.UTC(
      firstOfTargetMonth.getUTCFullYear(),
      firstOfTargetMonth.getUTCMonth() + 1,
      0,
    ),
  ).getUTCDate();

  return new Date(
    Date.UTC(
      firstOfTargetMonth.getUTCFullYear(),
      firstOfTargetMonth.getUTCMonth(),
      Math.min(date.getUTCDate(), lastDay),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  );
}

// For annual-billed Pro subscriptions, allot 1,000 credits per month
// within the active subscription period, anchored to its start date.
function getProMonthlyWindow(subscription, now) {
  const subscriptionStart = subscription?.currentPeriodStart;
  const subscriptionEnd = subscription?.currentPeriodEnd;

  if (!subscriptionStart || !subscriptionEnd) {
    throw new Error("Missing Pro subscription billing-period dates");
  }

  if (now < subscriptionStart || now >= subscriptionEnd) {
    throw new Error("Current time is outside the active subscription period");
  }

  let monthOffset =
    (now.getUTCFullYear() - subscriptionStart.getUTCFullYear()) * 12 +
    now.getUTCMonth() -
    subscriptionStart.getUTCMonth();

  let periodStart = addUtcMonthsClamped(subscriptionStart, monthOffset);

  if (now < periodStart) {
    monthOffset -= 1;
    periodStart = addUtcMonthsClamped(subscriptionStart, monthOffset);
  }

  const calculatedEnd = addUtcMonthsClamped(subscriptionStart, monthOffset + 1);

  const periodEnd =
    calculatedEnd < subscriptionEnd ? calculatedEnd : subscriptionEnd;

  return { periodStart, periodEnd };
}

function getCurrentPeriods(entitlement, now = new Date()) {
  if (entitlement.plan === "FREE") {
    const dayStart = utcDayStart(now);
    const monthStart = utcMonthStart(now);

    return [
      {
        periodType: "DAILY",
        periodStart: dayStart,
        periodEnd: new Date(dayStart.getTime() + 24 * 60 * 60 * 1000),
        limit: CREDIT_POLICY.FREE.dailyCredits,
      },
      {
        periodType: "MONTHLY",
        periodStart: monthStart,
        periodEnd: new Date(
          Date.UTC(
            monthStart.getUTCFullYear(),
            monthStart.getUTCMonth() + 1,
            1,
          ),
        ),
        limit: CREDIT_POLICY.FREE.monthlyCredits,
      },
    ];
  }

  if (entitlement.plan === "PRO") {
    const { periodStart, periodEnd } = getProMonthlyWindow(
      entitlement.subscription,
      now,
    );

    return [
      {
        // This row represents a monthly credit window, even for annual
        // billing. Its start is anchored to the subscription start date.
        periodType: "SUBSCRIPTION",
        periodStart,
        periodEnd,
        limit: CREDIT_POLICY.PRO.monthlyCredits,
      },
    ];
  }

  throw new Error(`Credit policy is not configured for ${entitlement.plan}`);
}

async function findPeriodUsage(userId, period) {
  return prisma.creditUsagePeriod.findUnique({
    where: {
      userId_periodType_periodStart: {
        userId,
        periodType: period.periodType,
        periodStart: period.periodStart,
      },
    },
  });
}

function summarizePeriod(row, limit) {
  const used = row?.creditsUsed ?? 0;

  return {
    limit,
    used,
    remaining: Math.max(limit - used, 0),
  };
}

export async function getCreditUsage(userId, entitlement) {
  const periods = getCurrentPeriods(entitlement);

  const usageRows = await Promise.all(
    periods.map((period) => findPeriodUsage(userId, period)),
  );

  const summaries = periods.map((period, index) => ({
    ...period,
    ...summarizePeriod(usageRows[index], period.limit),
  }));

  const remaining = Math.min(...summaries.map((period) => period.remaining));

  return {
    plan: entitlement.plan,
    remaining,
    periods: Object.fromEntries(
      summaries.map((period) => [
        period.periodType,
        {
          limit: period.limit,
          used: period.used,
          remaining: period.remaining,
          periodStart: period.periodStart,
          periodEnd: period.periodEnd,
        },
      ]),
    ),
  };
}

async function chargePeriod(tx, userId, period, credits) {
  const rows = await tx.$queryRaw`
    INSERT INTO "CreditUsagePeriod" (
      "id",
      "userId",
      "periodType",
      "periodStart",
      "periodEnd",
      "creditsUsed",

      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${randomUUID()},
      ${userId},
      ${period.periodType}::"CreditPeriodType",
      ${period.periodStart},
      ${period.periodEnd},
      ${credits},

      NOW(),
      NOW()
    )
    ON CONFLICT ("userId", "periodType", "periodStart")
    DO UPDATE SET
    "creditsUsed" = "CreditUsagePeriod"."creditsUsed" + ${credits},
    "periodEnd" = EXCLUDED."periodEnd",
    "updatedAt" = NOW()
    WHERE
    "CreditUsagePeriod"."creditsUsed" + ${credits} <= ${period.limit}
    RETURNING "id";
    `;

  if (rows.length === 0) {
    const error = new Error("INSUFFICIENT_CREDITS");
    error.code = "INSUFFICIENT_CREDITS";
    throw error;
  }
}

export async function chargeCredits(
  userId,
  entitlement,
  { model, effort, task },
) {
  const credits = getCreditCost({ model, effort, task });
  const periods = getCurrentPeriods(entitlement);

  const insufficient = async () => ({
    allowed: false,
    reason: "INSUFFICIENT_CREDITS",
    cost: credits,
    usage: await getCreditUsage(userId, entitlement),
  });

  if (periods.some((period) => credits > period.limit)) {
    return insufficient();
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        // Roll back all period updates if any limit fails.
        for (const period of periods) {
          await chargePeriod(tx, userId, period, credits);
        }

        await tx.creditCharge.create({
          data: {
            userId,
            model,
            effort,
            task,
            plan: entitlement.plan,
            credits,
          },
        });
      },
      {
        maxWait: 5_000,
      },
    );

    return {
      allowed: true,
      cost: credits,
      usage: await getCreditUsage(userId, entitlement),
    };
  } catch (error) {
    if (error?.code === "INSUFFICIENT_CREDITS") {
      return insufficient();
    }

    throw error;
  }
}
