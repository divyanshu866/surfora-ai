import React from "react";
import { motion } from "motion/react";

const pillars = [
  {
    index: "01",
    label: "The one-shot ceiling",
    title: "Code generation isn't the finish line.",
    body: "Most AI coding tools treat the initial response as a one-way code dump—dropping raw files into an editor and leaving you stranded to debug the gaps. Real software is shaped in iterations; the first output is merely the starting point.",
    tag: "Continuous session · No cold start debugging",
  },
  {
    index: "02",
    label: "Visual dialogue",
    title: "Shape by seeing, not by guessing.",
    body: "Prompts shouldn't happen in the dark. Surfora keeps a living, reactive canvas front and center so you can evaluate visual hierarchy, density, and pacing with immediate optical feedback instead of reading raw code diffs.",
    tag: "Immediate visual feedback · Real-time canvas",
  },
  {
    index: "03",
    label: "In-place continuity",
    title: "Refine without wiping state.",
    body: "Conventional models reset context or re-scaffold everything from zero when you ask for a tweak. Surfora applies surgical, localized edits to your existing components—keeping what works while refining what doesn't.",
    tag: "Surgical edits · Context preserved",
  },
];

export default function TheWhy() {
  return (
    <section
      id="workflow"
      className="relative isolate overflow-hidden bg-[#030204] px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      {/* Precision ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-12 -z-10 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-600/[0.06] via-violet-950/[0.02] to-transparent blur-[140px]"
      />

      {/* Top hairline border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.06] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.16em] text-violet-300">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Why SurforaAI
          </div>

          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl lg:leading-[1.08]">
            Generation is only the beginning.
          </h2>

          <p className="mt-5 text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
            Most AI code workflows end when the first output arrives. SurforaAI
            is built around what comes next: seeing the interface, talking
            through changes, and refining it in-place without breaking flow.
          </p>
        </div>

        {/* 3-Column Editorial Triptych (Zero nested cards) */}
        <div className="mt-16 grid grid-cols-1 divide-y divide-white/[0.08] md:grid-cols-3 md:divide-x md:divide-y-0 lg:mt-20">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.index}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.1, duration: 0.45 }}
              className="flex flex-col justify-between py-8 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0"
            >
              <div>
                {/* Node Index + Label */}
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-medium tracking-wider text-violet-400">
                    {pillar.index}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">
                    {pillar.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-xl font-medium tracking-tight text-white sm:text-2xl sm:leading-snug">
                  {pillar.title}
                </h3>

                {/* Body Copy */}
                <p className="mt-3.5 text-sm leading-relaxed text-white/50 sm:text-[15px] sm:leading-7">
                  {pillar.body}
                </p>
              </div>

              {/* Quiet Micro Tag */}
              <div className="mt-8 flex items-center gap-2 pt-2 text-xs font-mono text-white/35 sm:mt-10">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400/70" />
                <span>{pillar.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
