import React from "react";
import {
  ArrowRight,
  TrendingUp,
  Activity,
  Terminal,
  Server,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { Reveal, SectionEyebrow, Surface, violet } from "./Helpers";

const useCases = [
  {
    title: "SaaS dashboards",
    description:
      "Turn product concepts into structured, working dashboard experiences with real-time data flows.",
    badge: "Telemetry & Analytics",
    accent: "analytics",
    colSpan: "lg:col-span-7",
  },
  {
    title: "Product pages",
    description:
      "Explore layouts, visual hierarchy, conversion patterns, and responsive behavior quickly.",
    badge: "Conversion Systems",
    accent: "product",
    colSpan: "lg:col-span-5",
  },
  {
    title: "Developer tools",
    description:
      "Prototype dense, technical workspaces and code editors without losing frontend fidelity.",
    badge: "Developer Experience",
    accent: "dev",
    colSpan: "lg:col-span-5",
  },
  {
    title: "Internal operations",
    description:
      "Move operational ideas, fleet management, and permissions from conversation to usable software.",
    badge: "Mission Control",
    accent: "ops",
    colSpan: "lg:col-span-7",
  },
];

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="relative isolate overflow-hidden bg-[#030204] px-5 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      {/* Precision ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[560px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-600/[0.07] via-violet-950/[0.03] to-transparent blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-28 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <SectionEyebrow>What you can build</SectionEyebrow>
          <h2 className="max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
            Start with the interface your product needs.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
            From telemetry dashboards and high-conversion product landing flows
            to dense developer tooling and internal operations, the same
            disciplined loop brings your idea to life.
          </p>
        </Reveal>

        {/* 12-Column Alternating Bento Grid */}
        <div className="mt-14 grid gap-4 lg:grid-cols-12 lg:gap-5">
          {useCases.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.05}
              className={`flex flex-col ${item.colSpan}`}
            >
              <Surface
                hover
                className="group relative flex h-full flex-col justify-between overflow-hidden p-2.5 sm:p-3"
              >
                {/* Visual UI Preview Container */}
                <div className="relative overflow-hidden rounded-[20px] border border-white/[0.07] bg-[#060509]">
                  {/* Subtle hover radial spotlight */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_48%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative h-64 w-full p-3 sm:h-72 sm:p-4">
                    <UseCasePreview type={item.accent} />
                  </div>
                </div>

                {/* Card Meta & Description */}
                <div className="flex items-start justify-between gap-6 px-3.5 pb-4 pt-5 sm:px-4 sm:pb-5">
                  <div>
                    <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/[0.06] px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-violet-200">
                      {item.badge}
                    </div>

                    <h3 className="text-base font-medium tracking-tight text-white transition-colors duration-200 group-hover:text-white sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-xs leading-5 text-white/50 transition-colors duration-200 group-hover:text-white/70 sm:text-sm sm:leading-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] transition-all duration-300 group-hover:border-violet-400/35 group-hover:bg-violet-400/[0.08]">
                    <ArrowRight className="h-4 w-4 text-white/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-violet-200" />
                  </div>
                </div>
              </Surface>
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
      <div className="flex h-full flex-col justify-between rounded-xl border border-white/[0.07] bg-[#08070B] p-4 text-white">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-400/[0.1]">
              <Activity className="h-3.5 w-3.5 text-violet-300" />
            </div>
            <span className="font-medium text-white/85">Inference Volume</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live Stream
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 sm:gap-3">
          <div className="rounded-lg border border-white/[0.05] bg-white/[0.015] p-2.5">
            <div className="text-[10px] text-white/40">Throughput</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-semibold tracking-tight text-white">
                4.8M
              </span>
              <span className="inline-flex items-center text-[10px] font-medium text-emerald-400">
                <TrendingUp className="mr-0.5 h-2.5 w-2.5" /> +24%
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.05] bg-white/[0.015] p-2.5">
            <div className="text-[10px] text-white/40">P99 Latency</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-semibold tracking-tight text-white">
                184ms
              </span>
              <span className="text-[10px] text-white/35">-12ms</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.05] bg-white/[0.015] p-2.5">
            <div className="text-[10px] text-white/40">Cache Hit</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-semibold tracking-tight text-white">
                99.4%
              </span>
              <span className="text-[10px] text-emerald-400/80">Optimal</span>
            </div>
          </div>
        </div>

        {/* SVG Sparkline Graph */}
        <div className="relative rounded-lg border border-white/[0.05] bg-black/40 p-3">
          <div className="flex items-center justify-between text-[10px] text-white/35 mb-1.5">
            <span>24h Generation Volume</span>
            <span className="text-violet-300/80">Peak: 340 req/s</span>
          </div>
          <div className="h-14 w-full">
            <svg
              viewBox="0 0 400 90"
              className="h-full w-full overflow-visible"
            >
              <defs>
                <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.32" />
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
        </div>
      </div>
    );
  }

  if (type === "product") {
    return (
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-white/[0.07] bg-[#08070B] p-4 text-white">
        <div className="pointer-events-none absolute right-0 top-0 -mr-10 -mt-10 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl" />

        {/* Product Navigation Header Mock */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-white flex items-center justify-center font-bold text-black text-[10px]">
              S
            </div>
            <span className="font-medium text-white/90">Aura Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/60">
              v2.8.4
            </span>
          </div>
        </div>

        {/* Hero Banner Showcase */}
        <div className="my-auto py-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/25 bg-violet-400/[0.08] px-2.5 py-0.5 text-[10px] font-medium text-violet-200">
            <Sparkles className="h-3 w-3 text-violet-400" />
            Adaptive Interface Synthesis
          </div>

          <h4 className="mt-2.5 text-lg font-semibold tracking-tight text-white leading-tight">
            Design at the speed of thought.
          </h4>

          <p className="mt-1 text-xs leading-relaxed text-white/50 max-w-xs">
            Generate production React layouts, components, and design systems
            from continuous prompts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 border-t border-white/[0.06] pt-3">
          <div className="flex h-8 items-center justify-center rounded-lg bg-violet-400 px-3.5 text-xs font-medium text-black shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]">
            Explore Workspace
          </div>
          <div className="flex h-8 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.03] px-3.5 text-xs font-medium text-white/70">
            Documentation
          </div>
        </div>
      </div>
    );
  }

  if (type === "dev") {
    return (
      <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-white/[0.07] bg-[#08070B] text-white">
        {/* Editor Tab Strip */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#050407] px-3 py-2 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-violet-200">
              <Terminal className="h-3 w-3 text-violet-400" />
              <span>Workspace.jsx</span>
            </div>
            <span className="text-white/30 hover:text-white/50 transition">
              tokens.css
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Ready</span>
          </div>
        </div>

        {/* Code Workspace Display */}
        <div className="flex-1 p-3.5 font-mono text-[11px] leading-5 text-white/60">
          <div className="text-white/30 select-none"></div>
          <div>
            <span className="text-violet-400">export default function</span>{" "}
            <span className="text-white font-medium">TelemetryView</span>()
            &#123;
          </div>
          <div className="pl-3">
            <span className="text-violet-400">const</span> &#123; activeModel,
            effort &#125; ={" "}
            <span className="text-emerald-300">useRuntime()</span>;
          </div>
          <div className="pl-3">
            <span className="text-violet-400">return</span> (
            <span className="text-violet-300"> &lt;Surface</span>{" "}
            <span className="text-white/80">glow=&#123;true&#125;</span>
            <span className="text-violet-300">&gt;</span>
          </div>
          <div className="pl-6 text-white/80">
            &lt;ModelSwitcher model=&#123;activeModel&#125; /&gt;
          </div>
          <div className="pl-3 text-violet-300">&lt;/Surface&gt;</div>
          <div>&#125;</div>
        </div>

        {/* Compiler Status Bar */}
        <div className="flex items-center justify-between border-t border-white/[0.06] bg-[#040306] px-3.5 py-2 text-[10px] text-white/40">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>HMR updated in 12ms</span>
          </div>
          <span className="text-white/25">UTF-8 • Tailwind CSS</span>
        </div>
      </div>
    );
  }

  // Internal Operations / Mission Control
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-white/[0.07] bg-[#08070B] p-4 text-white">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-400/[0.1]">
            <Server className="h-3.5 w-3.5 text-violet-300" />
          </div>
          <span className="font-medium text-white/85">
            Distributed Edge Nodes
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-2.5 py-0.5 text-[10px] text-violet-200">
          <Globe className="h-3 w-3 text-violet-400" />
          Global Fleet
        </div>
      </div>

      {/* Cluster Nodes List */}
      <div className="space-y-2 py-2">
        {[
          {
            region: "iad-1 (US East)",
            status: "Healthy",
            latency: "18ms",
            load: "42%",
            statusColor:
              "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            region: "fra-1 (EU Central)",
            status: "Healthy",
            latency: "24ms",
            load: "68%",
            statusColor:
              "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            region: "sin-1 (Asia East)",
            status: "Scaling",
            latency: "46ms",
            load: "84%",
            statusColor:
              "text-violet-300 bg-violet-500/10 border-violet-500/20",
          },
        ].map((node, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <div>
                <div className="font-medium text-white/90">{node.region}</div>
                <div className="text-[10px] text-white/40">
                  Latency: {node.latency}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right text-[10px]">
                <span className="text-white/40">Load: </span>
                <span className="text-white/80 font-medium">{node.load}</span>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${node.statusColor}`}
              >
                {node.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5 text-[10px] text-white/40">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3 w-3 text-violet-300/60" />
          Auto-failover enabled
        </span>
        <span className="text-emerald-400/90 font-medium">99.99% Uptime</span>
      </div>
    </div>
  );
}
