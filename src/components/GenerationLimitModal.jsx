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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const limit = Number(generationUsage?.limit ?? 20);
  const used = Math.min(Number(generationUsage?.used ?? limit), limit);
  const plan = generationUsage?.plan ?? "FREE";

  const percentageUsed = limit > 0 ? Math.min((used / limit) * 100, 100) : 100;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-5"
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
        className="relative w-full max-w-[760px] overflow-hidden rounded-2xl border border-white/[0.10] bg-[#0b0b0e] shadow-[0_35px_120px_rgba(0,0,0,0.72)]"
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-violet-600/[0.17] blur-[110px]" />
        <div className="pointer-events-none absolute -right-32 top-0 h-72 w-72 rounded-full bg-fuchsia-500/[0.13] blur-[110px]" />

        {/* ================= HERO ================= */}
        <div className="relative min-h-[205px] overflow-hidden border-b border-white/[0.07] sm:min-h-[225px]">
          <div className="absolute inset-0 bg-linear-to-br from-violet-500/[0.15] via-fuchsia-500/[0.05] to-transparent" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
              maskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />

          {/* Rings */}
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/[0.05]" />
          <div className="absolute -right-4 -top-10 h-44 w-44 rounded-full border border-violet-300/[0.07]" />
          <div className="absolute right-[20%] top-[32%] h-1.5 w-1.5 rounded-full bg-violet-300/70 shadow-[0_0_18px_rgba(167,139,250,0.9)]" />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-black/20 text-neutral-500 backdrop-blur-md transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white sm:right-5 sm:top-5"
          >
            <X size={15} />
          </button>

          {/* Hero */}
          <div className="relative flex h-full min-h-[205px] items-end px-5 pb-6 pt-14 sm:min-h-[225px] sm:px-8 sm:pb-7">
            <div className="max-w-[620px]">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-300/[0.18] bg-violet-400/[0.08]">
                  <Sparkles size={13} className="text-violet-300" />
                </div>

                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-violet-200/70 sm:text-[10px]">
                  SurforaAI Pro
                </span>
              </div>

              <h2
                id="generation-limit-title"
                className="text-[30px] font-medium leading-[1.04] tracking-[-0.045em] text-white sm:text-[40px] lg:text-[44px]"
              >
                Your free generations
                <br className="hidden sm:block" />
                <span className="bg-linear-to-r from-fuchsia-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                  {" "}
                  are used up.
                </span>
              </h2>

              <p className="mt-3 max-w-[560px] text-[12px] leading-5 text-neutral-400 sm:text-[13px]">
                You&apos;ve used all {limit} generations on the Free plan.
                Upgrade for more generations, powerful models, and higher AI
                effort levels.
              </p>
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="relative px-5 py-5 sm:px-8 sm:py-6">
          {/* Usage */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-600">
                <Zap size={11} className="text-violet-400/75" />
                Current plan
              </div>

              <div className="mt-1 text-base font-medium tracking-tight text-white">
                Free
              </div>
            </div>

            <div className="w-full sm:w-[250px]">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-600">
                  Generation usage
                </span>

                <span className="text-xs font-medium text-white">
                  {used}
                  <span className="text-neutral-600"> / {limit}</span>
                </span>
              </div>

              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-400"
                  style={{ width: `${percentageUsed}%` }}
                />
              </div>
            </div>
          </div>

          {/* ================= FEATURES ================= */}
          <div className="mt-6 border-t border-white/[0.06] pt-5">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-violet-300/70">
                  Pro includes
                </div>

                <h3 className="mt-1 text-lg font-medium tracking-[-0.025em] text-white sm:text-xl">
                  More capability. More control.
                </h3>
              </div>

              <span className="hidden text-[9px] text-neutral-600 sm:block">
                Upgrade whenever you&apos;re ready
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {/* Generations */}
              <div className="relative overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.025] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-violet-400/[0.14] bg-violet-400/[0.07]">
                    <Zap size={13} className="text-violet-300" />
                  </div>

                  <div>
                    <div className="text-sm font-medium text-white">
                      500
                      <span className="ml-1 text-[10px] font-normal text-neutral-500">
                        / billing period
                      </span>
                    </div>

                    <div className="text-[10px] text-neutral-500">
                      More generations
                    </div>
                  </div>
                </div>
              </div>

              {/* Models */}
              <div className="relative overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.025] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-fuchsia-400/[0.14] bg-fuchsia-400/[0.07]">
                    <BrainCircuit size={13} className="text-fuchsia-300" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white">
                      Powerful models
                    </div>

                    <div className="mt-0.5 truncate text-[10px] text-neutral-500">
                      GPT-6 Sol · Gemini 3.8 Flash
                    </div>
                  </div>
                </div>
              </div>

              {/* Effort */}
              <div className="relative overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.025] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-pink-400/[0.14] bg-pink-400/[0.07]">
                    <Gauge size={13} className="text-pink-300" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white">
                      Higher effort levels
                    </div>

                    <div className="mt-0.5 text-[10px] text-neutral-500">
                      More control over AI reasoning
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CTA ================= */}
          <div className="relative mt-5 overflow-hidden rounded-lg border border-violet-400/[0.14] bg-linear-to-r from-violet-500/[0.08] via-fuchsia-500/[0.04] to-transparent">
            <div className="absolute inset-y-0 left-0 w-[2px] bg-linear-to-b from-violet-400 via-fuchsia-400 to-pink-400" />

            <div className="flex flex-col gap-3.5 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-400/[0.08] sm:flex">
                  <Sparkles size={14} className="text-violet-300" />
                </div>

                <div>
                  <div className="text-xs font-medium text-white">
                    Keep building with Pro
                  </div>

                  <p className="mt-0.5 text-[10px] leading-4 text-neutral-500 sm:text-[11px]">
                    More generations, advanced models, and higher effort levels.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onUpgrade?.()}
                className="group flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-md bg-white px-4 text-[11px] font-semibold text-black transition hover:bg-neutral-200 active:scale-[0.985] sm:w-auto"
              >
                Upgrade to Pro
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-[9px] text-neutral-700">
            Generation access resumes when your allowance resets.
          </div>
        </div>
      </div>
    </div>
  );
}
