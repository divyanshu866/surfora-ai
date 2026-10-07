import {
  ArrowRight,
  PencilLine,
  Rocket,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import GlowOrb from "./GlowOrb";

const WORKFLOW_STEPS = [
  {
    number: "01",
    icon: PencilLine,
    title: "Describe",
    description: "Tell SurforaAI what you want to build.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Generate",
    description: "Get working UI and editable source code.",
  },
  {
    number: "03",
    icon: SlidersHorizontal,
    title: "Refine",
    description: "Iterate until the result feels right.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Ship",
    description: "Take the finished UI into your project.",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden border-y border-white/[0.07] bg-[#0d0d11] px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgba(124,58,237,0.09),transparent_32%),radial-gradient(circle_at_10%_80%,rgba(217,70,239,0.055),transparent_28%)]"
      />

      <GlowOrb className="-right-40 top-10 h-96 w-96 bg-violet-600/[0.06]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.17em] text-violet-200/80">
            <Sparkles className="h-3 w-3 text-violet-300" />
            How it works
          </div>

          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-[60px] lg:leading-[1.02]">
            From prompt
            <span className="text-zinc-400"> to production.</span>
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Describe what you need, generate the implementation, refine it, and
            move on.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-14 sm:mt-16 lg:mt-20">
          {/* Desktop connector */}
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent lg:block"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative rounded-2xl border border-white/[0.08] bg-[#111116] p-5 transition-colors duration-200 hover:border-white/[0.13] hover:bg-[#14141a] sm:p-6"
                >
                  {/* Step number / icon */}
                  <div className="flex items-center justify-between">
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.09] bg-[#0b0b0f] shadow-[0_8px_24px_rgba(0,0,0,0.24)]">
                      <Icon className="h-5 w-5 text-violet-300" />
                    </div>

                    <span className="font-mono text-[10px] font-medium tracking-[0.16em] text-zinc-600">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-7">
                    <h3 className="text-base font-semibold tracking-[-0.015em] text-white">
                      {step.title}
                    </h3>

                    <p className="mt-2.5 text-sm leading-6 text-zinc-400">
                      {step.description}
                    </p>
                  </div>

                  {/* Small progression cue */}
                  {index < WORKFLOW_STEPS.length - 1 && (
                    <div className="mt-7 hidden items-center gap-1.5 text-[9px] font-medium text-zinc-700 lg:flex">
                      <span>Next</span>
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-12 flex items-center gap-3 border-t border-white/[0.06] pt-6 text-xs text-zinc-500 sm:mt-14 sm:pt-7">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          One workspace from idea to implementation.
        </div>
      </div>
    </section>
  );
}
