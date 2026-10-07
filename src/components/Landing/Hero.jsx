import { ArrowRight, ChevronRight, Zap } from "lucide-react";
import { Glow, Reveal } from "./Helpers";
import WorkspaceDemo from "./WorkspaceDemo";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-5 pb-0 pt-24 sm:px-6 sm:pt-30 lg:px-8 lg:pt-32"
    >
      <div className="pointer-events-none absolute top-0 left-0 inset-0 bg-[radial-gradient(ellipse_72%_58%_at_50%_43%,rgba(124,58,237,0.15)_0%,rgba(124,58,237,0.09)_28%,rgba(124,58,237,0.035)_52%,transparent_76%),radial-gradient(ellipse_38%_32%_at_18%_78%,rgba(217,70,239,0.055)_0%,transparent_72%),radial-gradient(ellipse_38%_32%_at_84%_18%,rgba(99,102,241,0.05)_0%,transparent_72%)]" />

      <div className="relative mx-auto max-w-6xl text-center">
        {/* Eyebrow */}
        <Reveal>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.045] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-100/80">
            <Zap className="h-3 w-3 text-violet-300" />
            AI interface development
          </div>
        </Reveal>

        {/* Compact hero statement */}
        <Reveal delay={0.05}>
          <h1 className="mx-auto max-w-5xl text-balance text-[clamp(3rem,6.6vw,6.2rem)] font-medium leading-[0.94] tracking-[-0.065em] text-white">
            Your interface starts with a{" "}
            <span className="text-violet-300">sentence.</span>
          </h1>
        </Reveal>

        {/* Supporting explanation */}
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-7 text-white/58 sm:mt-7 sm:text-lg sm:leading-8">
            Describe what you want to build. SurforaAI generates a working
            interface, shows it live, and lets you keep shaping the same
            experience through conversation.
          </p>
        </Reveal>

        {/* Actions */}
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/workspace"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black shadow-[0_18px_55px_rgba(255,255,255,.07)] transition duration-200 hover:bg-violet-100 sm:w-auto"
            >
              Start building free
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>

            <a
              href="#workflow"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/[0.11] bg-white/[0.02] px-5 py-3 text-sm font-medium text-white/72 transition duration-200 hover:border-white/[0.18] hover:bg-white/[0.04] hover:text-white sm:w-auto"
            >
              See how it works
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>

        {/* Small capability line */}
        <Reveal delay={0.2}>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[9px] font-medium uppercase tracking-[0.16em] text-white/32">
            <span>Natural language</span>
            <span>Working frontend</span>
            <span>Live preview</span>
            <span>AI rework</span>
          </div>
        </Reveal>
      </div>

      {/* Product spectacle */}
      <Reveal delay={0.25} className="relative mt-11 sm:mt-13 lg:mt-14">
        <div className="mx-auto">
          <div className="mb-3 flex items-center justify-center text-[9px] font-medium uppercase tracking-[0.18em] text-white/28">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            Live workspace
          </div>

          <div className="relative">
            {/* Glow is intentionally outside the workspace */}
            {/* <div className="pointer-events-none absolute -inset-5 rounded-[32px] bg-[linear-gradient(120deg,rgba(139,92,246,.13),transparent_35%,transparent_65%,rgba(236,72,153,.075))] blur-2xl" /> */}

            <div className="relative">
              <WorkspaceDemo />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
