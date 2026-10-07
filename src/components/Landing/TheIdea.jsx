import { motion } from "motion/react";
import { SectionEyebrow } from "./Helpers";
import {
  Command,
  Monitor,
  RotateCcw,
  Sparkles,
  WandSparkles,
} from "lucide-react";
const workflow = [
  {
    number: "01",

    title: "Describe",

    body: "Start with what you want to build. Natural language becomes the interface brief.",

    icon: Command,
  },

  {
    number: "02",

    title: "Generate",

    body: "SurforaAI turns the idea into a working frontend instead of stopping at a mockup.",

    icon: WandSparkles,
  },

  {
    number: "03",

    title: "Preview",

    body: "See the result live, in context, while the generated interface is still in motion.",

    icon: Monitor,
  },

  {
    number: "04",

    title: "Rework",

    body: "Describe the change you want. SurforaAI works from the existing interface, not a blank canvas.",

    icon: RotateCcw,
  },

  {
    number: "05",

    title: "Refine",

    body: "Keep iterating until the interface feels right, with the conversation and implementation connected.",

    icon: Sparkles,
  },
];

export default function TheIdea() {
  return (
    <section className="px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
        <div>
          <SectionEyebrow>The idea</SectionEyebrow>

          <h2 className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
            Shorten the distance between what you imagine and what you can
            build.
          </h2>
        </div>

        <div className="max-w-2xl pb-1 text-base leading-7 text-white/50 sm:text-lg sm:leading-8">
          SurforaAI connects intent, AI generation, real frontend code, a live
          preview, and AI-powered rework in one continuous loop—so interface
          development becomes more direct, visual, and conversational.
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl rounded-[28px] border border-white/[0.085] bg-[#040404] p-4 sm:p-6 lg:p-8">
        <div className="grid gap-3 sm:grid-cols-5">
          {workflow.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="group relative rounded-2xl border border-white/[0.09] bg-white/[0.015] p-5 transition hover:border-violet-400/20 hover:bg-violet-400/[0.025]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.2em] text-white/28">
                    {item.number}
                  </span>

                  <Icon className="h-4 w-4 text-violet-300/70 transition group-hover:text-violet-200" />
                </div>

                <h3 className="mt-12 text-base font-semibold tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/52">
                  {item.body}
                </p>

                {index < workflow.length - 1 && (
                  <div className="absolute -right-2.5 top-1/2 hidden h-px w-5 bg-violet-400/15 sm:block" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
