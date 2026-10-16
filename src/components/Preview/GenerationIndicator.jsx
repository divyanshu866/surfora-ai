"use client";
import React, { useEffect, useState } from "react";

const PHASES = [
  { step: "01", label: "Synthesizing layout structure" },
  { step: "02", label: "Balancing component hierarchy" },
  { step: "03", label: "Resolving design tokens" },
];

export default function GeneratingIndicator() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050608]/94 px-6 backdrop-blur-md select-none"
    >
      <div className="flex flex-col items-center">
        {/* Architectural Workspace Frame */}
        <div
          aria-hidden="true"
          className="relative h-[180px] w-[267px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#08090e] shadow-[0_20px_48px_-12px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.03)]"
        >
          {/* Subtle Top Specular Sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

          {/* Calibrated Low-Profile Window Header (24px) */}
          <div className="flex h-6 items-center justify-between border-b border-white/[0.06] bg-white/[0.015] px-3">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-sm bg-violet-400/60" />
              <span className="font-mono text-[9px] font-medium tracking-wider text-zinc-500 uppercase">
                CANVAS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-zinc-600">16 : 9</span>
              <span className="h-1 w-1 rounded-full bg-violet-400/40" />
            </div>
          </div>

          {/* Symmetrical Layout Stage (240px x 128px active area) */}
          <div className="relative h-[147px] w-full p-[13px]">
            <div className="relative h-[128px] w-[240px]">
              {/* Tile A: Primary Violet Glass Hero Module */}
              <div className="gi-tile-a absolute rounded-lg border border-violet-500/25 bg-gradient-to-b from-[#16112c] via-[#100c1e] to-[#0a0814] p-3 shadow-[inset_0_1px_0_rgba(167,139,250,0.18)]">
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  {/* Micro Module Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-sm bg-violet-400/80" />
                      <div className="gi-hero-title h-1 rounded-full bg-violet-200/40" />
                    </div>
                    <div className="h-1 w-3 rounded-full bg-violet-400/20" />
                  </div>

                  {/* Micro Component Body */}
                  <div className="space-y-1.5">
                    <div className="gi-hero-body-1 h-1 rounded-full bg-violet-400/20" />
                    <div className="gi-hero-body-2 h-1 rounded-full bg-violet-400/10" />
                  </div>

                  {/* Micro Action Pill */}
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-7 rounded border border-violet-400/30 bg-violet-500/15" />
                    <div className="h-1 w-3 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>

              {/* Tile B: Secondary Obsidian Panel */}
              <div className="gi-tile-b absolute rounded-lg border border-white/[0.07] bg-[#0c0d14] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="h-1 w-5 rounded-full bg-white/25" />
                    <div className="h-1 w-1 rounded-full bg-white/10" />
                  </div>
                  <div className="space-y-1">
                    <div className="gi-sec-bar-1 h-1 rounded-full bg-white/[0.08]" />
                    <div className="gi-sec-bar-2 h-1 rounded-full bg-white/[0.04]" />
                  </div>
                  <div className="h-1 w-4 rounded-full bg-violet-400/25" />
                </div>
              </div>

              {/* Tile C: Tertiary Accent Panel */}
              <div className="gi-tile-c absolute rounded-lg border border-white/[0.06] bg-[#0a0b10] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400/30" />
                    <div className="h-1 w-4 rounded-full bg-white/15" />
                  </div>
                  <div className="h-1 w-6 rounded-full bg-white/[0.07]" />
                  <div className="h-1 w-3 rounded-full bg-violet-400/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deliberate Progress & Status Console */}
        <div className="mt-5 flex flex-col items-center">
          {/* Status Label & Micro Counter */}
          <div className="mt-3 flex items-center gap-2">
            <p
              key={phaseIndex}
              className="gi-text-fade text-[12px] font-medium tracking-[-0.01em] text-zinc-300"
            >
              {PHASES[phaseIndex].label}
            </p>
          </div>
        </div>

        <span className="sr-only">Generating interface, please wait.</span>
      </div>
    </div>
  );
}
