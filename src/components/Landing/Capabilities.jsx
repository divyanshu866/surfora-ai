import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Glow } from "./Helpers";
import {
  Code2,
  Cpu,
  Gauge,
  Layers3,
  Monitor,
  RotateCcw,
  WandSparkles,
  Zap,
  Check,
} from "lucide-react";
import { SectionEyebrow, Surface, models } from "./Helpers";

const capabilityCards = [
  {
    icon: WandSparkles,
    title: "AI interface generation",
    body: "Describe a complete interface and get a working implementation.",
    tag: "Synthesis",
  },
  {
    icon: RotateCcw,
    title: "AI interface rework",
    body: "Keep refining the same interface instead of starting over after every change.",
    tag: "Iterative",
  },
  {
    icon: Monitor,
    title: "Live preview",
    body: "See the generated experience as an interface, not just as a block of code.",
    tag: "Real-time",
  },
  {
    icon: Code2,
    title: "Real frontend code",
    body: "Generated output is designed around working frontend implementation.",
    tag: "Production",
  },
  {
    icon: Layers3,
    title: "React + Web Bundle",
    body: "Build React interfaces or Web Bundles using HTML, CSS, and JavaScript.",
    tag: "Multi-target",
  },
  {
    icon: Cpu,
    title: "Multiple AI models",
    body: "Choose from several models and supported effort levels as your plan allows.",
    tag: "Pluggable",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Capabilities() {
  const [modelIndex, setModelIndex] = useState(0);
  const currentModel = useMemo(() => models[modelIndex], [modelIndex]);

  return (
    <section
      id="capabilities"
      className="relative isolate overflow-hidden bg-[#030204] px-5 py-24 text-white sm:px-6 lg:px-8 lg:py-32"
    >
      {/* Precision ambient background radiance */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-12 -z-10 h-[480px] w-[750px] -translate-x-1/2 rounded-full bg-violet-600/[0.07] blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-600/[0.04] blur-[100px]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Header section */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>Capabilities</SectionEyebrow>

            <h2 className="text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl sm:leading-[1.12]">
              Everything around the{" "}
              <span className="bg-gradient-to-r from-white via-white to-violet-200 bg-clip-text text-transparent">
                interface loop.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-white/55">
            The feature set supports the workflow; it does not replace it as the
            core product story.
          </p>
        </div>

        {/* 6 Capability Cards — Clean Informative Presentation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-14 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {capabilityCards.map((item, index) => {
            const Icon = item.icon;
            const formattedIndex = String(index + 1).padStart(2, "0");

            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="transform-gpu"
              >
                <Surface
                  hover
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-7 transition-colors duration-300 bg-backgroundDark/50 hover:border-violet-400/30"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-400/[0.12] to-violet-500/[0.02] shadow-[0_0_15px_rgba(139,92,246,0.12)] transition-all duration-300 group-hover:border-violet-300/40 group-hover:shadow-[0_0_22px_rgba(139,92,246,0.26)]">
                        <Icon className="h-5 w-5 text-violet-300 transition-colors duration-200 group-hover:text-violet-200" />
                      </div>

                      <span className="text-xs font-medium tracking-widest text-white/30 transition-colors duration-200 group-hover:text-violet-300/70">
                        {formattedIndex}
                      </span>
                    </div>

                    <h3 className="mt-8 text-base font-medium tracking-tight text-white/95 transition-colors duration-200 group-hover:text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2.5 text-xs leading-relaxed text-white/55 transition-colors duration-200 group-hover:text-white/75">
                      {item.body}
                    </p>
                  </div>

                  {/* Clean footer indicator without dead interactive affordances */}
                  <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/40">
                      {item.tag}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-white/15 transition-colors duration-200 group-hover:bg-violet-400/70" />
                  </div>
                </Surface>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Interactive Model Layer Engine Surface */}
        <Surface className="mt-3.5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#07060A]/90 p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase text-violet-300/80">
                <Zap className="h-3 w-3 text-violet-400" />
                Intelligence Engine
              </div>

              <div className="mt-2 text-xl font-medium tracking-tight text-white/95">
                Choose the intelligence behind the interface.
              </div>

              <div className="mt-1 text-xs text-white/45">
                Model availability and reasoning effort adjust dynamically to
                your plan.
              </div>
            </div>

            {/* Selector Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {models.map((model, index) => {
                const isActive = index === modelIndex;

                return (
                  <button
                    key={model.name}
                    type="button"
                    onClick={() => setModelIndex(index)}
                    className={`relative rounded-xl border px-4 py-2.5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-400 ${
                      isActive
                        ? "border-violet-400/40 bg-violet-400/[0.12] shadow-[0_0_18px_rgba(139,92,246,0.18)]"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive
                            ? "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.9)]"
                            : "bg-white/25"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium tracking-tight ${
                          isActive ? "text-white" : "text-white/70"
                        }`}
                      >
                        {model.name}
                      </span>
                    </div>

                    <div className="mt-1 text-[10px] tracking-wide text-white/40">
                      {model.mode}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Model Telemetry Bar */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentModel.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-5 text-xs"
            >
              <div className="flex items-center gap-2.5 text-white/50">
                <Gauge className="h-3.5 w-3.5 text-violet-300" />
                <span>Active engine:</span>
                <span className="font-medium text-white/95">
                  {currentModel.name}
                </span>
                <span className="rounded-md border border-violet-400/25 bg-violet-400/[0.1] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-violet-200">
                  {currentModel.badge}
                </span>
              </div>

              <div className="flex items-center gap-5 text-xs text-white/45">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/30">Window:</span>
                  <span className="font-medium text-white/75">
                    {currentModel.context}
                  </span>
                </div>
                <div className="h-3 w-px bg-white/[0.08]" />
                <div className="flex items-center gap-1.5">
                  <span className="text-white/30">Latency:</span>
                  <span className="font-medium text-white/75">
                    {currentModel.speed}
                  </span>
                </div>
                <div className="h-3 w-px bg-white/[0.08]" />
                <div className="flex items-center gap-1.5 font-medium text-emerald-400/90">
                  <Check className="h-3.5 w-3.5" />
                  <span>Ready</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Surface>
      </div>
    </section>
  );
}
