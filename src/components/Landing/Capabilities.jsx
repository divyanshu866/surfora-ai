import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { models, SectionEyebrow, Surface } from "./Helpers";
import {
  Code2,
  Cpu,
  Gauge,
  Layers3,
  Monitor,
  RotateCcw,
  WandSparkles,
} from "lucide-react";

const capabilityCards = [
  {
    icon: WandSparkles,

    title: "AI interface generation",

    body: "Describe a complete interface and get a working implementation.",
  },

  {
    icon: RotateCcw,

    title: "AI interface rework",

    body: "Keep refining the same interface instead of starting over after every change.",
  },

  {
    icon: Monitor,

    title: "Live preview",

    body: "See the generated experience as an interface, not just as a block of code.",
  },

  {
    icon: Code2,

    title: "Real frontend code",

    body: "Generated output is designed around working frontend implementation.",
  },

  {
    icon: Layers3,

    title: "React + Web Bundle",

    body: "Build React interfaces or Web Bundles using HTML, CSS, and JavaScript.",
  },

  {
    icon: Cpu,

    title: "Multiple AI models",

    body: "Choose from several models and supported effort levels as your plan allows.",
  },
];
export default function Capabilities() {
  const [modelIndex, setModelIndex] = useState(0);

  const currentModel = useMemo(() => models[modelIndex], [modelIndex]);
  return (
    <section id="capabilities" className="px-5 py-20 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>Capabilities</SectionEyebrow>

            <h2 className="text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Everything around the interface loop.
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-white/52">
            The feature set supports the workflow; it does not replace it as the
            product story.
          </p>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilityCards.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.45, delay: index * 0.035 }}
              >
                <Surface hover className="group h-full p-6">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.055]">
                    <Icon className="h-4 w-4 text-violet-300/80" />
                  </div>

                  <h3 className="mt-9 text-sm font-medium tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/52">
                    {item.body}
                  </p>
                </Surface>
              </motion.div>
            );
          })}
        </div>

        <Surface className="mt-3 overflow-hidden p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-white/28">
                Model layer
              </div>

              <div className="mt-2 text-xl font-medium tracking-tight">
                Choose the intelligence behind the interface.
              </div>

              <div className="mt-1 text-xs text-white/38">
                Model and effort availability depends on your plan.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {models.map((model, index) => (
                <button
                  key={model.name}
                  type="button"
                  onClick={() => setModelIndex(index)}
                  className={`rounded-xl border px-3 py-2 text-left transition ${index === modelIndex ? "border-violet-400/25 bg-violet-400/[0.07]" : "border-white/[0.09] bg-white/[0.015] hover:border-white/[0.12]"}`}
                >
                  <div
                    className={`text-[10px] font-medium ${index === modelIndex ? "text-violet-200" : "text-white/60"}`}
                  >
                    {model.name}
                  </div>

                  <div className="mt-0.5 text-[8px] text-white/28">
                    {model.mode}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentModel.name}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-5 flex items-center gap-2 border-t border-white/[0.05] pt-4 text-[10px] text-white/32"
            >
              <Gauge className="h-3.5 w-3.5 text-violet-300/60" />
              Active model:{" "}
              <span className="text-white/52">{currentModel.name}</span>
            </motion.div>
          </AnimatePresence>
        </Surface>
      </div>
    </section>
  );
}
