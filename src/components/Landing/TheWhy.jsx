import { ArrowRight, Check, MousePointer2 } from "lucide-react";
import { motion } from "motion/react";
import { SectionEyebrow, Surface } from "./Helpers";

export default function TheWhy() {
  return (
    <section
      id="workflow"
      className="relative px-5 py-20 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="absolute inset-x-0 top-1/3 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-violet-400/10 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <SectionEyebrow>Why SurforaAI</SectionEyebrow>

          <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Generation is only the beginning.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/50">
            Most AI code workflows end when the first output arrives. SurforaAI
            is built around what comes next: seeing the interface, talking about
            it, changing it, and refining it without breaking the flow.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <Surface className="relative overflow-hidden p-6 sm:p-8 lg:col-span-7 lg:min-h-[460px]">
            <div className="absolute right-0 top-0 h-64 w-64 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,.16),transparent_68%)]" />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/32">
                  One interface, evolving
                </div>

                <div className="mt-6 max-w-lg text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl">
                  Start with an idea. Keep the same interface in the
                  conversation.
                </div>
              </div>

              <div className="mt-10 space-y-2">
                {[
                  ["Prompt", "Build a focused analytics workspace"],

                  ["AI", "Generate a working interface"],

                  ["Feedback", "Make revenue the clearest signal"],

                  ["Rework", "Refine the existing experience"],
                ].map(([label, body], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.09] bg-white/[0.018] px-4 py-3"
                  >
                    <span className="w-16 text-[9px] uppercase tracking-[0.14em] text-violet-300/65">
                      {label}
                    </span>

                    <span className="text-xs text-white/52">{body}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Surface>

          <Surface className="relative overflow-hidden p-6 sm:p-8 lg:col-span-5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/32">
              The difference
            </div>

            <div className="mt-6 space-y-3">
              {[
                [
                  "One-shot generation",

                  "Output arrives. The manual work begins.",
                ],

                ["SurforaAI", "Output arrives. The conversation continues."],
              ].map(([title, body], index) => (
                <div
                  key={title}
                  className={`rounded-2xl border p-5 ${index === 1 ? "border-violet-400/20 bg-violet-400/[0.045]" : "border-white/[0.09] bg-white/[0.018]"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{title}</div>

                    {index === 1 ? (
                      <Check className="h-4 w-4 text-violet-300" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-white/15" />
                    )}
                  </div>

                  <p className="mt-2 text-xs leading-5 text-white/52">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/[0.09] bg-black p-5">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <MousePointer2 className="h-3.5 w-3.5 text-violet-300/70" />
                The interface becomes the conversation.
              </div>

              <p className="mt-2 text-[11px] leading-5 text-white/32">
                Describe the next change. See it happen. Continue.
              </p>
            </div>
          </Surface>
        </div>
      </div>
    </section>
  );
}
