import { Eye, Sparkles } from "lucide-react";
import Image from "next/image";

const AIEditorTabs = ({
  activeComponentId,
  activeEditor,
  setActiveEditor,
  targetTech,
  reworkUI,
  setShowPreview,
  showPreview,
}) => {
  const fileTabs = [
    ...(targetTech === "REACT"
      ? [{ id: "JSX", label: "JSX", icon: "/jsx.svg" }]
      : [{ id: "HTML", label: "HTML", icon: "/html.svg" }]),
    {
      id: "CSS",
      label: "CSS",
      icon: "/css.svg",
    },
    ...(targetTech === "HTML"
      ? [
          {
            id: "JS",
            label: "JavaScript",
            shortLabel: "JS",
            icon: "/javascript.svg",
          },
        ]
      : []),
  ];

  return (
    <div
      className={`
        relative flex h-10 w-full min-w-0 items-center
        border-b border-[#272528]
        bg-[#0b0b0d]
        px-1.5 sm:px-2.5
        ${reworkUI ? "border-b border-[#272528]" : ""}
      `}
    >
      {/* File tabs */}
      <div className="flex h-full min-w-0 items-stretch gap-0.5">
        {fileTabs.map((tab) => {
          const active = activeEditor === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveEditor(tab.id)}
              aria-pressed={active}
              className={`
                group relative flex h-full items-center gap-1.5
                rounded-t-[5px] px-2.5 sm:px-3
                text-[11.5px] font-medium tracking-[-0.01em]
                transition-[color,background-color] duration-150
                focus:outline-none
                focus-visible:bg-white/[0.035]
                focus-visible:ring-1
                focus-visible:ring-inset
                focus-visible:ring-white/[0.14]
                ${
                  active
                    ? "bg-white/[0.035] text-zinc-100"
                    : "text-zinc-500 hover:bg-white/[0.025] hover:text-zinc-300"
                }
              `}
            >
              <Image
                src={tab.icon}
                width={15}
                height={15}
                alt=""
                aria-hidden="true"
                className={`
                  h-[15px] w-[15px] shrink-0 object-contain
                  transition-opacity duration-150
                  ${
                    active ? "opacity-100" : "opacity-65 group-hover:opacity-90"
                  }
                `}
              />

              <span className="whitespace-nowrap">
                <span className="sm:hidden">{tab.shortLabel ?? tab.label}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>

              {active && (
                <span
                  className="
                    absolute inset-x-2 bottom-0 h-[2px]
                    rounded-t-full bg-violet-400/90
                    sm:inset-x-2.5
                  "
                />
              )}
            </button>
          );
        })}
      </div>

      {/* AI divider */}
      <div className="mx-1.5 h-[18px] w-px shrink-0 bg-[#302d33] sm:mx-2.5" />

      {/* AI tab — intentionally unchanged */}
      <button
        type="button"
        onClick={() => setActiveEditor("AI")}
        aria-pressed={activeEditor === "AI"}
        className={`
          group relative flex h-8 items-center gap-2
          rounded-lg border
          px-3.5
          text-[12px] font-medium
          transition-all duration-150
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-yellow-400/30
          ${
            activeEditor === "AI"
              ? "border-yellow-400/60 bg-yellow-400/[0.07] text-yellow-100"
              : "border-yellow-400/30 bg-yellow-400/[0.025] text-yellow-300/85 hover:border-yellow-400/50 hover:bg-yellow-400/[0.05]"
          }
        `}
      >
        <Sparkles
          className="h-4 w-4 shrink-0 text-yellow-400"
          strokeWidth={1.8}
        />

        <span>AI</span>
      </button>

      {/* Right controls */}
      <div className="ml-auto flex min-w-0 items-center gap-1.5">
        {showPreview && !reworkUI && (
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            aria-label="Toggle preview"
            aria-pressed={showPreview}
            className="
              flex h-7 w-7 shrink-0 items-center justify-center
              rounded-md border border-transparent
              text-zinc-500
              transition-[background-color,border-color,color] duration-150
              hover:border-white/[0.07]
              hover:bg-white/[0.035]
              hover:text-zinc-200
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-violet-400/30
            "
          >
            <Eye className="h-[15px] w-[15px]" strokeWidth={1.7} />
          </button>
        )}

        {activeComponentId != null && (
          <div
            className="
              hidden h-7 items-center
              rounded-md
              border border-[#2b2930]
              bg-white/[0.018]
              px-2.5
              text-[9px] font-medium
              tracking-[0.12em]
              text-zinc-500
              sm:flex
            "
          >
            {targetTech === "HTML" ? "WEB BUNDLE" : "REACT"}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIEditorTabs;
