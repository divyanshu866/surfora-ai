import { Cpu, Gauge, Layers3, Zap } from "lucide-react";

const SIGNALS = [[Cpu, "More models"], [Gauge, "More effort"], [Layers3, "More workflow"]];

export default function UpgradeHero() {
  return (
    <section className="max-w-2xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/12 bg-violet-300/[0.035] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-200/70">
        <Zap className="h-3 w-3" />
        Upgrade your workspace
      </div>

      <h1 className="mt-6 text-[clamp(2.9rem,5vw,5.25rem)] font-[450] leading-[0.96] tracking-[-0.065em] text-white">
        More room to build.
        <span className="block bg-gradient-to-r from-white via-violet-100 to-fuchsia-200 bg-clip-text text-transparent">
          More power to refine.
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/42 sm:text-base">
        Pro gives your interface workflow more capable models, broader effort controls,
        and more room to keep iterating after the first generation.
      </p>

      <div className="mt-8 grid max-w-xl grid-cols-3 gap-2.5">
        {SIGNALS.map(([Icon, label]) => (
          <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.018] px-3 py-3">
            <Icon className="h-3.5 w-3.5 text-violet-300/70" />
            <div className="mt-2 text-[11px] font-medium text-white/58">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
