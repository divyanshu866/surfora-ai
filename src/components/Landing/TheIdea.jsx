import React from "react";
import { motion } from "motion/react";
import { SectionEyebrow } from "./Helpers";
import {
  Command,
  Monitor,
  RotateCcw,
  Sparkles,
  WandSparkles,
  ChevronRight,
} from "lucide-react";

const workflow = [
  {
    number: "01",
    title: "Describe",
    body: "Start with what you want to build. Natural language becomes the interface brief.",
    icon: Command,
  },
  {
    number: "02",
    title: "Generate",
    body: "SurforaAI turns the idea into a working frontend instead of stopping at a mockup.",
    icon: WandSparkles,
  },
  {
    number: "03",
    title: "Preview",
    body: "See the result live, in context, while the generated interface is still in motion.",
    icon: Monitor,
  },
  {
    number: "04",
    title: "Rework",
    body: "Describe the change you want. SurforaAI works from the existing interface, not a blank canvas.",
    icon: RotateCcw,
  },
  {
    number: "05",
    title: "Refine",
    body: "Keep iterating until the interface feels right, with the conversation and implementation connected.",
    icon: Sparkles,
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

const cardVariants = {
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
    <section className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
        <div>
          <SectionEyebrow>The idea</SectionEyebrow>

          <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
            Shorten the distance between what you imagine and what you can
            build.
          </h2>
        </div>

        <div className="max-w-2xl pb-1 text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
          SurforaAI connects intent, AI generation, real frontend code, a live
          preview, and AI-powered rework in one continuous loop—so interface
          development becomes more direct, visual, and conversational.
        </div>
      </div>

      <div className="relative mx-auto mt-12 max-w-7xl overflow-hidden rounded-[28px] border border-white/[0.085] bg-[#040404] p-4 sm:p-6 lg:p-8">
        {/* Subtle atmospheric ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[540px] -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[90px]"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 grid gap-3 sm:grid-cols-5"
        >
          {workflow.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className="group relative transform-gpu rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.035] to-white/[0.008] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-400/35 hover:bg-violet-500/[0.035] hover:shadow-[0_12px_28px_-10px_rgba(139,92,246,0.22),inset_0_1px_0_0_rgba(255,255,255,0.12)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-white/35 transition-colors duration-200 group-hover:text-violet-300/70">
                    {item.number}
                  </span>

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] transition-colors duration-200 group-hover:border-violet-400/30 group-hover:bg-violet-400/[0.08]">
                    <Icon className="h-3.5 w-3.5 text-violet-300/75 transition-colors duration-200 group-hover:text-violet-200" />
                  </div>
                </div>

                <h3 className="mt-10 text-base font-semibold tracking-tight text-white/90 transition-colors duration-200 group-hover:text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/50 transition-colors duration-200 group-hover:text-white/65">
                  {item.body}
                </p>

                {index < workflow.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center sm:flex"
                  >
                    <div className="h-px w-3 bg-gradient-to-r from-violet-400/30 via-violet-300/40 to-violet-400/20" />
                    <div className="absolute h-1.5 w-1.5 rounded-full bg-violet-400/40 shadow-[0_0_6px_rgba(167,139,250,0.6)]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
