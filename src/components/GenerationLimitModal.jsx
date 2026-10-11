import { useEffect } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  CalendarDays,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function getPeriodRows(plan, periods) {
  if (plan === "FREE") {
    return [
      { key: "DAILY", label: "Daily allowance", period: periods.DAILY },
      { key: "MONTHLY", label: "Monthly allowance", period: periods.MONTHLY },
    ].filter(({ period }) => period);
  }

  return [
    {
      key: "SUBSCRIPTION",
      label: "Current subscription period",
      period: periods.SUBSCRIPTION,
    },
  ].filter(({ period }) => period);
}

export default function GenerationLimitModal({
  open,
  onClose,
  onUpgrade,
  creditUsage,
  requestedCredits,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const plan = creditUsage?.plan ?? "FREE";
  const periods = creditUsage?.periods ?? {};
  const remaining = Number(creditUsage?.remaining ?? 0);
  const hasRequestedCredits =
    Number.isFinite(Number(requestedCredits)) && requestedCredits != null;
  const requestCost = hasRequestedCredits ? Number(requestedCredits) : null;
  const insufficientForRequest = requestCost != null && requestCost > remaining;
  const periodRows = getPeriodRows(plan, periods);
  const exhausted = remaining <= 0;
  const isFree = plan === "FREE";
  const isPro = plan === "PRO";

  const blockingKeys = new Set(
    periodRows
      .filter(({ period }) => {
        const periodRemaining = Number(period.remaining ?? 0);
        return requestCost != null
          ? requestCost > periodRemaining
          : periodRemaining <= 0;
      })
      .map(({ key }) => key),
  );

  const title = exhausted ? "You're out of credits" : "Not enough credits";
  const actionLabel = isFree ? "Upgrade to Pro" : "View plans";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-[5px] sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="credit-limit-title"
        aria-describedby="credit-limit-description"
        onMouseDown={(event) => event.stopPropagation()}
        className="relative max-h-[90dvh] w-full max-w-[440px] overflow-y-auto rounded-t-2xl border border-[#2a282d] bg-[#0d0c10] shadow-[0_28px_100px_rgba(0,0,0,0.6)] sm:max-h-[calc(100dvh-32px)] sm:rounded-2xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.12),transparent_70%)]" />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/[0.08] text-violet-200">
              <Zap size={17} strokeWidth={1.8} />
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300/80">
            Credit limit reached
          </p>
          <h2
            id="credit-limit-title"
            className="mt-2 text-[25px] font-semibold leading-tight tracking-[-0.04em] text-white sm:text-[27px]"
          >
            {title}
          </h2>
          <p
            id="credit-limit-description"
            className="mt-2 text-[13px] leading-5 text-neutral-400"
          >
            {insufficientForRequest
              ? `This request needs ${formatNumber(requestCost)} credits. You have ${formatNumber(remaining)} available.`
              : exhausted
                ? "Your current credit allowance is exhausted."
                : "Your current plan doesn't have enough credits for this request."}
          </p>

          {/* At-a-glance balance */}
          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#29272c] bg-white/[0.025] p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#302d35] bg-[#17151b] text-violet-200">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-neutral-100">
                  {plan === "FREE"
                    ? "Free plan"
                    : `${plan.charAt(0)}${plan.slice(1).toLowerCase()} plan`}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-500">
                  Credits currently available
                </p>
              </div>
            </div>
            <p className="shrink-0 text-right text-xl font-semibold tracking-[-0.04em] text-white tabular-nums">
              {formatNumber(remaining)}
              <span className="ml-1 text-[10px] font-medium tracking-normal text-neutral-500">
                credits
              </span>
            </p>
          </div>

          {/* Only show counters actually provided by the usage API */}
          {periodRows.length > 0 && (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] font-medium text-neutral-300">
                  Usage breakdown
                </p>
                <p className="text-[10px] text-neutral-600">Live allowance</p>
              </div>

              <div className="space-y-3">
                {periodRows.map(({ key, label, period }) => {
                  const limit = Number(period.limit ?? 0);
                  const used = Number(period.used ?? 0);
                  const periodRemaining = Number(
                    period.remaining ?? Math.max(0, limit - used),
                  );
                  const percentUsed =
                    limit > 0
                      ? Math.min(100, Math.max(0, (used / limit) * 100))
                      : 0;
                  const isBlocking = blockingKeys.has(key);

                  return (
                    <div
                      key={key}
                      className={`rounded-lg border px-3 py-3 ${
                        isBlocking
                          ? "border-violet-400/20 bg-violet-400/[0.045]"
                          : "border-[#29272c] bg-white/[0.015]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          {key === "DAILY" ? (
                            <Zap
                              size={13}
                              className="shrink-0 text-neutral-500"
                            />
                          ) : (
                            <CalendarDays
                              size={13}
                              className="shrink-0 text-neutral-500"
                            />
                          )}
                          <span className="truncate text-[11px] text-neutral-300">
                            {label}
                          </span>
                          {isBlocking && (
                            <span className="shrink-0 rounded px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-violet-200 bg-violet-400/10">
                              Limit reached
                            </span>
                          )}
                        </div>
                        <span className="shrink-0 text-[11px] font-medium tabular-nums text-neutral-200">
                          {formatNumber(periodRemaining)}
                          <span className="text-neutral-600">
                            {" "}
                            / {formatNumber(limit)}
                          </span>
                        </span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className={`h-full rounded-full transition-[width] duration-300 ${isBlocking ? "bg-violet-400" : "bg-neutral-500"}`}
                          style={{ width: `${percentUsed}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-right text-[9px] text-neutral-600">
                        {formatNumber(used)} used
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upsell is deliberately compact; don't promise an unconfirmed Max quota */}
          <div className="mt-5 border-t border-[#29272c] pt-4">
            {isFree ? (
              <div className="mb-4 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <Zap size={14} className="mt-0.5 shrink-0 text-violet-300" />
                  <p className="text-[11px] leading-4 text-neutral-300">
                    <span className="font-medium text-neutral-100">
                      1,000 credits per subscription month
                    </span>
                    <span className="text-neutral-500"> on Pro</span>
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <BrainCircuit
                    size={14}
                    className="mt-0.5 shrink-0 text-violet-300"
                  />
                  <p className="text-[11px] leading-4 text-neutral-300">
                    <span className="font-medium text-neutral-100">
                      Advanced AI models
                    </span>
                    <span className="text-neutral-500">
                      {" "}
                      and higher effort levels
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="mb-4 text-[11px] leading-4 text-neutral-500">
                {isPro
                  ? "Your allowance follows your current subscription period. Review available plans or wait for it to renew."
                  : "Your current allowance will refresh when its period renews. You can review your plan options below."}
              </p>
            )}

            <button
              type="button"
              onClick={() => onUpgrade?.()}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-[12px] font-semibold text-[#111014] transition hover:bg-neutral-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0c10]"
            >
              {actionLabel}
              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 block w-full text-center text-[10px] font-medium text-neutral-500 transition hover:text-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
            >
              Maybe later
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
