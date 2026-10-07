"use client";
import React, { useEffect, useState } from "react";
import { Hammer, Sparkles } from "lucide-react";

export default function GeneratingIndicator() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#09090b]/90 px-6 backdrop-blur-[2px]"
    >
      <div className="flex flex-col items-center text-center">
        <div aria-hidden="true" className="relative mb-9 h-44 w-64">
          <div className="absolute inset-x-2 bottom-0 top-5 overflow-hidden rounded-xl border border-white/10 bg-[#111115] shadow-2xl shadow-black/30">
            <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.07] px-3">
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
              <span className="ml-auto h-1.5 w-12 rounded-full bg-white/[0.08]" />
            </div>

            <div className="flex gap-3 p-3">
              <div className="flex w-10 flex-col gap-2 border-r border-white/[0.07] pr-3">
                <span className="h-2 w-6 rounded-sm bg-violet-500/60" />
                <span className="h-1.5 w-5 rounded-sm bg-white/10" />
                <span className="h-1.5 w-6 rounded-sm bg-white/10" />
                <span className="h-1.5 w-4 rounded-sm bg-white/10" />
              </div>
              <div className="flex-1">
                <div className="mb-2 h-2 w-20 rounded-sm bg-white/25" />
                <div className="mb-3 h-1.5 w-32 rounded-sm bg-white/10" />
                <div className="flex gap-2">
                  <div className="cl-build-card h-14 flex-1 rounded-md border border-violet-400/20 bg-violet-500/10 p-2">
                    <div className="mb-2 h-2 w-5 rounded-sm bg-violet-400/50" />
                    <div className="h-1 w-10 rounded-sm bg-violet-300/20" />
                  </div>
                  <div className="cl-build-card cl-build-card-delay h-14 flex-1 rounded-md border border-white/[0.08] bg-white/[0.04] p-2">
                    <div className="mb-2 h-2 w-5 rounded-sm bg-white/20" />
                    <div className="h-1 w-10 rounded-sm bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Hammer
            size={29}
            strokeWidth={1.7}
            className="cl-build-hammer absolute right-0 top-0 text-violet-300"
          />
          <Sparkles
            size={15}
            strokeWidth={1.7}
            className="cl-build-sparkle absolute right-8 top-9 text-fuchsia-400"
          />
        </div>

        <h2 className="text-base font-semibold tracking-tight text-zinc-100">
          Building your user interface
        </h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400">
          Your interface is coming together.
        </p>
        <span className="sr-only">Generating your interface, please wait.</span>
      </div>
    </div>
  );
}
