import { useRef, useState } from "react";
import { Zap } from "lucide-react";
import { AI_MODELS } from "../../ai/models";
import {
  CREDIT_POLICY,
  EFFORT_MULTIPLIERS,
  MODEL_BASE_CREDITS,
  TASK_MULTIPLIERS,
} from "../../lib/billing/credit-costs";

export const EFFORT_OPTIONS = {
  none: {
    label: "None",
    description: "Direct response without extended deliberation",
  },
  minimal: {
    label: "Minimal",
    description: "Fastest response for rapid layout tweaks",
  },
  low: {
    label: "Low",
    description: "Fast reasoning for straightforward component edits",
  },
  medium: {
    label: "Medium",
    description: "Balanced reasoning for multi-component layouts",
  },
  high: {
    label: "High",
    description: "Deeper reasoning for complex responsive state",
  },
  xhigh: {
    label: "XHigh",
    description: "Heavy computational analysis and validation",
  },
  max: {
    label: "Max",
    description: "Maximum reasoning depth for complex system architectures",
  },
};

export function calculateCredits(modelValue, effort, task = "GENERATE") {
  const base = MODEL_BASE_CREDITS[modelValue];
  const effortMultiplier = EFFORT_MULTIPLIERS[effort];
  const taskMultiplier = TASK_MULTIPLIERS[task];

  if (
    base === undefined ||
    effortMultiplier === undefined ||
    taskMultiplier === undefined
  ) {
    throw new Error("Unknown model, effort, or task in credit calculation.");
  }

  return Math.ceil(base * effortMultiplier * taskMultiplier);
}

function supportedEfforts(model) {
  const offered = new Set(Object.values(model.allowedEfforts).flat());
  return Object.keys(EFFORT_OPTIONS).filter((effort) => offered.has(effort));
}

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

export default function ModelsAndCredits() {
  const [modelValue, setModelValue] = useState(AI_MODELS[0].value);
  const [effort, setEffort] = useState(AI_MODELS[0].defaultEffort);
  const effortStripRef = useRef(null);

  const model = AI_MODELS.find((item) => item.value === modelValue);
  const availableEfforts = supportedEfforts(model);

  const handleModelChange = (newModelValue) => {
    const nextModel = AI_MODELS.find((item) => item.value === newModelValue);
    const nextEfforts = supportedEfforts(nextModel);

    setModelValue(newModelValue);
    if (!nextEfforts.includes(effort)) {
      setEffort(nextModel.defaultEffort);
    }

    // A newly selected model should show its effort choices from the start.
    if (effortStripRef.current) {
      effortStripRef.current.scrollLeft = 0;
    }
  };

  const monthlyBalance = CREDIT_POLICY.PRO.monthlyCredits;
  const creditsPerRequest = calculateCredits(model.value, effort, "GENERATE");
  const possibleRequests = Math.floor(monthlyBalance / creditsPerRequest);
  const solMaxRuns = Math.floor(
    monthlyBalance / calculateCredits("gpt-6-sol", "max", "GENERATE"),
  );

  // Derive the ends of the spectrum from the same credit rules as the readout.
  const runwayOptions = AI_MODELS.flatMap((item) =>
    supportedEfforts(item).map((level) =>
      Math.floor(
        monthlyBalance / calculateCredits(item.value, level, "GENERATE"),
      ),
    ),
  );
  const minPossible = Math.min(...runwayOptions);
  const maxPossible = Math.max(...runwayOptions);
  const rawPercent =
    maxPossible === minPossible
      ? 50
      : ((possibleRequests - minPossible) / (maxPossible - minPossible)) * 100;
  const spectrumPosition = Math.min(96, Math.max(4, rawPercent));

  return (
    <section
      id="capabilities"
      aria-labelledby="models-credits-heading"
      className="mc-section relative isolate overflow-hidden px-5 py-20 text-white sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-[520px] w-[860px] -translate-x-1/2 rounded-full bg-violet-600/[0.07] blur-[140px]"
      />

      <div className="relative mx-auto w-full max-w-7xl min-w-0">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-12">
          <div className="min-w-0 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.06] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              Models & Credits
            </div>

            <h2
              id="models-credits-heading"
              className="text-[clamp(2.25rem,4.5vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.045em]"
            >
              More reasoning,{" "}
              <span className="mc-heading-accent">
                or more room to iterate.
              </span>
            </h2>
          </div>

          <p className="min-w-0 max-w-md text-sm leading-6 text-white/55 sm:text-base sm:leading-7">
            You hold the throttle. Spend credits on deep reasoning when complex
            state calls for it, or drop effort to run hundreds of iterations on
            the same monthly balance.
          </p>
        </div>

        <div className="mt-10 min-w-0 sm:mt-12">
          <div
            className="mc-tab-bar scrollbar-none flex w-full min-w-0 items-center gap-1.5 overflow-x-auto rounded-2xl border border-white/[0.08] p-1.5 sm:gap-2"
            aria-label="Choose a model"
          >
            {AI_MODELS.map((item) => {
              const active = item.value === modelValue;

              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleModelChange(item.value)}
                  className={`mc-choice relative flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-transparent px-3.5 py-2.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08070b] sm:px-4 sm:text-sm lg:min-w-0 lg:flex-1 ${
                    active
                      ? "mc-tab-active text-white"
                      : "text-white/55 hover:bg-white/[0.04] hover:text-white/85"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        active
                          ? "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"
                          : "bg-white/20"
                      }`}
                    />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 pl-1 text-[11px] text-white/35 lg:hidden">
            Scroll to explore all models
          </p>
        </div>

        <div className="mc-surface relative mt-4 min-w-0 overflow-hidden rounded-[24px] border border-white/[0.08]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

          <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="flex min-w-0 flex-col justify-between p-5 sm:p-8 lg:p-10">
              <div className="min-w-0">
                <div className="border-b border-white/[0.06] pb-5 sm:pb-6">
                  <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-300/70">
                    Active model
                  </div>

                  <div className="mt-1 flex h-16 items-center">
                    <h3 className="min-w-0 text-[clamp(1.35rem,5vw,1.875rem)] font-medium leading-[1.12] tracking-tight text-white">
                      {model.label}
                    </h3>
                  </div>

                  <div className="flex min-h-10 items-start">
                    <p className="text-sm leading-5 text-white/55">
                      {model.description}
                    </p>
                  </div>
                </div>

                <div className="mt-7 min-w-0 sm:mt-8">
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-white/50">
                    Reasoning effort
                  </div>

                  <div
                    ref={effortStripRef}
                    role="group"
                    aria-label="Reasoning effort"
                    className="scrollbar-none mt-3 flex w-full min-w-0 items-center gap-1.5 overflow-x-auto rounded-xl border border-white/[0.07] bg-black/40 p-1.5"
                  >
                    {availableEfforts.map((option) => {
                      const active = effort === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setEffort(option)}
                          className={`mc-choice min-w-[72px] shrink-0 whitespace-nowrap rounded-lg border border-transparent px-3 py-2 text-center text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:min-w-0 sm:flex-1 ${
                            active
                              ? "mc-effort-active text-violet-100"
                              : "text-white/50 hover:bg-white/[0.03] hover:text-white/80"
                          }`}
                        >
                          {EFFORT_OPTIONS[option].label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex min-h-14 items-start">
                    <p className="text-xs leading-5 text-white/50">
                      {EFFORT_OPTIONS[effort].description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-white/[0.06] pt-5 sm:mt-8 sm:pt-6">
                <div className="flex items-start gap-2 text-xs leading-5 text-white/45">
                  <Zap
                    aria-hidden="true"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400"
                  />
                  <span>
                    Base compute:{" "}
                    <span className="text-white/70">
                      {MODEL_BASE_CREDITS[model.value]} credits
                    </span>
                    . Reasoning effort adjusts the cost.
                  </span>
                </div>
              </div>
            </div>

            <div className="mc-runway flex min-w-0 flex-col justify-between border-t border-white/[0.08] p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <div className="min-w-0">
                <div className="flex flex-col gap-1 text-xs text-white/50 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4">
                  <span>Estimated monthly runway</span>
                  <span className="mc-numeric">
                    {formatNumber(monthlyBalance)} credit Pro balance
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0">
                    <span className="mc-numeric text-5xl font-medium tracking-tight text-white sm:text-6xl lg:text-7xl">
                      {formatNumber(possibleRequests)}
                    </span>
                    <span className="text-base text-white/50 sm:text-lg">
                      generations
                    </span>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/[0.08] px-2.5 py-1 text-xs text-violet-200">
                    <span className="mc-numeric font-semibold">
                      {creditsPerRequest} credits
                    </span>
                    <span className="text-violet-300/70">per generation</span>
                  </div>
                </div>

                <div className="mt-9 border-t border-white/[0.07] pt-6">
                  <div className="flex justify-between gap-5 text-[11px] leading-4 text-white/50">
                    <span>Fewer, deeper generations</span>
                    <span className="text-right">More room to iterate</span>
                  </div>

                  <div
                    role="img"
                    aria-label={`${formatNumber(possibleRequests)} generations on a ${formatNumber(monthlyBalance)} credit balance; range across available settings: ${formatNumber(minPossible)} to ${formatNumber(maxPossible)} generations`}
                    className="relative mt-5 py-2"
                  >
                    <div className="relative h-1.5 w-full rounded-full bg-white/[0.1]">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 flex justify-between px-1"
                      >
                        <span className="h-full w-px bg-white/20" />
                        <span className="h-full w-px bg-white/10" />
                        <span className="h-full w-px bg-white/15" />
                        <span className="h-full w-px bg-white/10" />
                        <span className="h-full w-px bg-white/20" />
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="mc-spectrum-marker pointer-events-none absolute top-1/2 -translate-y-1/2"
                      style={{ left: `${spectrumPosition}%` }}
                    >
                      <div className="relative -translate-x-1/2">
                        <div className="absolute -inset-1 rounded-full bg-violet-400/30 blur-sm" />
                        <div className="relative flex h-5 w-3.5 items-center justify-center rounded-[4px] border border-violet-300/80 bg-[#161224] shadow-[0_0_10px_rgba(167,139,250,0.5)]">
                          <div className="h-2.5 w-0.5 rounded-full bg-violet-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 min-h-10 text-xs leading-5 text-white/60">
                    That’s{" "}
                    <span className="mc-numeric font-medium text-white">
                      {(possibleRequests / solMaxRuns).toFixed(1)}×
                    </span>{" "}
                    the generations of Sol at Max effort.
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-white/[0.06] pt-5">
                <p className="text-[11px] leading-5 text-white/40">
                  Credits are shared across models and tasks. Reworks use a
                  different credit rate than generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
