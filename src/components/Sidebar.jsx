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
            type="button"
            disabled={isGenerating}
            onClick={() => {
              clearScreen();

              if (isMaximised) {
                setIsMaximised(false);
              }
            }}
            className="group flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-lightBorder bg-white/3 px-5 py-3 text-sm font-medium text-white transition-all duration-150 hover:border-purple-500/30 hover:bg-white/6 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
            {components.map((component) => {
              const componentId = String(component.id);
              const isActive =
                activeComponentId != null &&
                componentId === String(activeComponentId);
              const isMenuOpen = chatMenu === componentId;

              return (
                <li
                  key={component.id}
                  className={`group relative overflow-visible rounded-lg border text-sm ${
                    isActive
                      ? "border-neutral-800 bg-neutral-900"
                      : "border-transparent bg-transparent hover:border-lightBorder hover:bg-white/5"
                  }`}
                >
                  <button
                    type="button"
                    disabled={isGenerating}
                    onClick={() => updateActiveComponent(component.id)}
                    className="flex min-h-10 w-full min-w-0 cursor-pointer items-center gap-3 rounded-lg py-2 pl-4 pr-11 text-left disabled:cursor-not-allowed"
                  >
                    {component.targetTech === "REACT" && (
                      <Image
                        src="/jsx.svg"
                        width={12}
                        height={12}
                        alt="React"
                      />
                    )}

                    {component.targetTech === "HTML" && (
                      <Image
                        src="/globe2_red.svg"
                        width={12}
                        height={12}
                        alt="Web Bundle"
                      />
                    )}

                    <span className="truncate font-medium text-white">
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-neutral-400 transition hover:text-white focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <MoreHorizontal size={15} />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-2 top-0 z-50 w-48 overflow-hidden rounded-2xl border border-lightBorder bg-neutral-900/95 shadow-2xl backdrop-blur-xl">
                      <button
                        type="button"
                        disabled={isGenerating}
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteComponent(component.id);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash size={16} />
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
