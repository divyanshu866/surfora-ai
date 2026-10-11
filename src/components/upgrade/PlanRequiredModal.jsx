import { useEffect } from "react";
import {
  ArrowUpRight,
  Check,
  Gauge,
  LockKeyhole,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const PLAN_CONTENT = {
  PRO: {
    label: "Pro",
    eyebrow: "PRO PLAN REQUIRED",
    summary: "Unlock more capable models and higher AI effort levels.",
    benefits: [
      {
        icon: Zap,
        title: "Advanced models",
        detail: "GPT-6 Sol · Gemini 3.8 Flash",
      },
      {
        icon: Gauge,
        title: "Higher effort levels",
        detail: "More control over generation quality",
      },
    ],
  },
  MAX: {
    label: "Max",
    eyebrow: "MAX PLAN REQUIRED",
    summary: "Unlock the highest level of model and effort access.",
    benefits: [
      {
        icon: Sparkles,
        title: "Expanded model access",
        detail: "Access to the advanced model lineup",
      },
      {
        icon: Gauge,
        title: "Maximum effort levels",
        detail: "More control for demanding tasks",
      },
    ],
  },
};

function formatPlan(plan) {
  const value = String(plan ?? "FREE").toLowerCase();
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function PlanRequiredModal({
  model,
  open,
  onClose,
  onUpgrade,
  currentPlan = "FREE",
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

  if (!open || !model) return null;

  const requiredPlan = model.minimumPlan;
  const planContent = PLAN_CONTENT[requiredPlan];

  if (!planContent) {
    throw new Error(
      `PlanRequiredModal received unsupported minimumPlan: ${String(
        requiredPlan,
      )}`,
    );
  }

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-end justify-center
        bg-black/70 p-0 backdrop-blur-[5px]
        sm:items-center sm:p-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-required-title"
        aria-describedby="plan-required-description"
        onMouseDown={(event) => event.stopPropagation()}
        className="
          relative max-h-[90dvh] w-full max-w-[440px]
          overflow-y-auto rounded-t-2xl
          border border-[#2a282d] bg-[#0d0c10]
          shadow-[0_28px_100px_rgba(0,0,0,0.6)]
          sm:max-h-[calc(100dvh-32px)] sm:rounded-2xl
        "
      >
        {/* Subtle accent, not a large decorative hero */}
        <div
          className="
            pointer-events-none absolute inset-x-0 top-0 h-32
            bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.13),transparent_70%)]
          "
        />

        <div className="relative p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl border border-violet-400/20
                bg-violet-400/[0.08] text-violet-200
              "
            >
              <LockKeyhole size={17} strokeWidth={1.8} />
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="
                flex h-8 w-8 items-center justify-center rounded-lg
                text-neutral-500 transition
                hover:bg-white/[0.06] hover:text-white
                focus-visible:outline-none
                focus-visible:ring-1 focus-visible:ring-violet-400
              "
            >
              <X size={16} />
            </button>
          </div>

          <p
            className="
              mt-4 text-[10px] font-semibold uppercase
              tracking-[0.16em] text-violet-300/80
            "
          >
            {planContent.eyebrow}
          </p>

          <h2
            id="plan-required-title"
            className="
              mt-2 text-[25px] font-semibold leading-tight
              tracking-[-0.04em] text-white sm:text-[27px]
            "
          >
            Unlock {model.label}
          </h2>

          <p
            id="plan-required-description"
            className="mt-2 text-[13px] leading-5 text-neutral-400"
          >
            {planContent.summary}
          </p>

          {/* Locked item */}
          <div
            className="
              mt-5 rounded-xl border border-[#29272c]
              bg-white/[0.025] p-3.5
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex h-9 w-9 shrink-0 items-center justify-center
                  rounded-lg border border-[#302d35]
                  bg-[#17151b] text-violet-200
                "
              >
                <Sparkles size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-neutral-100">
                  {model.label}
                </p>

                {model.description ? (
                  <p className="mt-0.5 truncate text-[11px] text-neutral-500">
                    {model.description}
                  </p>
                ) : null}
              </div>

              <span
                className="
                  shrink-0 rounded-md border border-violet-400/20
                  bg-violet-400/[0.07] px-2 py-1
                  text-[9px] font-semibold uppercase
                  tracking-[0.1em] text-violet-200
                "
              >
                {planContent.label}
              </span>
            </div>
          </div>

          {/* Key benefits */}
          <div className="mt-4 space-y-3">
            {planContent.benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div key={benefit.title} className="flex items-start gap-3">
                  <div
                    className="
                      mt-0.5 flex h-6 w-6 shrink-0
                      items-center justify-center rounded-md
                      bg-white/[0.04] text-neutral-300
                    "
                  >
                    <Icon size={13} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-neutral-200">
                      {benefit.title}
                    </p>

                    <p className="mt-0.5 text-[11px] leading-4 text-neutral-500">
                      {benefit.detail}
                    </p>
                  </div>

                  <Check
                    size={14}
                    className="mt-1 shrink-0 text-violet-300/80"
                  />
                </div>
              );
            })}
          </div>

          {/* Primary action */}
          <div className="mt-5 border-t border-[#29272c] pt-4">
            <button
              type="button"
              onClick={() => onUpgrade?.(requiredPlan)}
              className="
                group flex h-11 w-full items-center justify-center gap-2
                rounded-xl bg-white px-4 text-[12px] font-semibold
                text-[#111014] transition hover:bg-neutral-200
                active:scale-[0.99]
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-violet-400
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#0d0c10]
              "
            >
              Upgrade to {planContent.label}
              <ArrowUpRight
                size={15}
                className="
                  transition-transform duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </button>

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-[10px] text-neutral-600">
                Current plan: {formatPlan(currentPlan)}
              </p>

              <button
                type="button"
                onClick={onClose}
                className="
                  text-[10px] font-medium text-neutral-500
                  transition hover:text-neutral-200
                  focus-visible:outline-none
                  focus-visible:ring-1 focus-visible:ring-violet-400
                "
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
