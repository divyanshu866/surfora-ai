import { ArrowRight } from "lucide-react";
import { Reveal, SectionEyebrow, Surface, violet } from "./Helpers";
const useCases = [
  {
    title: "SaaS dashboards",

    description:
      "Turn product concepts into structured, working dashboard experiences.",

    accent: "analytics",
  },

  {
    title: "Product pages",

    description:
      "Explore layouts, hierarchy, interactions, and responsive behavior quickly.",

    accent: "product",
  },

  {
    title: "Developer tools",

    description:
      "Prototype dense, technical workspaces without losing the implementation.",

    accent: "dev",
  },

  {
    title: "Internal tools",

    description:
      "Move operational ideas from conversation to usable interfaces faster.",

    accent: "ops",
  },
];
export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="relative px-5 py-20 sm:px-6 lg:px-8 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-28 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="max-w-3xl">
          <SectionEyebrow>What you can build</SectionEyebrow>
          <h2 className="max-w-3xl text-[clamp(2.6rem,5vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.06em]">
            Start with the interface your product needs.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
            From dashboards and product experiences to developer tools and
            internal systems, the same workflow takes the idea all the way to a
            working interface.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 lg:grid-cols-12 lg:gap-5">
          {useCases.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.05}
              className={index === 0 ? "lg:col-span-7" : "lg:col-span-5"}
            >
              <Surface
                hover
                className="group h-full overflow-hidden p-2 sm:p-3"
              >
                <div className="relative overflow-hidden rounded-[18px] border border-white/[0.06] bg-[#020203]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,.10),transparent_44%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative h-56 sm:h-64">
                    <UseCasePreview type={item.accent} />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-6 px-3 pb-4 pt-5 sm:px-4 sm:pb-5">
                  <div>
                    <h3 className="text-base font-medium tracking-tight text-white sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/48">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-white/25 transition duration-300 group-hover:translate-x-1 group-hover:text-violet-200" />
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
  const base =
    "relative h-full min-h-[210px] overflow-hidden rounded-2xl border border-white/[0.085] bg-[#050505]";

  if (type === "analytics") {
    return (
      <div className={base}>
        <div className="absolute inset-x-0 top-0 flex h-8 items-center justify-between border-b border-white/[0.05] px-3 text-[8px] text-white/28">
          <span>Overview</span>

          <span>Live</span>
        </div>

        <div className="p-4 pt-12">
          <div className="h-4 w-28 rounded bg-white/[0.06]" />

          <div className="mt-2 h-2 w-36 rounded bg-white/[0.025]" />

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((x) => (
              <div
                key={x}
                className="h-10 rounded-lg border border-white/[0.05] bg-white/[0.02]"
              />
            ))}
          </div>

          <div className="mt-3 h-24 rounded-xl border border-white/[0.05] bg-black p-2">
            <svg viewBox="0 0 300 100" className="h-full w-full">
              <path
                d="M0 76 C35 69 52 72 76 52 S120 66 145 50 S191 60 210 32 S259 42 300 20"
                fill="none"
                stroke={violet}
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (type === "product") {
    return (
      <div className={base}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,.14),transparent_34%)]" />

        <div className="flex h-full items-center justify-between gap-6 p-6">
          <div className="max-w-[55%]">
            <div className="h-3 w-20 rounded bg-violet-400/20" />

            <div className="mt-4 h-10 w-40 rounded bg-white/[0.08]" />

            <div className="mt-3 h-2 w-32 rounded bg-white/[0.03]" />

            <div className="mt-2 h-2 w-24 rounded bg-white/[0.03]" />

            <div className="mt-6 h-8 w-24 rounded-lg bg-violet-400/80" />
          </div>

          <div className="h-36 w-28 rotate-6 rounded-[22px] border border-white/[0.08] bg-[#0b0b0b] shadow-2xl" />
        </div>
      </div>
    );
  }

  if (type === "dev") {
    return (
      <div className={base}>
        <div className="grid h-full grid-cols-[85px_1fr]">
          <div className="border-r border-white/[0.05] p-3">
            {[1, 2, 3, 4, 5].map((x) => (
              <div key={x} className="mb-2 h-2 rounded bg-white/[0.04]" />
            ))}
          </div>

          <div className="p-4">
            <div className="text-[8px] uppercase tracking-[.16em] text-white/28">
              Console
            </div>

            <div className="mt-3 rounded-xl border border-white/[0.05] bg-black p-3 font-mono text-[8px] leading-5 text-white/32">
              <div>
                <span className="text-violet-300">const</span> workspace = await
                build();
              </div>

              <div>
                <span className="text-white/52"></span> preview ready
              </div>

              <div>
                <span className="text-emerald-300/50">✓</span> interface
                compiled
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={base}>
      <div className="p-5">
        <div className="h-3 w-24 rounded bg-white/[0.06]" />

        <div className="mt-5 grid grid-cols-[1fr_90px] gap-3">
          <div className="space-y-2">
            {[1, 2, 3, 4].map((x) => (
              <div
                key={x}
                className="h-8 rounded-lg border border-white/[0.05] bg-white/[0.02]"
              />
            ))}
          </div>

          <div className="rounded-xl border border-violet-400/10 bg-violet-400/[0.045]" />
        </div>
      </div>
    </div>
  );
}
