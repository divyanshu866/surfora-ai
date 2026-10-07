"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Crown, LogOut } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useEditorContext } from "@/context/EditorContext";

import GenerationUsageIndicator from "@/components/GenerationUsageIndicator";

const Profile = ({ user }) => {
  const { generationUsage, setGenerationUsage, setGenerationLimitModalOpen } =
    useEditorContext();

  const router = useRouter();
  const containerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      await authClient.signOut();
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setSigningOut(false);
    }
  };

  const displayName = user?.name || "SurforaAI user";
  const email = user?.email || "";
  const plan = generationUsage?.plan ?? "FREE";
  const isPro = plan === "PRO";

  return (
    <div ref={containerRef} className="relative z-[105]">
      <button
        type="button"
        aria-label={open ? "Close account menu" : "Open account menu"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={[
          "relative flex h-full w-7 items-center justify-center rounded-full",
          "cursor-pointer border bg-white/[0.04] outline-none",
          "transition-colors duration-200",
          "focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0f]",
          open
            ? "border-violet-300/50"
            : "border-white/15 hover:border-white/30",
        ].join(" ")}
      >
        <Image
          src={user?.image || "/default-avatar.png"}
          width={40}
          height={40}
          alt={displayName}
          className="h-full w-full rounded-full object-cover"
        />

        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0b0b0f] bg-emerald-400"
        />
      </button>

      {open && (
        <div
          role="menu"
          className={[
            "absolute right-0 top-[calc(100%+0.75rem)]",
            "w-[min(22rem,calc(100vw-1.5rem))] max-h-[min(80vh,38rem)] overflow-y-auto",
            "rounded-2xl border border-lightBorder bg-backgroundLight",
            "shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
          ].join(" ")}
        >
          <div className="border-b border-white/[0.08] px-5 py-5">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="relative shrink-0">
                <Image
                  src={user?.image || "/default-avatar.png"}
                  width={44}
                  height={44}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-white/15"
                />

                <span
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#101116] bg-emerald-400"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-white">
                  {displayName}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-neutral-400">
                  {email}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 pt-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                    AI usage
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-100">
                      {isPro ? "Pro" : "Free"}
                    </span>

                    <span
                      className={[
                        "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                        isPro
                          ? "bg-violet-400/15 text-violet-200"
                          : "bg-white/[0.08] text-neutral-300",
                      ].join(" ")}
                    >
                      {isPro ? "Active" : "Current"}
                    </span>
                  </div>
                </div>
              </div>

              <GenerationUsageIndicator
                generationUsage={generationUsage}
                onLimitReached={() => {
                  setGenerationLimitModalOpen(true);
                }}
              />
            </div>
          </div>

          {!isPro && (
            <div className="px-4 pt-3">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  window.location.assign("/upgrade");
                }}
                className={[
                  "group flex min-h-16 w-full items-center gap-3 rounded-xl px-3 py-3",
                  "cursor-pointer text-left transition-colors",
                  "hover:bg-violet-400/[0.08]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60",
                ].join(" ")}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/10">
                  <Crown className="h-4 w-4 text-amber-300" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-neutral-100">
                    Upgrade to Pro
                  </span>
                  <span className="mt-1 block text-xs leading-4 text-neutral-400">
                    Unlock more AI capacity and powerful models
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="text-sm text-neutral-500 transition-colors group-hover:text-violet-200"
                >
                  →
                </span>
              </button>
            </div>
          )}

          <div className={["px-4 pb-4", isPro ? "pt-3" : "pt-1"].join(" ")}>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={signingOut}
              className={[
                "group flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-3",
                "cursor-pointer text-left transition-colors",
                "hover:bg-red-400/[0.08]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
              ].join(" ")}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-400/[0.08]">
                <LogOut className="h-4 w-4 text-red-300/90 transition-colors group-hover:text-red-200" />
              </span>

              <span className="text-sm font-medium text-red-300/90 transition-colors group-hover:text-red-200">
                {signingOut ? "Signing out…" : "Sign out"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
