"use client";

const numberFormatter = new Intl.NumberFormat("en-US");
const formatNumber = (value) => numberFormatter.format(value);

const formatResetText = (periodEnd) => {
  if (!periodEnd) return "Resets periodically";

  const end = new Date(periodEnd);
  if (Number.isNaN(end.getTime())) return "Resets periodically";

  const days = Math.ceil((end.getTime() - Date.now()) / 86400000);
  if (days <= 0) return "Resets soon";
  if (days === 1) return "Resets tomorrow";
  return `Resets in ${days} days`;
};

const GenerationUsageIndicator = ({ creditUsage, onLimitReached }) => {
  const plan = String(creditUsage?.plan ?? "FREE").toUpperCase();
  const isPaid = plan === "PRO" || plan === "MAX";
  const planLabel = plan === "MAX" ? "Max" : plan === "PRO" ? "Pro" : "Free";
  const periods = creditUsage?.periods ?? {};

  const parsedRemaining = Number(creditUsage?.remaining);
  const hasUsage = Boolean(creditUsage) && Number.isFinite(parsedRemaining);
  const remaining = hasUsage ? Math.max(0, parsedRemaining) : null;
  const isEmpty = hasUsage && remaining <= 0;

  const content = !isPaid ? (
    <div className="space-y-4">
      {/* Daily allowance is the primary Free-plan balance, matching Pro's hierarchy. */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-neutral-200">
            Daily credits available
          </p>
          <p className="mt-1 text-[10px] text-neutral-500">
            {periods.DAILY
              ? formatResetText(periods.DAILY.periodEnd)
              : "Daily allowance"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div
            className={`text-[22px] font-semibold leading-none tracking-[-0.045em] tabular-nums ${
              !periods.DAILY
                ? "text-neutral-500"
                : Number(periods.DAILY.remaining ?? 0) <= 0
                  ? "text-rose-300"
                  : "text-white"
            }`}
          >
            {periods.DAILY
              ? formatNumber(Math.max(0, Number(periods.DAILY.remaining ?? 0)))
              : "—"}
          </div>
          <p className="mt-1 text-[10px] text-neutral-500">
            {periods.DAILY
              ? `of ${formatNumber(Math.max(0, Number(periods.DAILY.limit ?? 0)))} credits`
              : hasUsage
                ? "Unavailable"
                : "Loading…"}
          </p>
        </div>
      </div>

      {/* Monthly allowance remains secondary, with the same meter style as Pro. */}
      {periods.MONTHLY ? (
        <div>
          {(() => {
            const period = periods.MONTHLY;
            const limit = Math.max(0, Number(period.limit ?? 0));
            const used = Math.max(0, Number(period.used ?? 0));
            const periodRemaining = Math.max(0, Number(period.remaining ?? 0));
            const percentageUsed =
              limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
            const exhausted = limit > 0 && periodRemaining <= 0;

            return (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-neutral-400">
                    Monthly credits
                  </span>
                  <span className="shrink-0 text-[11px] font-medium tabular-nums text-neutral-200">
                    {formatNumber(periodRemaining)}
                    <span className="font-normal text-neutral-500">
                      {" "}
                      / {formatNumber(limit)}
                    </span>
                  </span>
                </div>

                <div
                  className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]"
                  role="progressbar"
                  aria-label="Monthly credits used"
                  aria-valuemin={0}
                  aria-valuemax={limit || 100}
                  aria-valuenow={limit > 0 ? Math.min(used, limit) : 0}
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${
                      exhausted ? "bg-rose-400/80" : "bg-violet-300/90"
                    }`}
                    style={{ width: `${percentageUsed}%` }}
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-neutral-500">
                  <span className="tabular-nums">
                    {formatNumber(used)} used
                  </span>
                  <span className="shrink-0">
                    {formatResetText(period.periodEnd)}
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      ) : (
        <p className="text-[11px] text-neutral-500">
          {hasUsage
            ? "Monthly usage limit unavailable"
            : "Retrieving usage limits…"}
        </p>
      )}

      {isEmpty && (
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] pt-3 text-[11px]">
          <span className="text-rose-200/80">
            You’ve reached your current limit.
          </span>
          <span className="shrink-0 font-medium text-violet-200">
            View plans ↗
          </span>
        </div>
      )}
    </div>
  ) : (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-neutral-200">
            Credits available
          </p>
          <p className="mt-1 text-[10px] text-neutral-500">{planLabel} plan</p>
        </div>

        <div className="shrink-0 text-right">
          <div
            className={`text-[22px] font-semibold leading-none tracking-[-0.045em] tabular-nums ${
              !hasUsage
                ? "text-neutral-500"
                : isEmpty
                  ? "text-rose-300"
                  : "text-white"
            }`}
          >
            {hasUsage ? formatNumber(remaining) : "—"}
          </div>
          <p
            className={`mt-1 text-[10px] ${
              !hasUsage
                ? "text-neutral-500"
                : isEmpty
                  ? "text-rose-300/80"
                  : "text-neutral-500"
            }`}
          >
            {hasUsage
              ? isEmpty
                ? "No credits left"
                : "remaining"
              : "Loading…"}
          </p>
        </div>
      </div>

      {periods.SUBSCRIPTION ? (
        <div>
          {(() => {
            const period = periods.SUBSCRIPTION;
            const limit = Math.max(0, Number(period.limit ?? 0));
            const used = Math.max(0, Number(period.used ?? 0));
            const periodRemaining = Math.max(0, Number(period.remaining ?? 0));
            const percentageUsed =
              limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
            const exhausted = limit > 0 && periodRemaining <= 0;

            return (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-neutral-400">
                    Subscription credits
                  </span>
                  <span className="shrink-0 text-[11px] font-medium tabular-nums text-neutral-200">
                    {formatNumber(periodRemaining)}
                    <span className="font-normal text-neutral-500">
                      {" "}
                      / {formatNumber(limit)}
                    </span>
                  </span>
                </div>

                <div
                  className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]"
                  role="progressbar"
                  aria-label="Subscription credits used"
                  aria-valuemin={0}
                  aria-valuemax={limit || 100}
                  aria-valuenow={limit > 0 ? Math.min(used, limit) : 0}
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${
                      exhausted ? "bg-rose-400/80" : "bg-violet-300/90"
                    }`}
                    style={{ width: `${percentageUsed}%` }}
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-neutral-500">
                  <span className="tabular-nums">
                    {formatNumber(used)} used
                  </span>
                  <span className="shrink-0">
                    {formatResetText(period.periodEnd)}
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      ) : (
        <p className="text-[11px] text-neutral-500">
          {hasUsage ? "Usage limits unavailable" : "Retrieving usage limits…"}
        </p>
      )}

      {isEmpty && (
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] pt-3 text-[11px]">
          <span className="text-rose-200/80">
            You’ve reached your current limit.
          </span>
          <span className="shrink-0 font-medium text-violet-200">
            View plans ↗
          </span>
        </div>
      )}
    </div>
  );

  if (isEmpty) {
    return (
      <button
        type="button"
        onClick={onLimitReached}
        className="block w-full rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101116]"
        aria-label="No credits remaining. Open credit and upgrade options."
      >
        {content}
      </button>
    );
  }

  return <div>{content}</div>;
};

export default GenerationUsageIndicator;
