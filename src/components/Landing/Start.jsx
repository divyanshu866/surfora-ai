import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Glow({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full blur-[110px] ${className}`}
    />
  );
}

export default function Start() {
  return (
    <section
      id="start"
      className="relative isolate overflow-hidden bg-[#030204] px-5 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      {/* Deep, restrained atmospheric backlight */}
      <Glow className="left-1/2 top-1/2 h-[380px] w-[620px] -translate-x-1/2 -translate-y-1/2 bg-violet-600/[0.12]" />

      <div className="relative mx-auto max-w-4xl">
        {/* Main Card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#07060a]/90 px-8 py-16 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_24px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:px-14 sm:py-20 lg:px-20 lg:py-24">
          {/* Specular hairline top accent */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/40 to-transparent" />

          {/* Subtle top spotlight flare */}
          <div className="pointer-events-none absolute -top-20 left-1/2 h-36 w-80 -translate-x-1/2 rounded-full bg-violet-400/[0.08] blur-2xl" />

          {/* Refined Brand Seal */}
          <div className="relative mx-auto flex h-13 w-13 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-b from-violet-400/[0.12] to-violet-500/[0.03] shadow-[0_0_20px_rgba(139,92,246,0.14),inset_0_1px_0_0_rgba(255,255,255,0.12)]">
            <Image
              src={"/newlogo.svg"}
              width={35}
              height={35}
              alt="surforaAI logo"
            />
          </div>

          {/* Heading */}
          <h2 className="mx-auto mt-8 max-w-2xl text-3xl font-medium tracking-tight text-white sm:text-5xl sm:leading-[1.12]">
            You have the idea.{" "}
            <span className="bg-gradient-to-r from-white via-white to-violet-200 bg-clip-text text-transparent">
              Describe it.
            </span>
          </h2>

          {/* Narrative */}
          <p className="mx-auto mt-4.5 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base sm:leading-7">
            Start with a prompt. Get a working interface in real-time. Keep
            refining code and layout until it feels right.
          </p>

          {/* CTA Actions */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
            <Link
              href="/workspace"
              className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-violet-400 px-6 py-3 text-sm font-medium text-black transition-all duration-200 hover:bg-violet-300 active:scale-[0.98]"
            >
              <span>Start building for free</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Quiet Trust Signals */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/35">
            <span>No credit card required</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Full React & Tailwind export</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Instant runtime preview</span>
          </div>
        </div>
      </div>
    </section>
  );
}
