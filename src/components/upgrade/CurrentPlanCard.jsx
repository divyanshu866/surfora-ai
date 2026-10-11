import { CREDIT_POLICY } from "@/lib/billing/credit-costs";

const FREE_FEATURES = [
  `${CREDIT_POLICY.FREE.dailyCredits} credits per day`,
  `${CREDIT_POLICY.FREE.monthlyCredits} credits per month`,
  "GPT-6 Luna — Low + Medium effort",
  "GLM 5.3 Flash",
  "Describe → generate → preview → rework → refine",
];

export default function CurrentPlanCard({ monthlyCreditsUsed = null }) {
  const plan = CREDIT_POLICY.FREE;
  const used =
    typeof monthlyCreditsUsed === "number" &&
    Number.isFinite(monthlyCreditsUsed)
      ? Math.max(0, monthlyCreditsUsed)
      : null;

  const progress =
    used === null ? 0 : Math.min((used / plan.monthlyCredits) * 100, 100);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.17em] text-white/25">
            Current plan
          </div>
          <div className="mt-1.5 text-sm font-medium text-white/75">Free</div>
        </div>

        <span className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[9px] text-white/30">
          $0
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-end justify-between text-[10px]">
          <span className="text-white/30">Monthly credit allowance</span>
          <span className="font-medium text-white/50">
            {used === null
              ? `${plan.monthlyCredits} credits`
              : `${used} / ${plan.monthlyCredits} credits`}
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-white/25 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
