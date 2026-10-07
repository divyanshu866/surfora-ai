import { useEffect } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  Gauge,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

export default function GenerationLimitModal({
  open,
  onClose,
  onUpgrade,
  generationUsage,
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

  if (!open) return null;

  const limit = Number(generationUsage?.limit ?? 20);
  const used = Math.min(Number(generationUsage?.used ?? limit), limit);
  const percentageUsed = limit > 0 ? Math.min((used / limit) * 100, 100) : 100;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="generation-limit-title"
        aria-describedby="generation-limit-description"
        onMouseDown={(event) => event.stopPropagation()}
        className="
          flex
          max-h-[92dvh]
          w-full
          max-w-[680px]
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
          <div className="relative px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
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
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-300/80">
                Generation limit reached
              </span>
            </div>

            <h2
              id="generation-limit-title"
              className="
                mt-4
                max-w-[560px]
                text-[26px]
                font-medium
                leading-[1.08]
                tracking-[-0.035em]
                text-white
                sm:text-[32px]
              "
            >
              You&apos;ve used your Free generations.
            </h2>

            <p
              id="generation-limit-description"
              className="
                mt-3
                max-w-[560px]
                text-[12px]
                leading-5
                text-neutral-500
                sm:text-[13px]
              "
            >
              You&apos;ve used all {limit} generations available on the Free
              plan. Upgrade to keep building with more generations, advanced
              models, and higher effort levels.
            </p>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 py-5 sm:px-7 sm:py-6">
            {/* USAGE */}
            <section>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-600">
                    <Zap size={11} className="text-violet-400" />
                    Current plan
                  </div>

                  <div className="mt-1.5 text-sm font-medium text-white">
                    Free
                  </div>
                </div>

                <div className="w-full sm:max-w-[300px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-600">
                      Generation usage
                    </span>

                    <span className="text-xs font-medium text-white">
                      {used}
                      <span className="text-neutral-600"> / {limit}</span>
                    </span>
                  </div>

                  <div className="mt-2 h-1 rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${percentageUsed}%` }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* BENEFITS */}
            <section className="mt-6 border-t border-[#272528] pt-5">
              <div>
                <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-600">
                  Upgrade to Pro
                </div>

                <h3 className="mt-1 text-base font-medium tracking-[-0.02em] text-white sm:text-lg">
                  More room to build.
                </h3>
              </div>

              <div className="mt-4 divide-y divide-[#272528] border-y border-[#272528]">
                <div className="flex items-center gap-3 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#272528] bg-white/[0.02]">
                    <Zap size={14} className="text-violet-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white">
                      500 generations
                    </div>

                    <div className="mt-0.5 text-[10px] text-neutral-600">
                      Included per billing period
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#272528] bg-white/[0.02]">
                    <BrainCircuit size={14} className="text-violet-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white">
                      Advanced models
                    </div>

                    <div className="mt-0.5 text-[10px] text-neutral-600">
                      GPT-6 Sol · Gemini 3.8 Flash
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#272528] bg-white/[0.02]">
                    <Gauge size={14} className="text-violet-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white">
                      Higher effort levels
                    </div>

                    <div className="mt-0.5 text-[10px] text-neutral-600">
                      More control over AI reasoning
                    </div>
                  </div>
                </div>
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
                  sm:px-4.5
                "
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/[0.06] sm:flex">
                    <Sparkles size={14} className="text-violet-300" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white">
                      Continue building with Pro
                    </div>

                    <p className="mt-0.5 text-[10px] leading-4 text-neutral-600 sm:text-[11px]">
                      More generations, advanced models, and higher effort
                      levels.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onUpgrade?.()}
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
                  Upgrade to Pro
                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </section>

            <p className="mt-4 pb-[env(safe-area-inset-bottom)] text-center text-[9px] leading-4 text-neutral-700">
              Generation access resumes when your allowance resets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
