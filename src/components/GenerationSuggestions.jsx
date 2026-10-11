"use client";

import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  Image,
  LayoutDashboard,
  WandSparkles,
} from "lucide-react";

const suggestions = [
  {
    title: "Image gallery",
    prompt:
      "Create an editorial-grade image gallery with a distinctive art-directed layout rather than a standard masonry grid. Use striking image composition, varied image scales, intentional whitespace, sophisticated typography, subtle metadata or captions, refined hover transitions, and a cohesive premium visual direction. Make it feel like a high-end creative portfolio or design publication rather than a generic interface. Use realistic image URLs and polished responsive behavior. Prioritize visual personality, composition, and restraint.",
    icon: Image,
    tone: "rose",
  },
  {
    title: "SaaS pricing",
    prompt:
      "Create a premium pricing experience for a sophisticated SaaS product. Avoid the typical three equal pricing cards. Use a distinctive composition with strong typographic hierarchy, deliberate asymmetry or a strong featured plan, nuanced borders and surfaces, thoughtful feature grouping, a polished billing toggle, subtle interaction states, and a clear visual conversion path. Give it a confident product identity with refined spacing, depth, and details that make it feel designed rather than templated. Keep the interface restrained and highly polished.",
    icon: CreditCard,
    tone: "amber",
  },
  {
    title: "Landing hero",
    prompt:
      "Create an art-directed, high-end landing page hero for a premium technology product. Avoid the generic centered headline + buttons + screenshot layout. Use a distinctive composition, sophisticated typography, strong visual hierarchy, layered depth, subtle gradients or atmospheric elements, and an original product-focused visual treatment. Include convincing copy, restrained motion-ready interactions, and responsive behavior. The result should feel like a carefully designed flagship product website, not a standard SaaS template.",
    icon: WandSparkles,
    tone: "violet",
  },
  {
    title: "Admin dashboard",
    prompt:
      "Create a premium command-center style admin dashboard with a distinctive product identity. Avoid the standard sidebar + rows of KPI cards + generic table layout. Use strong information hierarchy, interesting but practical composition, refined data presentation, contextual actions, meaningful visual grouping, sophisticated typography, and subtle depth. Make the dashboard feel like a polished product used by a real team, with realistic data and purposeful interactions rather than decorative filler.",
    icon: LayoutDashboard,
    tone: "sky",
  },
  {
    title: "Analytics",
    prompt:
      "Create an editorial-quality analytics dashboard with a distinctive visual system and sophisticated data presentation. Avoid generic KPI-card grids and default chart layouts. Use an intentional composition with a strong primary metric, complementary visualizations, contextual labels, useful comparisons, realistic data, and elegant spacing. Give charts and data a refined visual treatment with subtle interaction states and excellent hierarchy. The result should feel like a premium financial, product, or intelligence tool rather than a dashboard template.",
    icon: BarChart3,
    tone: "teal",
  },
];

const toneStyles = {
  rose: {
    icon: "border-rose-300/[0.12] bg-rose-300/[0.055] text-rose-200/80 group-hover:border-rose-300/20 group-hover:bg-rose-300/[0.09] group-hover:text-rose-100",
  },
  amber: {
    icon: "border-amber-300/[0.12] bg-amber-300/[0.055] text-amber-200/80 group-hover:border-amber-300/20 group-hover:bg-amber-300/[0.09] group-hover:text-amber-100",
  },
  violet: {
    icon: "border-violet-300/[0.15] bg-violet-300/[0.06] text-violet-200/85 group-hover:border-violet-300/25 group-hover:bg-violet-300/[0.1] group-hover:text-violet-100",
  },
  sky: {
    icon: "border-sky-300/[0.12] bg-sky-300/[0.055] text-sky-200/80 group-hover:border-sky-300/20 group-hover:bg-sky-300/[0.09] group-hover:text-sky-100",
  },
  teal: {
    icon: "border-teal-300/[0.12] bg-teal-300/[0.055] text-teal-200/80 group-hover:border-teal-300/20 group-hover:bg-teal-300/[0.09] group-hover:text-teal-100",
  },
};

export default function GenerationSuggestions({
  onGenerate,
  disabled = false,
}) {
  const handleGenerate = (prompt) => {
    if (disabled) return;
    onGenerate?.(prompt);
  };

  return (
    <section aria-label="Example prompts" className="w-full min-w-0">
      <div className="mb-2 flex items-center gap-2.5 px-0.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
          Quick starts
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-white/[0.09] to-transparent" />
      </div>

      <div
        aria-label="Example generation prompts"
        className="
          flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto
          px-0.5 pb-1 pt-0.5
          [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          sm:flex-wrap sm:overflow-visible sm:snap-none sm:pb-0
        "
      >
        {suggestions.map(({ title, prompt, icon: Icon, tone }) => (
          <button
            key={title}
            type="button"
            onClick={() => handleGenerate(prompt)}
            disabled={disabled}
            className="
              group relative isolate inline-flex h-10 shrink-0 snap-start
              items-center gap-2 rounded-[9px] border border-[#29272e]
              bg-[#101013] px-2.5 text-left
              transition-[background-color,border-color,box-shadow,transform]
              duration-150
              hover:border-[#3b3546] hover:bg-[#15131a]
              hover:shadow-[0_5px_18px_-13px_rgba(139,92,246,0.42)]
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-violet-400/35
              active:scale-[0.985]
              disabled:pointer-events-none disabled:opacity-35
              sm:h-[38px] sm:flex-1 sm:justify-start sm:px-2
              md:min-w-[132px]
            "
          >
            <span
              className={`flex size-[25px] shrink-0 items-center justify-center rounded-[6px] border transition-colors duration-150 ${toneStyles[tone].icon}`}
            >
              <Icon className="h-[13px] w-[13px]" strokeWidth={1.75} />
            </span>

            <span className="whitespace-nowrap text-[11.5px] font-medium tracking-[-0.01em] text-zinc-300 transition-colors group-hover:text-zinc-100 sm:text-[11px]">
              {title}
            </span>

            <ArrowUpRight
              className="ml-0.5 h-[13px] w-[13px] shrink-0 text-zinc-600 transition-[color,transform] duration-150 group-hover:translate-x-px group-hover:-translate-y-px group-hover:text-zinc-300"
              strokeWidth={1.7}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
