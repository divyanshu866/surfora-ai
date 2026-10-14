import React from "react";
import { motion } from "motion/react";
import { SectionEyebrow } from "./Helpers";

const workflow = [
  {
    number: "01",
    title: "Describe",
    body: "Start with what you want to build. Natural language becomes the interface brief.",
  },
  {
    number: "02",
    title: "Generate",
    body: "SurforaAI turns the idea into a working frontend instead of stopping at a mockup.",
  },
  {
    number: "03",
    title: "Preview",
    body: "See the result live, in context, while the generated interface is still in motion.",
  },
  {
    number: "04",
    title: "Rework",
    body: "Describe the change you want. SurforaAI works from the existing interface, not a blank canvas.",
  },
  {
    number: "05",
    title: "Refine",
    body: "Keep iterating until the interface feels right, with the conversation and implementation connected.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const stepVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function TheIdea() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 sm:gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end lg:gap-12">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.06] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.16em] text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            The idea
          </div>
          <h2 className="max-w-xl text-3xl font-semibold leading-[1.15] tracking-[-0.035em] sm:text-4xl sm:leading-tight sm:tracking-[-0.045em] lg:text-5xl">
            Shorten the distance between what you imagine and what you can
            build.
          </h2>
        </div>

        <div className="max-w-2xl pb-1 text-sm leading-6 text-white/50 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
          SurforaAI connects intent, AI generation, real frontend code, a live
          preview, and AI-powered rework in one continuous loop—so interface
          development becomes more direct, visual, and conversational.
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-7xl rounded-xl border border-white/[0.085] bg-[#040404] p-5 sm:mt-12 sm:rounded-2xl sm:p-8 lg:p-10 xl:p-12">
        {/* Ambient atmospheric backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-56 w-[380px] -translate-x-1/2 rounded-full bg-violet-600/[0.14] blur-[90px] sm:h-64 sm:w-[560px] sm:blur-[100px]"
        />

        {/* Mobile vertical timeline track */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 left-[40px] top-10 w-px -translate-x-1/2 bg-gradient-to-b from-violet-500/50 via-violet-400/25 to-transparent sm:hidden"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="relative z-10 grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-5 lg:gap-6 xl:gap-8"
        >
          {workflow.map((item, index) => {
            return (
              <motion.div
                key={item.title}
                variants={stepVariants}
                className="group relative flex items-start gap-4 pb-7 last:pb-1 sm:block sm:gap-0 sm:pb-0 sm:last:col-span-2 lg:last:col-span-1"
              >
                {/* Horizontal pipeline track segments (Desktop only) */}
                {index < workflow.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-10 -right-6 top-5 z-0 hidden h-px -translate-y-1/2 lg:block xl:-right-8"
                  >
                    <div className="h-px w-full bg-white/[0.08] transition-colors duration-300 group-hover:bg-violet-400/35" />
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/40 via-violet-400/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                )}

                {/* Step Station Number Node */}
                <div className="relative z-10 flex shrink-0 items-center">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.12] bg-[#09080e] font-mono text-[13px] font-semibold tracking-wider text-violet-300 shadow-[0_0_16px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:scale-105 group-hover:border-violet-400/50 group-hover:bg-[#100d1c] group-hover:text-violet-200 group-hover:shadow-[0_0_22px_rgba(167,139,250,0.25)]">
                    {item.number}
                  </div>
                </div>

                {/* Step Typography */}
                <div className="min-w-0 flex-1 pt-1.5 sm:pt-0">
                  <h3 className="text-sm font-semibold tracking-tight text-white/95 transition-colors duration-200 group-hover:text-white sm:mt-5 sm:text-base lg:mt-6">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-white/50 transition-colors duration-200 group-hover:text-white/65 sm:mt-2 sm:text-[13px] sm:leading-6">
                    {item.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
