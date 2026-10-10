import { prisma } from "@/lib/prisma";

const PRO_PRICE_IDS = [
  process.env.NEXT_PUBLIC_PADDLE_PREMIUM_MONTHLY_PRICE_ID,
  process.env.NEXT_PUBLIC_PADDLE_PREMIUM_YEARLY_PRICE_ID,
].filter((priceId): priceId is string => Boolean(priceId));

export async function getUserEntitlement(userId: string) {
  if (PRO_PRICE_IDS.length === 0) {
    console.error("Paddle Pro price IDs are not configured");

    return {
      plan: "FREE" as const,
      subscription: null,
    };
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      provider: "PADDLE",
      status: "active",
      providerPriceId: {
        in: PRO_PRICE_IDS,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const isPro = subscription !== null;

  return {
    plan: isPro ? ("PRO" as const) : ("FREE" as const),
    subscription,
  };
}
