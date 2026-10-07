import FeatureList from "./FeatureList";

const FREE_FEATURES = [
  "Up to 3 generations per day",
  "Maximum 20 generations per month",
  "GPT-6 Luna — Low + Medium effort",
  "GLM 5.3 Flash",
  "Describe → generate → preview → rework → refine",
];

export default function CurrentPlanCard() {
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
          <span className="text-white/30">Monthly generation allowance</span>
          <span className="font-medium text-white/50">20 max</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-[42%] rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  );
}
