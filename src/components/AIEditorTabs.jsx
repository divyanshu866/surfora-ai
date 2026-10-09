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
        border-b border-white/[0.065]
        bg-backgroundDark
        px-2 sm:px-3
        ${reworkUI ? "border-b border-white/[0.065]" : ""}
      `}
    >
      {/* File tabs */}
      <div className="flex h-full min-w-0 items-stretch">
        {fileTabs.map((tab) => {
          const active = activeEditor === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveEditor(tab.id)}
              aria-pressed={active}
              className={`
                group relative flex h-full items-center gap-2
                px-3.5
                text-[12px] font-medium tracking-[-0.005em]
                transition-colors duration-150
                focus:outline-none
                focus-visible:bg-white/[0.025]
                focus-visible:ring-1
                focus-visible:ring-inset
                focus-visible:ring-white/[0.12]
                sm:px-4
                ${
                  active
                    ? "bg-white/[0.035] text-white"
                    : "text-white/62 hover:bg-white/[0.018] hover:text-white/90"
                }
              `}
            >
              <Image
                src={tab.icon}
                width={16}
                height={16}
                alt=""
                aria-hidden="true"
                className={`
                  h-4 w-4 shrink-0 object-contain
                  transition-opacity duration-150
                  ${
                    active
                      ? "opacity-100"
                      : "opacity-80 group-hover:opacity-100"
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
                    absolute inset-x-3 bottom-0 h-[2px]
                    rounded-t-full
                    bg-violet-400
                    shadow-[0_-1px_8px_rgba(167,139,250,0.22)]
                    sm:inset-x-3.5
                  "
                />
              )}
            </button>
          );
        })}
      </div>

      {/* AI divider */}
      <div className="mx-1.5 h-5 w-px bg-white/[0.08] sm:mx-2.5" />

      {/* AI tab */}
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
      <div className="ml-auto flex min-w-0 items-center gap-2">
        {showPreview && !reworkUI && (
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            aria-label="Toggle preview"
            aria-pressed={showPreview}
            className="
              flex h-8 w-8 shrink-0 items-center justify-center
              rounded-lg border border-transparent
              text-white/50
              transition-all duration-150
              hover:border-white/[0.07]
              hover:bg-white/[0.035]
              hover:text-white/80
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-violet-400/30
            "
          >
            <Eye className="h-4 w-4" strokeWidth={1.8} />
          </button>
        )}

        {activeComponentId != null && (
          <div
            className="
              hidden h-8 items-center
              rounded-lg
              border border-white/[0.065]
              bg-white/[0.018]
              px-3
              text-[10px] font-medium
              tracking-[0.1em]
              text-white/40
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
