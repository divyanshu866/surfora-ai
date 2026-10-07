"use client";

import { Plus, Sparkles, Trash, MoreHorizontal } from "lucide-react";
import { EMPTY_JSX } from "@/components/Preview/defaults";
import { useEffect, useState } from "react";
import { useEditorContext } from "@/context/EditorContext";
import { useConsole } from "@/context/ConsoleContext";
import { AI_MODELS } from "@/ai/models";
import Image from "next/image";

export default function Sidebar() {
  // const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [chatMenu, setChatMenu] = useState(null);
  const [mouseClick, setMouseClick] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].value);

  useEffect(() => {
    console.log(selectedModel);
  }, [selectedModel]);

  const {
    setSelectedVisualStyle,
    components,
    setActiveMessages,
    setComponents,
    activeComponent,
    setActiveComponent,
    activeComponentIndex,
    setActiveComponentIndex,
    activeEditor,
    setActiveEditor,
    setChangeDesc,
    isGenerating,
    setIsGenerating,
    showPreview,
    setShowPreview,
    updatePreview,
    sidebarCollapsed,
    setSidebarCollapsed,
    reworkUI,
    setReworkUI,
    isMaximised,
    setIsMaximised,
    targetTech,
    generationUsage,
    setGenerationUsage,
  } = useEditorContext();

  const { setConsoleLogs, showConsole, setShowConsole } = useConsole();

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const updateViewport = () => {
      const mobile = mobileQuery.matches;
      setIsMobile(mobile);

      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    updateViewport();
    mobileQuery.addEventListener("change", updateViewport);

    return () => {
      mobileQuery.removeEventListener("change", updateViewport);
    };
  }, [setSidebarCollapsed]);

  async function deleteComponent(id, componentIndex) {
    setChatMenu(null);

    //if requested delete component was active
    const wasActive = activeComponent?.id === id;
    const activeComponentIndexLocal = activeComponentIndex;

    if (wasActive) {
      clearScreen();
      setActiveEditor("AI");
    }

    // Implementation for deleting a component
    const res = await fetch(`/api/components/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Failed to delete component");
      return;
    }

    // Handle active component highlighting
    if (
      activeComponentIndexLocal != 0 &&
      activeComponentIndexLocal > componentIndex
    ) {
      setActiveComponentIndex(activeComponentIndexLocal - 1);
    }

    // Update the components state after deletion
    setComponents((prev) => prev.filter((c) => c.id !== id));
  }

  const hideChatMenu = () => {
    setChatMenu(null);
  };

  useEffect(() => {
    window.addEventListener("mousedown", hideChatMenu);

    return () => {
      window.removeEventListener("mousedown", hideChatMenu);
    };
  }, []);

  // Hide the sidebar when a component is selected on mobile
  useEffect(() => {
    isMobile && setSidebarCollapsed(true);
  }, [activeComponentIndex]);

  function updateActiveComponent(index) {
    //prevent switching components while generating
    if (isGenerating) {
      return;
    }

    if (showPreview == false && !isMobile) {
      setShowPreview(true);
    }

    setActiveComponentIndex(index);

    if (index != null && index >= 0) {
      setReworkUI(true);
    }

    setActiveMessages(components[index]?.prompts || []);
    setChangeDesc("");
  }

  // Fetch components on initial load
  useEffect(() => {
    async function fetchComponents() {
      const res = await fetch("/api/components");

      if (res.ok) {
        const { components, generationUsage } = await res.json();

        setComponents(components);
        setGenerationUsage(generationUsage);

        console.log("Fetched components>>>>:", components);
        console.log("Generation usage>>>>:", generationUsage);
      } else {
        console.error("Failed to fetch components");
      }
    }

    fetchComponents();
  }, []);

  const clearScreen = (name, html, css, js, jsx = EMPTY_JSX) => {
    if (isGenerating) {
      return;
    }

    setSelectedVisualStyle("Custom style");
    setActiveMessages([]);
    setReworkUI(false);
    setShowPreview(false);
    setActiveComponentIndex(null);
    setActiveEditor("AI");
    setActiveComponent({
      id: "",
      messages: [],
      name: name ?? "",
      targetTech: targetTech,
      jsx: jsx ?? "",
      html: html ?? "",
      css: css ?? "",
      js: js ?? "",
    });

    setConsoleLogs([]);
    updatePreview();
    console.log("cleared");
  };

  return (
    <aside
      aria-hidden={sidebarCollapsed}
      className={`${
        isMobile ? "absolute inset-y-0 left-0 z-100" : "relative"
      } flex h-full shrink-0 flex-col overflow-hidden bg-backgroundLight transition-[width] duration-200 ease-out ${
        sidebarCollapsed
          ? "w-0 border-0"
          : `${
              isMobile
                ? "border-b w-[min(16.25rem,calc(100vw-1rem))]"
                : "w-[16.25rem]"
            } rounded-xl border-r border-darkBorder`
      }`}
    >
      <div
        className={`flex h-full w-[min(16.25rem,calc(100vw-1rem))] shrink-0 flex-col transition-[opacity,transform] duration-150 ease-out ${
          sidebarCollapsed
            ? "pointer-events-none -translate-x-2 opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <header className="relative shrink-0 border-b border-darkBorder p-4">
          <button
            disabled={isGenerating}
            onClick={() => {
              clearScreen();

              if (isMaximised) {
                setIsMaximised(false);
              }
            }}
            className="group flex w-full items-center gap-3 overflow-hidden rounded-xl border border-lightBorder bg-white/3 px-5 py-3 text-sm font-medium text-white transition-all duration-150 hover:border-purple-500/30 hover:bg-white/6 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="rounded-lg bg-white/5 p-1">
              <Plus className="size-5 transition-transform duration-300 group-hover:rotate-90" />
            </span>
            <span className="flex-1 text-left">New Project</span>
            <span className="text-xs text-neutral-500 transition-colors duration-100 group-hover:text-neutral-300">
              ⌘ K
            </span>
          </button>
        </header>

        <nav
          aria-label="Recent projects"
          className="mt-3 min-h-0 w-full flex-1 overflow-y-auto overscroll-contain px-4 pb-4 text-nowrap"
        >
          <h2 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Recent Projects
          </h2>

          <ul className="space-y-1">
            {components.map((c, i) => (
              <li
                key={c.id ?? i}
                className={`group relative overflow-visible rounded-lg border text-sm ${
                  i === activeComponentIndex
                    ? "border-neutral-800 bg-neutral-900"
                    : "border-transparent bg-transparent hover:border-lightBorder hover:bg-white/5"
                }`}
              >
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => updateActiveComponent(i)}
                  className="flex min-h-10 w-full min-w-0 items-center gap-3 rounded-lg py-2 pl-4 pr-11 text-left cursor-pointer disabled:cursor-not-allowed"
                >
                  {c.targetTech === "REACT" && (
                    <Image src="/jsx.svg" width={12} height={12} alt="React" />
                  )}

                  {c.targetTech === "HTML" && (
                    <Image
                      src="/globe2_red.svg"
                      width={12}
                      height={12}
                      alt="Web Bundle"
                    />
                  )}

                  <span className="truncate font-medium text-white">
                    {c.name}
                  </span>
                </button>

                <button
                  type="button"
                  aria-label={`More actions for ${c.name}`}
                  aria-expanded={chatMenu === i}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatMenu(chatMenu === i ? null : i);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-neutral-400 transition hover:text-white focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <MoreHorizontal size={15} />
                </button>

                {chatMenu === i && (
                  <div className="absolute right-2 top-0 z-50 w-48 overflow-hidden rounded-2xl border border-lightBorder bg-neutral-900/95 shadow-2xl backdrop-blur-xl">
                    <button
                      type="button"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteComponent(c.id, i);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-red-400 transition hover:bg-red-500/10"
                    >
                      <Trash size={16} />
                      Delete project
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
