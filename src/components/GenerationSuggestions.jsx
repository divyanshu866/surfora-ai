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
  },
  {
    title: "SaaS pricing",
    prompt:
      "Create a premium pricing experience for a sophisticated SaaS product. Avoid the typical three equal pricing cards. Use a distinctive composition with strong typographic hierarchy, deliberate asymmetry or a strong featured plan, nuanced borders and surfaces, thoughtful feature grouping, a polished billing toggle, subtle interaction states, and a clear visual conversion path. Give it a confident product identity with refined spacing, depth, and details that make it feel designed rather than templated. Keep the interface restrained and highly polished.",
    icon: CreditCard,
  },
  {
    title: "Landing hero",
    prompt:
      "Create an art-directed, high-end landing page hero for a premium technology product. Avoid the generic centered headline + buttons + screenshot layout. Use a distinctive composition, sophisticated typography, strong visual hierarchy, layered depth, subtle gradients or atmospheric elements, and an original product-focused visual treatment. Include convincing copy, restrained motion-ready interactions, and responsive behavior. The result should feel like a carefully designed flagship product website, not a standard SaaS template.",
    icon: WandSparkles,
  },
  {
    title: "Admin dashboard",
    prompt:
      "Create a premium command-center style admin dashboard with a distinctive product identity. Avoid the standard sidebar + rows of KPI cards + generic table layout. Use strong information hierarchy, interesting but practical composition, refined data presentation, contextual actions, meaningful visual grouping, sophisticated typography, and subtle depth. Make the dashboard feel like a polished product used by a real team, with realistic data and purposeful interactions rather than decorative filler.",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    prompt:
      "Create an editorial-quality analytics dashboard with a distinctive visual system and sophisticated data presentation. Avoid generic KPI-card grids and default chart layouts. Use an intentional composition with a strong primary metric, complementary visualizations, contextual labels, useful comparisons, realistic data, and elegant spacing. Give charts and data a refined visual treatment with subtle interaction states and excellent hierarchy. The result should feel like a premium financial, product, or intelligence tool rather than a dashboard template.",
    icon: BarChart3,
  },
];

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
      <div
        aria-label="Example generation prompts"
        className="
          flex min-w-0 gap-2
          overflow-x-auto
          py-0.5
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden

          sm:flex-wrap
          sm:gap-2
          sm:overflow-visible
          sm:py-0
        "
      >
        {suggestions.map(({ title, prompt, icon: Icon }) => (
          <button
            key={title}
            type="button"
            onClick={() => handleGenerate(prompt)}
            disabled={disabled}
            className="
              group
              inline-flex
              h-9
              shrink-0
              snap-start
              items-center
              gap-2
              rounded-[10px]
              border
              border-white/[0.085]
              bg-white/[0.018]
              px-3
              text-left
              text-[12px]
              font-medium
              tracking-[-0.005em]
              text-white/65

              transition-colors
              duration-150

              hover:border-white/[0.13]
              hover:bg-white/[0.035]
              hover:text-white/90

              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-violet-400/30

              active:scale-[0.98]

              disabled:pointer-events-none
              disabled:opacity-35

              sm:h-8.5
              sm:px-2.5
              sm:text-[11.5px]
            "
          >
            <span
              className="
                flex
                h-5.5
                w-5.5
                shrink-0
                items-center
                justify-center
                rounded-[6px]
                border
                border-white/[0.07]
                bg-white/[0.025]
                text-white/40
                transition-colors
                duration-150

                group-hover:border-violet-400/20
                group-hover:bg-violet-400/[0.06]
                group-hover:text-violet-200

                sm:h-5
                sm:w-5
              "
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
            </span>

            <span className="whitespace-nowrap">{title}</span>

            <ArrowUpRight
              className="
                h-3.5
                w-3.5
                shrink-0
                text-white/25
                transition-colors
                duration-150
                group-hover:text-white/55
              "
              strokeWidth={1.7}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
