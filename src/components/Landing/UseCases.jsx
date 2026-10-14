import React from "react";
import {
  ArrowRight,
  TrendingUp,
  Activity,
  Terminal,
  Server,
  Sparkles,
  CheckCircle2,
  Globe,
  SlidersHorizontal,
} from "lucide-react";

// Design tokens & self-contained helpers
export const violet = "#8b5cf6";

export function SectionEyebrow({ children, className = "" }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/[0.08] px-3 py-1 text-xs font-medium tracking-wide text-violet-300 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
      {children}
    </div>
  );
}

export function Reveal({ children, className = "", delay = 0 }) {
  return (
    <div className={className} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

export function Surface({ children, className = "", hover = false }) {
  return (
    <div
      className={`relative rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#07060b]/90 backdrop-blur-xl ${
        hover
          ? "transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_35px_rgba(139,92,246,0.09)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

const useCases = [
  {
    title: "SaaS dashboards",
    description:
      "Turn product concepts into structured, working dashboard experiences with real-time data flows.",
    badge: "Telemetry & Analytics",
    accent: "analytics",
    colSpan: "md:col-span-1 lg:col-span-7",
  },
  {
    title: "Product pages",
    description:
      "Explore layouts, visual hierarchy, conversion patterns, and responsive behavior quickly.",
    badge: "Conversion Systems",
    accent: "product",
    colSpan: "md:col-span-1 lg:col-span-5",
  },
  {
    title: "Developer tools",
    description:
      "Prototype dense, technical workspaces and code editors without losing frontend fidelity.",
    badge: "Developer Experience",
    accent: "dev",
    colSpan: "md:col-span-1 lg:col-span-5",
  },
  {
    title: "Internal operations",
    description:
      "Move operational ideas, fleet management, and permissions from conversation to usable software.",
    badge: "Mission Control",
    accent: "ops",
    colSpan: "md:col-span-1 lg:col-span-7",
  },
];

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="relative isolate overflow-hidden bg-[#030204] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      {/* Precision ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[560px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-600/[0.08] via-violet-950/[0.03] to-transparent blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <SectionEyebrow>What you can build</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Start with the interface your product needs.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base sm:leading-7">
            From telemetry dashboards and high-conversion landing flows to dense
            developer tooling and internal operations, the same disciplined loop
            brings your idea to life.
          </p>
        </Reveal>

        {/* Responsive Bento Grid: 1 col on mobile, 2 cols on tablet, 12 cols on desktop */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {useCases.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.05}
              className={`flex flex-col ${item.colSpan}`}
            >
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07060b] transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_35px_rgba(139,92,246,0.1)] sm:rounded-3xl">
                {/* 1. Header & Context (Directly in card, zero nested boxes) */}
                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-violet-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                      {item.badge}
                    </span>

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/35 transition-all duration-300 group-hover:border-violet-400/30 group-hover:bg-violet-400/[0.08] group-hover:text-violet-200">
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-white transition-colors duration-200 group-hover:text-violet-100 sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/50 sm:text-sm sm:leading-6">
                    {item.description}
                  </p>
                </div>

                {/* 2. Integrated Preview Canvas: Bleeds flush to the card base */}
                <div className="relative flex flex-1 flex-col justify-end border-t border-white/[0.07] bg-[#040307]/75">
                  {/* Subtle hover radial spotlight */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative w-full p-3.5 sm:p-5">
                    <UseCasePreview type={item.accent} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCasePreview({ type }) {
  if (type === "analytics") {
    return (
      <div className="flex flex-col justify-between text-white">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-violet-400/25 bg-violet-400/[0.1]">
              <Activity className="h-3 w-3 text-violet-300" />
            </div>
            <span className="font-medium text-white/90 text-[11px] sm:text-xs">
              Inference Volume
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Stream
            </span>
          </div>
        </div>

        {/* Metrics Grid with Clean Hairline Separators */}
        <div className="grid grid-cols-3 gap-2 py-3 sm:gap-3">
          <div className="rounded-lg bg-white/[0.02] p-2 sm:p-2.5 border border-white/[0.04]">
            <div className="text-[10px] text-white/40">Throughput</div>
            <div className="mt-1 flex items-baseline justify-between sm:justify-start sm:gap-1.5">
              <span className="text-base font-semibold tracking-tight text-white sm:text-lg">
                4.8M
              </span>
              <span className="inline-flex items-center text-[10px] font-medium text-emerald-400">
                <TrendingUp className="mr-0.5 h-2.5 w-2.5" /> +24%
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-white/[0.02] p-2 sm:p-2.5 border border-white/[0.04]">
            <div className="text-[10px] text-white/40">P99 Latency</div>
            <div className="mt-1 flex items-baseline justify-between sm:justify-start sm:gap-1.5">
              <span className="text-base font-semibold tracking-tight text-white sm:text-lg">
                184ms
              </span>
              <span className="text-[10px] text-white/35">-12ms</span>
            </div>
          </div>

          <div className="rounded-lg bg-white/[0.02] p-2 sm:p-2.5 border border-white/[0.04]">
            <div className="text-[10px] text-white/40">Cache Hit</div>
            <div className="mt-1 flex items-baseline justify-between sm:justify-start sm:gap-1.5">
              <span className="text-base font-semibold tracking-tight text-white sm:text-lg">
                99.4%
              </span>
              <span className="text-[10px] text-emerald-400/80">Optimal</span>
            </div>
          </div>
        </div>

        {/* Sparkline Graph */}
        <div className="relative mt-1">
          <div className="mb-1.5 flex items-center justify-between text-[10px] text-white/35">
            <span>24h Generation Volume</span>
            <span className="font-mono text-violet-300/85">
              Peak: 340 req/s
            </span>
          </div>
          <div className="h-16 w-full sm:h-20">
            <svg
              viewBox="0 0 400 90"
              preserveAspectRatio="none"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 65 C45 60 70 45 110 50 S170 20 215 35 S280 50 330 18 S375 22 400 8 L400 90 L0 90 Z"
                fill="url(#areaGlow)"
              />
              <path
                d="M0 65 C45 60 70 45 110 50 S170 20 215 35 S280 50 330 18 S375 22 400 8"
                fill="none"
                stroke={violet}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="mt-1.5 flex justify-between font-mono text-[9px] text-white/20">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span className="text-violet-400/60">Now</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "product") {
    return (
      <div className="relative flex flex-col justify-between text-white">
        {/* Browser / App Frame Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
            <span className="ml-1 font-mono text-[10px] text-white/40">
              surfora.ai/engine
            </span>
          </div>

          <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-mono text-white/60">
            v2.8.4
          </span>
        </div>

        {/* Hero Banner Showcase */}
        <div className="py-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/25 bg-violet-400/[0.08] px-2.5 py-0.5 text-[10px] font-medium text-violet-200">
            <Sparkles className="h-3 w-3 text-violet-400" />
            Adaptive Interface Synthesis
          </div>

          <h4 className="mt-2.5 text-base font-semibold leading-snug tracking-tight text-white sm:text-lg">
            Design at the speed of thought.
          </h4>

          <p className="mt-1 max-w-sm text-xs leading-relaxed text-white/50">
            Generate production React layouts, components, and design systems
            from continuous prompts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 border-t border-white/[0.06] pt-3">
          <button
            type="button"
            className="flex h-7 sm:h-8 items-center justify-center rounded-lg bg-violet-400 px-3 text-[11px] sm:text-xs font-medium text-black transition-all hover:bg-violet-300"
          >
            Explore Workspace
          </button>
          <button
            type="button"
            className="flex h-7 sm:h-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-[11px] sm:text-xs font-medium text-white/70 hover:bg-white/[0.06]"
          >
            Documentation
          </button>
        </div>
      </div>
    );
  }

  if (type === "dev") {
    return (
      <div className="flex flex-col justify-between text-white font-mono text-[11px]">
        {/* Editor Tab Strip */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-violet-400/20 bg-violet-400/[0.08] px-2 py-0.5 text-violet-200">
              <Terminal className="h-3 w-3 text-violet-400" />
              <span>Workspace.jsx</span>
            </div>
            <span className="text-white/30 hover:text-white/50">
              tokens.css
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Ready</span>
          </div>
        </div>

        {/* Code Workspace Display with Line Numbers */}
        <div className="overflow-x-auto py-2.5 text-[11px] leading-5 text-white/70">
          <div className="flex gap-3">
            <div className="select-none text-right font-mono text-white/20">
              <div>1</div>
              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
            </div>
            <div className="whitespace-nowrap">
              <div>
                <span className="text-violet-400">export default function</span>{" "}
                <span className="text-white font-medium">TelemetryView</span>()
                &#123;
              </div>
              <div className="pl-3">
                <span className="text-violet-400">const</span> &#123;
                activeModel, effort &#125; ={" "}
                <span className="text-emerald-300">useRuntime()</span>;
              </div>
              <div className="pl-3">
                <span className="text-violet-400">return</span> (
                <span className="text-violet-300"> &lt;Surface</span>{" "}
                <span className="text-white/80">glow=&#123;true&#125;</span>
                <span className="text-violet-300">&gt;</span>
              </div>
              <div className="pl-6 text-white/90">
                &lt;ModelSwitcher model=&#123;activeModel&#125; /&gt;
              </div>
              <div className="pl-3 text-violet-300">&lt;/Surface&gt;</div>
            </div>
          </div>
        </div>

        {/* Compiler Status Bar */}
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-2 text-[10px] text-white/40">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>HMR updated in 12ms</span>
          </div>
          <span className="text-white/25">UTF-8 • Tailwind CSS</span>
        </div>
      </div>
    );
  }

  // Internal Operations / Mission Control
  return (
    <div className="flex flex-col justify-between text-white">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md border border-violet-400/25 bg-violet-400/[0.1]">
            <Server className="h-3 w-3 text-violet-300" />
          </div>
          <span className="font-medium text-white/90 text-[11px] sm:text-xs">
            Distributed Edge Nodes
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-2 py-0.5 text-[10px] text-violet-200">
          <Globe className="h-3 w-3 text-violet-400" />
          Global Fleet (3)
        </div>
      </div>

      {/* Cluster Nodes List - Streamlined Rows */}
      <div className="divide-y divide-white/[0.04] py-1.5">
        {[
          {
            region: "iad-1 (US East)",
            latency: "18ms",
            load: "42%",
            status: "Healthy",
            badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            region: "fra-1 (EU Central)",
            latency: "24ms",
            load: "68%",
            status: "Healthy",
            badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            region: "sin-1 (Asia East)",
            latency: "46ms",
            load: "84%",
            status: "Scaling",
            badge: "text-violet-300 bg-violet-500/10 border-violet-500/20",
          },
        ].map((node, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <div>
                <div className="font-medium text-white/90 text-[11px] sm:text-xs">
                  {node.region}
                </div>
                <div className="text-[10px] text-white/40">
                  Latency: {node.latency}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right text-[10px]">
                <span className="text-white/40">Load: </span>
                <span className="text-white/80 font-mono font-medium">
                  {node.load}
                </span>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${node.badge}`}
              >
                {node.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-2 text-[10px] text-white/40">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3 w-3 text-violet-300/60" />
          Auto-failover active
        </span>
        <span className="text-emerald-400/90 font-medium font-mono">
          99.99% Uptime
        </span>
      </div>
    </div>
  );
}
