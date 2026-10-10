"use client";

import { Plus, Trash, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

import { EMPTY_JSX } from "@/components/Preview/defaults";
import { useEditorContext } from "@/context/EditorContext";
import { useConsole } from "@/context/ConsoleContext";

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [chatMenu, setChatMenu] = useState(null);

  const {
    setSelectedVisualStyle,
    components,
    setComponents,
    activeComponent,
    setActiveComponent,
    activeComponentId,
    setActiveComponentId,
    setActiveMessages,
    setActiveEditor,
    setChangeDesc,
    isGenerating,
    showPreview,
    setShowPreview,
    updatePreview,
    sidebarCollapsed,
    setSidebarCollapsed,
    setReworkUI,
    isMaximised,
    setIsMaximised,
    targetTech,
    setTargetTech,
    setGenerationUsage,
  } = useEditorContext();

  const { setConsoleLogs } = useConsole();

  // Keep the sidebar responsive to viewport changes.
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

  // Close the sidebar on mobile when the selected component changes.
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [activeComponentId, isMobile, setSidebarCollapsed]);

  // Close the contextual menu when clicking outside it.
  useEffect(() => {
    const hideChatMenu = () => setChatMenu(null);

    window.addEventListener("mousedown", hideChatMenu);

    return () => {
      window.removeEventListener("mousedown", hideChatMenu);
    };
  }, []);

  // Fetch the initial component list.
  useEffect(() => {
    let cancelled = false;

    async function fetchComponents() {
      try {
        const res = await fetch("/api/components");

        if (!res.ok) {
          throw new Error("Failed to fetch components.");
        }

        const data = await res.json();

        if (cancelled) return;

        setComponents(Array.isArray(data.components) ? data.components : []);
        setGenerationUsage(data.generationUsage);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load components:", error);
        }
      }
    }

    fetchComponents();

    return () => {
      cancelled = true;
    };
  }, [setComponents, setGenerationUsage]);

  function updateActiveComponent(componentId) {
    // Prevent switching projects while generation is running.
    if (isGenerating) return;

    const component = components.find(
      (item) => String(item.id) === String(componentId),
    );

    if (!component) return;

    if (!showPreview && !isMobile) {
      setShowPreview(true);
    }

    const prompts = component.prompts || [];

    // Store selection by stable ID, never by array position.
    setActiveComponentId(component.id);

    setActiveComponent({
      id: component.id,
      messages: prompts,
      name: component.name,
      targetTech: component.targetTech ?? "REACT",
      html: component.html ?? "",
      css: component.css ?? "",
      js: component.js ?? "",
      jsx: component.jsx ?? "",
    });

    setActiveMessages(prompts);
    setTargetTech(component.targetTech ?? "REACT");
    setReworkUI(true);
    setChangeDesc("");
  }

  async function deleteComponent(id) {
    if (isGenerating) return;

    setChatMenu(null);

    const deletedId = String(id);
    const wasActive =
      deletedId === String(activeComponentId ?? activeComponent?.id ?? "");

    try {
      const res = await fetch(`/api/components/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to delete component.");
      }

      // Remove the deleted item. Other selection IDs remain unchanged.
      setComponents((previous) =>
        previous.filter((component) => String(component.id) !== deletedId),
      );

      // Clear the editor only after a successful deletion.
      if (wasActive) {
        clearScreen();
        setActiveEditor("AI");
      }
    } catch (error) {
      console.error("Failed to delete component:", error);
    }
  }

  function clearScreen(name, html, css, js, jsx = EMPTY_JSX) {
    if (isGenerating) return;

    setSelectedVisualStyle("Custom style");
    setActiveMessages([]);
    setReworkUI(false);
    setShowPreview(false);

    // No component is selected for a new project.
    setActiveComponentId(null);
    setActiveEditor("AI");

    setActiveComponent({
      id: "",
      messages: [],
      name: name ?? "",
      targetTech,
      jsx: jsx ?? "",
      html: html ?? "",
      css: css ?? "",
      js: js ?? "",
    });

    setConsoleLogs([]);
    updatePreview();
  }

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
                ? "border-b w-[min(15.25rem,calc(100vw-1rem))]"
                : "w-[15.25rem]"
            } rounded-xl border-r border-lightBorder`
      }`}
    >
      <div
        className={`flex h-full w-[min(15.25rem,calc(100vw-1rem))] shrink-0 flex-col transition-[opacity,transform] duration-150 ease-out ${
          sidebarCollapsed
            ? "pointer-events-none -translate-x-2 opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <header className="relative shrink-0 border-b border-[#1e1d21] px-2.5 py-2">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => {
              clearScreen();

              if (isMaximised) {
                setIsMaximised(false);
              }
            }}
            className="group flex h-9 w-full cursor-pointer items-center gap-2.5 overflow-hidden rounded-lg border border-[#29272d] bg-[#101012] px-2.5 text-[12px] font-medium tracking-[-0.015em] text-zinc-100 transition-[background,border-color,box-shadow] duration-150 hover:border-violet-400/30 hover:bg-[#15131a] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-white/[0.04] bg-white/[0.04] text-zinc-100 transition-colors group-hover:bg-violet-400/[0.12]">
              <Plus className="size-4 transition-transform duration-200 group-hover:rotate-90" />
            </span>

            <span className="flex-1 text-left">New Project</span>

            <span className="rounded border border-white/[0.045] bg-white/[0.02] px-1 py-0.5 text-[9px] font-medium tracking-wide text-zinc-500 transition-colors group-hover:text-zinc-400">
              ⌘ K
            </span>
          </button>
        </header>

        <nav
          aria-label="Recent projects"
          className="min-h-0 w-full flex-1 overflow-y-auto overscroll-contain px-2 pb-2 pt-3 text-nowrap [scrollbar-color:#343238_transparent] [scrollbar-width:thin]"
        >
          <h2 className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-zinc-500/90">
            Recent Projects
          </h2>

          <ul className="space-y-0.5">
            {components.map((component) => {
              const componentId = String(component.id);
              const isActive =
                activeComponentId != null &&
                componentId === String(activeComponentId);
              const isMenuOpen = chatMenu === componentId;

              return (
                <li
                  key={component.id}
                  className={`group relative overflow-visible rounded-md border border-transparent text-[12px] transition-colors duration-150 ${
                    isActive
                      ? "border-transparent bg-[#141216] before:absolute before:inset-y-2 before:left-0.5 before:w-px before:rounded-r-full before:bg-violet-400/75"
                      : "border-transparent bg-transparent hover:bg-white/[0.035]"
                  }`}
                >
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={() => updateActiveComponent(component.id)}
                    className="flex min-h-8 w-full min-w-0 cursor-pointer items-center gap-2 rounded-md py-1 pl-2 pr-8 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400/45 disabled:cursor-not-allowed"
                  >
                    {component.targetTech === "REACT" && (
                      <span className="flex size-5 shrink-0 items-center justify-center">
                        <Image
                          src="/jsx.svg"
                          width={12}
                          height={12}
                          alt="React"
                          className="opacity-90"
                        />
                      </span>
                    )}

                    {component.targetTech === "HTML" && (
                      <span className="flex size-5 shrink-0 items-center justify-center">
                        <Image
                          src="/globe2_red.svg"
                          width={12}
                          height={12}
                          alt="Web Bundle"
                          className="opacity-90"
                        />
                      </span>
                    )}

                    <span
                      className={`min-w-0 truncate font-normal tracking-[-0.012em] transition-colors ${
                        isActive
                          ? "text-zinc-50"
                          : "text-zinc-300 group-hover:text-zinc-100"
                      }`}
                    >
                      {component.name}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label={`More actions for ${component.name}`}
                    aria-expanded={isMenuOpen}
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      setChatMenu((current) =>
                        current === componentId ? null : componentId,
                      );
                    }}
                    className="absolute right-1 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-zinc-500 opacity-100 transition-[background,color,opacity] duration-150 hover:bg-white/[0.07] hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                  >
                    <MoreHorizontal size={15} />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-1 top-1 z-50 w-40 overflow-hidden rounded-lg border border-[#29272d] bg-[#111113]/95 p-1 shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur-lg">
                      <button
                        type="button"
                        disabled={isGenerating}
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteComponent(component.id);
                        }}
                        className="flex min-h-8 w-full items-center gap-2 rounded-md px-2 text-[11.5px] font-medium text-red-300 transition-colors hover:bg-red-400/[0.09] hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-300/40 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash size={13} />
                        Delete project
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
