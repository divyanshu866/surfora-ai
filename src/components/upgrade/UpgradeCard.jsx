"use client";

import { useState } from "react";
import { ArrowRight, CircleHelp, Check, Sparkles } from "lucide-react";
import CheckoutModal from "./CheckoutModal";
import { PaddleUpgradeButton } from "./PaddleUpgradeButton";

const PRO_FEATURES = [
  "More AI capabilities",
  "Higher generation capacity",
  "GPT-6 Luna — broader effort range",
  "GPT-6 Sol — advanced reasoning",
  "Gemini 3.8 Flash",
  "GLM 5.3 Flash",
  "Full interface generation + rework workflow",
];

function BillingToggle({ yearly, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.018] p-1">
      <button
        type="button"
        aria-pressed={!yearly}
        onClick={() => onChange(false)}
        className={`rounded-lg px-4 py-2 text-xs font-medium transition ${!yearly ? "bg-white/[0.08] text-white" : "text-white/35 hover:text-white/70"}`}
      >
        Monthly
      </button>
      <button
        type="button"
        aria-pressed={yearly}
        onClick={() => onChange(true)}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition ${yearly ? "bg-violet-400/[0.10] text-violet-100" : "text-white/35 hover:text-white/70"}`}
      >
        Yearly
        <span className="rounded-md bg-violet-300/[0.12] px-1.5 py-0.5 text-[9px] font-semibold text-violet-200">
          Save 20%
        </span>
      </button>
    </div>
  );
}

function ProFeatureList() {
  return (
    <div className="space-y-3">
      {PRO_FEATURES.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-violet-300/[0.11] text-violet-200">
            <Check className="h-2.5 w-2.5" strokeWidth={2.4} />
          </span>
          <span className="text-sm leading-5 text-white/70">{item}</span>
        </div>
      ))}
    </div>
  );
}

export default function UpgradeCard({ userId }) {
  const [yearly, setYearly] = useState(true);
  const monthlyPrice = yearly ? 16 : 20;

  return (
    <div>
      <div className="mb-4 flex flex-col items-center gap-4 text-center">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/25">
            Choose your plan
          </div>
          <p className="mt-1 text-xs text-white/30">
            Switch billing whenever it makes sense.
          </p>
        </div>
        <BillingToggle yearly={yearly} onChange={setYearly} />
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-violet-300/20 bg-[#0b080e] p-6 shadow-[0_30px_120px_rgba(124,58,237,0.10)] sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/[0.09] blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-7rem] left-[-5rem] h-48 w-48 rounded-full bg-fuchsia-500/[0.05] blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Pro</h2>
                <span className="rounded-full border border-violet-300/15 bg-violet-300/[0.07] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-violet-200">
                  Recommended
                </span>
              </div>
              <p className="mt-1.5 text-xs text-white/32">
                For ongoing interface development.
              </p>
            </div>
            <Sparkles className="h-4 w-4 text-violet-300/70" />
          </div>

          <div className="mt-7 flex items-end gap-2">
            <span className="text-[4rem] font-semibold leading-none tracking-[-0.065em] text-white">
              ${monthlyPrice}
            </span>
            <span className="pb-1 text-xs text-white/30">/ month</span>
          </div>

          <p className="mt-2 text-xs text-white/30">
            {yearly
              ? "$192 / year · save $48 / year"
              : "$20 / month · billed monthly"}
          </p>

          <div className="my-7 h-px bg-white/[0.07]" />
          <ProFeatureList />

          <PaddleUpgradeButton userId={userId} yearly={yearly} />

          <div className="mt-3 text-center text-[10px] text-white/24">
            Secure checkout · Cancel anytime
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/22">
        <CircleHelp className="h-3 w-3" />
        Questions about plans? Talk to support.
      </div>
    </div>
  );
}
