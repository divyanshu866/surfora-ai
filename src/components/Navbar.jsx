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
    "group flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a] active:scale-95";

  return (
    <nav
      aria-label="Workspace"
      className="relative z-50 h-12 w-full border-b border-white/[0.08] bg-[#08080a]"
    >
      <div className="mx-auto flex h-full w-full max-w-[1800px] items-center gap-2 px-2.5 sm:gap-3 sm:px-3 lg:px-4">
        {/* ── Brand / sidebar toggle ── */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Mobile: menu + logo */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
            aria-pressed={sidebarCollapsed}
            className={`${iconBtn} border-white/[0.1] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white md:hidden`}
          >
            <Menu className="h-4 w-4" />
          </button>

          <Image
            src="/newlogo.svg"
            width={28}
            height={28}
            alt="Surfora AI"
            className="h-7 w-7 object-contain opacity-90 md:hidden"
            priority
          />

          {/* Desktop: logo ↔ sidebar icon swap on hover */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
            aria-pressed={sidebarCollapsed}
            className="group relative hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 active:scale-95 md:flex"
          >
            <Image
              src="/newlogo.svg"
              width={40}
              height={40}
              alt=""
              aria-hidden
              className="absolute h-7 w-7 object-contain opacity-90 transition-opacity duration-150 group-hover:opacity-0"
            />
            <Image
              src="/sidebar.svg"
              width={20}
              height={20}
              alt=""
              aria-hidden
              className="absolute h-5 w-5 object-contain opacity-0 transition-opacity duration-150 group-hover:opacity-80"
            />
          </button>

          {/* Desktop wordmark */}
          <Image
            src="/name.svg"
            width={100}
            height={60}
            alt="Surfora AI"
            className="hidden h-[15px] w-auto object-contain opacity-90 md:block"
            priority
          />
        </div>

        {/* ── Project name ── */}
        <div className="min-w-0 flex-1 md:max-w-[320px] sm:ml-25 md:flex-none">
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
            className={`h-8 w-full rounded-lg border bg-[#111114] px-2.5 text-[13px] font-medium tracking-tight outline-none transition-colors placeholder:text-zinc-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/15 sm:px-3 ${
              activeComponent?.name
                ? "border-white/[0.1] text-zinc-100"
                : "border-red-400/40 text-red-200"
            }`}
          />
        </div>

        {/* ── Actions ── */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {/* Desktop action buttons */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              onClick={onSave}
              title="Save project"
              aria-label="Save project"
              className={`${iconBtn} border-orange-400/25 bg-orange-400/[0.08] text-orange-200 hover:border-orange-300/45 hover:bg-orange-400/[0.14]`}
            >
              <Save className="h-3.5 w-3.5 transition-transform duration-150 group-hover:scale-110" />
            </button>

            <button
              type="button"
              onClick={() => setShowConsole((prev) => !prev)}
              title="Toggle console"
              aria-label="Toggle console"
              aria-pressed={showConsole}
              className={`${iconBtn} ${
                showConsole
                  ? "border-pink-400/50 bg-pink-400/[0.16] text-pink-100"
                  : "border-pink-400/25 bg-pink-400/[0.08] text-pink-200 hover:border-pink-300/45 hover:bg-pink-400/[0.14]"
              }`}
            >
              <SquareTerminal className="h-3.5 w-3.5 transition-transform duration-150 group-hover:scale-110" />
            </button>

            <button
              type="button"
              onClick={reRender}
              title="Refresh preview"
              aria-label="Refresh preview"
              className={`${iconBtn} border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-200 hover:border-emerald-300/45 hover:bg-emerald-400/[0.14]`}
            >
              <RefreshCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          {/* Mobile: overflow menu */}
          <div ref={moreRef} className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setShowMore((prev) => !prev)}
              aria-label="More actions"
              aria-expanded={showMore}
              className={`${iconBtn} border-white/[0.1] bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white`}
            >
              <Ellipsis className="h-4 w-4" />
            </button>

            {showMore && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-48 overflow-hidden rounded-xl border border-white/[0.1] bg-[#111114] p-1 shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
                <button
                  type="button"
                  onClick={() => {
                    onSave();
                    setShowMore(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white active:bg-white/[0.1]"
                >
                  <Save className="h-4 w-4 text-orange-300" />
                  Save project
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowConsole((prev) => !prev);
                    setShowMore(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white active:bg-white/[0.1]"
                >
                  <SquareTerminal className="h-4 w-4 text-pink-300" />
                  {showConsole ? "Hide console" : "Show console"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reRender();
                    setShowMore(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white active:bg-white/[0.1]"
                >
                  <RefreshCcw className="h-4 w-4 text-emerald-300" />
                  Refresh preview
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Profile ── */}
        <div className="shrink-0 border-l border-white/[0.08] pl-2 sm:pl-2.5">
          <Profile user={user} />
        </div>
      </div>
    </nav>
  );
}
