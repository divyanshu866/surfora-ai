import { motion } from "motion/react";
export const violet = "#8b5cf6";
export const models = [
  {
    name: "GPT-6 Luna",
    mode: "Fast & efficient",
    context: "256k tokens",
    speed: "Ultra fast",
    badge: "Popular",
    latency: "140ms",
    cost: "$0.40 / 1M tokens",
    iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    badgeColor: "bg-amber-400/10 text-amber-300 border-amber-400/30",
    desc: "Lightweight autonomous agent core optimized for ultra-low latency pipelines and real-time user-facing dialogs.",
  },
  {
    name: "GPT-6 Sol",
    mode: "Advanced reasoning",
    context: "512k tokens",
    speed: "Deep think",
    badge: "Flagship",
    latency: "680ms",
    cost: "$2.50 / 1M tokens",
    iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    badgeColor: "bg-purple-400/10 text-purple-300 border-purple-400/30",
    desc: "Multi-step analytical reasoning engine for complex mathematical logic, system architecture, and scientific synthesis.",
  },
  {
    name: "Gemini 3.8 Flash",
    mode: "Fast multimodal",
    context: "2M tokens",
    speed: "Near-instant",
    badge: "Multimodal",
    latency: "95ms",
    cost: "$0.65 / 1M tokens",
    iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    badgeColor: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
    desc: "High-throughput vision, audio, and large-context document ingestion with continuous real-time vector indexing.",
  },
  {
    name: "GLM 5.3 Flash",
    mode: "Fast generation",
    context: "128k tokens",
    speed: "High throughput",
    badge: "Cost efficient",
    latency: "110ms",
    cost: "$0.18 / 1M tokens",
    iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    badgeColor: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
    desc: "Hyper-optimized code generation, multilingual structuring, and high-volume background data processing.",
  },
];

export function Surface({ children, className = "", hover = false }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#050505] ${
        hover
          ? "transition duration-300 hover:border-white/[0.14] hover:bg-[#070707]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
export function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,

        delay,

        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionEyebrow({ children }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/50">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

      {children}
    </div>
  );
}
export function Glow({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        background: `radial-gradient(circle, ${violet}35 0%, transparent 70%)`,
      }}
    />
  );
}
