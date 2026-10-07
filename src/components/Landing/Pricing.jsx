import { Check } from "lucide-react";
import React, { useState } from "react";
import { SectionEyebrow, Surface } from "./Helpers";

export default function Pricing() {
  const [billing, setBilling] = useState("yearly");

  return (
    <section id="pricing" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Pricing</SectionEyebrow>

          <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Start free. Upgrade when the loop becomes part of your workflow.
          </h2>

          <p className="mt-5 text-base leading-7 text-white/52">
            Try the real SurforaAI generation and refinement workflow before
            committing to Pro.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-sm items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.015] p-1">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs transition ${billing === "monthly" ? "bg-white/[0.07] text-white" : "text-white/38 hover:text-white/60"}`}
          >
            Monthly
          </button>

          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={`flex-1 rounded-lg px-3 py-2 text-xs transition ${billing === "yearly" ? "bg-violet-400/[0.08] text-violet-100" : "text-white/38 hover:text-white/60"}`}
          >
            Yearly · Save 20%
          </button>
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl gap-3 md:grid-cols-2">
          <Surface className="p-7 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium">Free</div>

                <p className="mt-1 text-xs text-white/38">
                  Experience the actual workflow.
                </p>
              </div>

              <span className="rounded-full border border-white/[0.09] px-2.5 py-1 text-[9px] text-white/32">
                $0
              </span>
            </div>

            <div className="mt-8 text-4xl font-semibold tracking-[-0.05em]">
              $0
            </div>

            <div className="mt-1 text-xs text-white/32">forever</div>

            <div className="my-7 h-px bg-white/[0.06]" />

            <div className="space-y-3 text-xs text-white/52">
              {[
                "Up to 3 generations per day",

                "Maximum 20 generations per month",

                "GPT-6 Luna — Low + Medium effort",

                "GLM 5.3 Flash",
              ].map((item) => (
                <div key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300/75" />

                  {item}
                </div>
              ))}
            </div>

            <a
              href="/workspace"
              className="mt-8 flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm font-medium transition hover:border-white/[0.15] hover:bg-white/[0.045]"
            >
              Start free
            </a>
          </Surface>

          <div className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-[#060406] p-7 shadow-[0_24px_80px_rgba(139,92,246,0.08)] sm:p-8">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  Pro{" "}
                  <span className="rounded-full bg-violet-400/10 px-2 py-0.5 text-[8px] uppercase tracking-[0.15em] text-violet-200">
                    Most access
                  </span>
                </div>

                <p className="mt-1 text-xs text-white/38">
                  For ongoing interface development.
                </p>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-violet-200/70">
                  {billing === "yearly" ? "Billed yearly" : "Billed monthly"}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-[-0.055em]">
                ${billing === "yearly" ? "16" : "20"}
              </span>

              <span className="pb-1 text-xs text-white/32">/ month</span>
            </div>

            <div className="mt-1 text-xs text-white/32">
              {billing === "yearly"
                ? "$192 / year · save $48 / year · 20% savings"
                : "$20 / month · billed monthly"}
            </div>

            <div className="my-7 h-px bg-white/[0.06]" />

            <div className="space-y-3 text-xs text-white/50">
              {[
                "More AI capabilities",

                "More powerful model and effort configurations",

                "Built for ongoing interface development",

                "Continue the same interface through refinement",
              ].map((item) => (
                <div key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-300" />

                  {item}
                </div>
              ))}
            </div>

            <a
              href="/upgrade"
              className="mt-8 flex items-center justify-center rounded-xl bg-violet-400 px-4 py-3 text-sm font-medium text-black transition hover:bg-violet-300"
            >
              Choose Pro
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
