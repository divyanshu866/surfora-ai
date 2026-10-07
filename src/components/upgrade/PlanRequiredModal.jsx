import { useEffect } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  Gauge,
  Lock,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const PLAN_CONTENT = {
  PRO: {
    label: "Pro",
    eyebrow: "PRO ACCESS",
    description:
      "Unlock this model plus more generations and higher AI effort levels.",
    features: [
      {
        icon: Zap,
        title: "500",
        description: "generations / billing period",
      },
      {
        icon: BrainCircuit,
        title: "Powerful models",
        description: "GPT-6 Sol · Gemini 3.8 Flash",
      },
      {
        icon: Gauge,
        title: "Higher effort",
        description: "More control over AI reasoning",
      },
    ],
  },

  MAX: {
    label: "Max",
    eyebrow: "MAX ACCESS",
    description:
      "Unlock this model plus the full set of advanced models and controls.",
    features: [
      {
        icon: Zap,
        title: "500",
        description: "generations / billing period",
      },
      {
        icon: BrainCircuit,
        title: "All Pro models",
        description: "Full access to Pro model lineup",
      },
      {
        icon: Gauge,
        title: "Maximum control",
        description: "Higher AI effort levels",
      },
    ],
  },
};

export default function PlanRequiredModal({
  model,
  open,
  onClose,
  onUpgrade,
  currentPlan = "FREE",
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !model) return null;

  const requiredPlan = model.minimumPlan;
  const planContent = PLAN_CONTENT[requiredPlan];

  if (!planContent) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/70
        backdrop-blur-sm
        sm:items-center
        sm:p-5
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-required-title"
        aria-describedby="plan-required-description"
        onMouseDown={(event) => event.stopPropagation()}
        className="
          flex
          max-h-[92dvh]
          w-full
          max-w-[660px]
          flex-col
          overflow-hidden
          rounded-t-2xl
          border
          border-[#272528]
          bg-[#0c0c10]
          shadow-[0_30px_90px_rgba(0,0,0,0.65)]
          sm:max-h-[calc(100dvh-40px)]
          sm:rounded-2xl
        "
      >
        {/* HEADER */}
        <div className="shrink-0 border-b border-[#272528]">
          <div className="relative px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="
                absolute
                right-4
                top-4
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                border-[#272528]
                text-neutral-500
                transition
                hover:border-[#343135]
                hover:bg-white/[0.03]
                hover:text-white
                focus-visible:outline-none
                focus-visible:ring-1
                focus-visible:ring-violet-400
                sm:right-5
                sm:top-5
              "
            >
              <X size={15} />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-400/[0.05]">
                <Lock size={13} className="text-violet-300" />
              </div>

              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-violet-300/80">
                {planContent.eyebrow}
              </span>
            </div>

            <h2
              id="plan-required-title"
              className="
                mt-4
                max-w-[560px]
                text-[25px]
                font-medium
                leading-[1.08]
                tracking-[-0.035em]
                text-white
                sm:text-[31px]
              "
            >
              {model.label} requires{" "}
              <span className="text-violet-300">{planContent.label}</span>.
            </h2>

            <p
              id="plan-required-description"
              className="
                mt-2.5
                max-w-[520px]
                text-[12px]
                leading-5
                text-neutral-500
                sm:text-[13px]
                sm:leading-5.5
              "
            >
              {planContent.description}
            </p>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 py-5 sm:px-7 sm:py-6">
            {/* SELECTED MODEL */}
            <section>
              <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#272528] bg-white/[0.015] px-3.5 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#272528] bg-white/[0.02]">
                  <Sparkles size={14} className="text-violet-300" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-neutral-200">
                    {model.label}
                  </div>

                  {model.description && (
                    <div className="mt-0.5 truncate text-[10px] text-neutral-600">
                      {model.description}
                    </div>
                  )}
                </div>

                <div className="shrink-0 rounded-md border border-violet-400/15 bg-violet-400/[0.05] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-violet-300">
                  {requiredPlan}
                </div>
              </div>
            </section>

            {/* FEATURES */}
            <section className="mt-6 border-t border-[#272528] pt-5">
              <div>
                <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-600">
                  What you unlock
                </div>

                <h3 className="mt-1 text-base font-medium tracking-[-0.02em] text-white sm:text-lg">
                  More capability. More control.
                </h3>
              </div>

              <div className="mt-4 divide-y divide-[#272528] border-y border-[#272528]">
                {planContent.features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="flex items-center gap-3 py-3.5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#272528] bg-white/[0.02]">
                        <Icon size={14} className="text-violet-300" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white">
                          {feature.title}
                        </div>

                        <div className="mt-0.5 text-[10px] leading-4 text-neutral-600 sm:text-[11px]">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* CURRENT PLAN */}
            <section className="mt-5 flex items-center justify-between gap-4 border-t border-[#272528] pt-4">
              <div className="min-w-0">
                <div className="text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-600">
                  Current plan
                </div>

                <div className="mt-1 text-xs font-medium text-neutral-300">
                  {currentPlan}
                </div>
              </div>

              <div className="shrink-0 text-right text-[10px] text-neutral-700">
                Upgrade to unlock
              </div>
            </section>

            {/* CTA */}
            <section className="mt-5">
              <div
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-xl
                  border
                  border-[#272528]
                  bg-white/[0.02]
                  p-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-400/[0.05] sm:flex">
                    <Sparkles size={14} className="text-violet-300" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white">
                      Unlock {model.label}
                    </div>

                    <div className="mt-0.5 text-[10px] leading-4 text-neutral-600 sm:text-[11px]">
                      Get {planContent.label} access to continue.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onUpgrade?.(requiredPlan)}
                  className="
                    group
                    flex
                    h-10
                    w-full
                    shrink-0
                    items-center
                    justify-center
                    gap-1.5
                    rounded-lg
                    bg-white
                    px-4
                    text-[11px]
                    font-semibold
                    text-black
                    transition
                    hover:bg-neutral-200
                    active:scale-[0.985]
                    focus-visible:outline-none
                    focus-visible:ring-1
                    focus-visible:ring-violet-400
                    sm:h-9
                    sm:w-auto
                  "
                >
                  View plans
                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </section>

            <button
              type="button"
              onClick={onClose}
              className="
                mt-4
                block
                w-full
                pb-[env(safe-area-inset-bottom)]
                text-center
                text-[10px]
                text-neutral-700
                transition-colors
                hover:text-neutral-400
              "
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
