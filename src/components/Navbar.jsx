"use client";

import { Ellipsis, Menu, RefreshCcw, Save, SquareTerminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useConsole } from "@/context/ConsoleContext";
import { useEditorContext } from "@/context/EditorContext";
import Profile from "@/components/Profile";
import Image from "next/image";

export default function Navbar({ user }) {
  const { showConsole, setShowConsole, setConsoleLogs } = useConsole();

  const {
    activeComponent,
    setActiveComponent,
    previewKey,
    setPreviewKey,
    saveComponent,
    setShowPreview,
    sidebarCollapsed,
    setSidebarCollapsed,
    setReworkUI,
    updatePreview,
    targetTech,
  } = useEditorContext();

  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!moreRef.current?.contains(event.target)) {
        setShowMore(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function reRender() {
    setShowPreview(true);
    updatePreview(activeComponent);
    setConsoleLogs([]);
    setPreviewKey(previewKey + 1);
  }

  function onSave() {
    if (
      (activeComponent?.html ||
        activeComponent?.css ||
        activeComponent?.js ||
        activeComponent?.jsx) &&
      activeComponent?.name
    ) {
      const componentState = {
        id: activeComponent?.id,
        name: activeComponent?.name,
        messages: [],
        html: activeComponent?.html,
        css: activeComponent?.css,
        js: activeComponent?.js,
        jsx: activeComponent?.jsx,
        targetTech,
      };

      saveComponent(componentState);
      setShowPreview(true);
      setReworkUI(true);
    }
  }

  const iconBtn =
    "group flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a] active:scale-[0.97]";

  return (
    <nav
      aria-label="Workspace"
      className="relative z-50 h-11 w-full border-b border-[#1d1c20] bg-[#08080a]"
    >
      <div className="mx-auto flex h-full w-full items-center gap-1.5 px-2 sm:gap-2.5 sm:px-3 lg:px-3.5">
        {/* Brand / sidebar toggle */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Mobile: menu + logo */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
            aria-pressed={sidebarCollapsed}
            className={`${iconBtn} border-[#29272d] bg-[#111114] text-zinc-400 hover:border-[#39343f] hover:bg-[#17151a] hover:text-zinc-100 md:hidden`}
          >
            <Menu className="h-3.5 w-3.5" />
          </button>

          <Image
            src="/newlogo.svg"
            width={26}
            height={26}
            alt="Surfora AI"
            className="h-6 w-6 object-contain opacity-95 md:hidden"
            priority
          />

          {/* Desktop: logo ↔ sidebar icon swap on hover */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
            aria-pressed={sidebarCollapsed}
            className="group relative hidden h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-zinc-400 transition-colors hover:bg-white/[0.045] hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/45 active:scale-[0.97] md:flex"
          >
            <Image
              src="/newlogo.svg"
              width={32}
              height={32}
              alt=""
              aria-hidden
              className="absolute h-6 w-6 object-contain opacity-90 transition-opacity duration-150 group-hover:opacity-0"
            />
            <Image
              src="/sidebar.svg"
              width={18}
              height={18}
              alt=""
              aria-hidden
              className="absolute h-[18px] w-[18px] object-contain opacity-0 transition-opacity duration-150 group-hover:opacity-75"
            />
          </button>

          {/* Desktop wordmark */}
          <Image
            src="/name.svg"
            width={100}
            height={60}
            alt="Surfora AI"
            className="hidden h-[14px] w-auto object-contain opacity-90 md:block"
            priority
          />
        </div>

        {/* Project name */}
        <div className="min-w-0 flex-1 sm:ml-4 md:max-w-[280px] md:flex-none lg:ml-10">
          <input
            type="text"
            value={activeComponent?.name ?? ""}
            onChange={(e) =>
              setActiveComponent((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="Project name"
            aria-label="Project name"
            className={`h-7 w-full rounded-[7px] border bg-[#0e0e11] px-2.5 text-[12px] font-medium tracking-[-0.01em] outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-zinc-600 focus:border-violet-400/40 focus:bg-[#101014] focus:ring-2 focus:ring-violet-400/[0.08] sm:px-2.5 ${
              activeComponent?.name
                ? "border-[#29272d] text-zinc-200"
                : "border-red-400/30 text-red-200"
            }`}
          />
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {/* Desktop action buttons */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              onClick={onSave}
              title="Save project"
              aria-label="Save project"
              className={`${iconBtn} border-amber-300/[0.16] bg-amber-300/[0.035] text-amber-200/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] hover:border-amber-200/30 hover:bg-amber-300/[0.075] hover:text-amber-100`}
            >
              <Save className="h-3.5 w-3.5 stroke-1 transition-transform duration-150 group-hover:-translate-y-px" />
            </button>

            <button
              type="button"
              onClick={() => setShowConsole((prev) => !prev)}
              title="Toggle console"
              aria-label="Toggle console"
              aria-pressed={showConsole}
              className={`${iconBtn} ${
                showConsole
                  ? "border-violet-300/35 bg-violet-300/[0.11] text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_0_1px_rgba(167,139,250,0.04)]"
                  : "border-violet-300/[0.16] bg-violet-300/[0.035] text-violet-200/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] hover:border-violet-200/30 hover:bg-violet-300/[0.075] hover:text-violet-100"
              }`}
            >
              <SquareTerminal className="h-3.5 w-3.5 stroke-1 transition-transform duration-150 group-hover:scale-[1.04]" />
            </button>

            <button
              type="button"
              onClick={reRender}
              title="Refresh preview"
              aria-label="Refresh preview"
              className={`${iconBtn} border-teal-300/[0.16] bg-teal-300/[0.035] text-teal-200/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] hover:border-teal-200/30 hover:bg-teal-300/[0.075] hover:text-teal-100`}
            >
              <RefreshCcw className="h-3.5 w-3.5 stroke-1 transition-transform duration-300 group-hover:rotate-[-35deg]" />
            </button>
          </div>

          {/* Mobile: overflow menu */}
          <div ref={moreRef} className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setShowMore((prev) => !prev)}
              aria-label="More actions"
              aria-expanded={showMore}
              className={`${iconBtn} border-[#2b2930] bg-[#111114] text-zinc-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] hover:border-[#3b3842] hover:bg-[#17161a] hover:text-zinc-100`}
            >
              <Ellipsis className="h-4 w-4" />
            </button>

            {showMore && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-[10px] border border-[#302d35] bg-[#111114]/[0.98] p-1 shadow-[0_18px_48px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={() => {
                    onSave();
                    setShowMore(false);
                  }}
                  className="flex min-h-9 w-full items-center gap-2.5 rounded-[6px] px-2.5 text-left text-[12px] font-medium tracking-[-0.005em] text-zinc-300 transition-colors hover:bg-white/[0.055] hover:text-zinc-50 active:bg-white/[0.08]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-amber-300/[0.12] bg-amber-300/[0.045] text-amber-200/90">
                    <Save className="h-3.5 w-3.5 stroke-1" />
                  </span>
                  <span className="flex-1">Save project</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowConsole((prev) => !prev);
                    setShowMore(false);
                  }}
                  className="flex min-h-9 w-full items-center gap-2.5 rounded-[6px] px-2.5 text-left text-[12px] font-medium tracking-[-0.005em] text-zinc-300 transition-colors hover:bg-white/[0.055] hover:text-zinc-50 active:bg-white/[0.08]"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                      showConsole
                        ? "border-violet-300/25 bg-violet-300/[0.11] text-violet-100"
                        : "border-violet-300/[0.12] bg-violet-300/[0.045] text-violet-200/90"
                    }`}
                  >
                    <SquareTerminal className="h-3.5 w-3.5 stroke-1" />
                  </span>
                  <span className="flex-1">
                    {showConsole ? "Hide console" : "Show console"}
                  </span>
                  {showConsole && (
                    <span className="mr-0.5 h-1.5 w-1.5 rounded-full bg-violet-300/90" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reRender();
                    setShowMore(false);
                  }}
                  className="flex min-h-9 w-full items-center gap-2.5 rounded-[6px] px-2.5 text-left text-[12px] font-medium tracking-[-0.005em] text-zinc-300 transition-colors hover:bg-white/[0.055] hover:text-zinc-50 active:bg-white/[0.08]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-teal-300/[0.12] bg-teal-300/[0.045] text-teal-200/90">
                    <RefreshCcw className="h-3.5 w-3.5 stroke-[1.7]" />
                  </span>
                  <span className="flex-1">Refresh preview</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile */}
        <div className="shrink-0 border-l border-[#242228] pl-1.5 sm:pl-2">
          <Profile user={user} />
        </div>
      </div>
    </nav>
  );
}
