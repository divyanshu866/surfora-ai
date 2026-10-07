import { motion } from "motion/react";
export const violet = "#8b5cf6";
export const models = [
  { name: "GPT-6 Luna", mode: "Fast & efficient" },

  { name: "GPT-6 Sol", mode: "Advanced reasoning" },

  { name: "Gemini 3.8 Flash", mode: "Fast multimodal" },

  { name: "GLM 5.3 Flash", mode: "Fast generation" },
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
