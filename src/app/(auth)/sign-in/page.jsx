"use client";

import { motion } from "motion/react";
import { ShieldCheck, Zap, ArrowLeft } from "lucide-react";
import SignInGoogle from "@/components/OAuth/google-sign-in";
import SignInGithub from "@/components/OAuth/github-sign-in";
import Image from "next/image";
import Link from "next/link";

function AmbientBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[#070709]" />
      <div className="pointer-events-none fixed inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_78%)]" />
      <div className="pointer-events-none fixed left-1/2 top-[-18rem] h-[42rem] w-[58rem] -translate-x-1/2 rounded-full bg-violet-600/[0.10] blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-20rem] right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/[0.045] blur-[110px]" />
    </>
  );
}

function ProductSignal() {
  return (
    <div className="relative mt-12 hidden max-w-xl lg:block">
      <div className="absolute -inset-10 rounded-[40px] bg-violet-500/[0.035] blur-3xl" />
      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0b0b0e]/90 shadow-[0_32px_100px_rgba(0,0,0,0.48)]">
        <div className="flex h-10 items-center justify-between border-b border-white/[0.06] px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
          </div>
          <div className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[9px] tracking-[0.12em] text-white/30">
            LIVE WORKSPACE
          </div>
        </div>
        <div className="grid min-h-[270px] grid-cols-[88px_1fr]">
          <div className="border-r border-white/[0.06] bg-white/[0.012] p-3">
            <div className="h-2 w-8 rounded bg-white/15" />
            <div className="mt-7 space-y-2">
              {[48, 34, 42, 28, 38].map((width, index) => (
                <div
                  key={index}
                  className="h-5 rounded-md bg-white/[0.035]"
                  style={{ width }}
                />
              ))}
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-violet-300/60">
                  interface / generated
                </div>
                <div className="mt-2 text-lg font-medium tracking-[-0.03em] text-white/90">
                  Your idea, running.
                </div>
              </div>
              <div className="rounded-lg border border-emerald-300/10 bg-emerald-300/[0.05] px-2 py-1 text-[9px] text-emerald-200/60">
                READY
              </div>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2">
              <div className="h-16 rounded-xl border border-white/[0.06] bg-white/[0.025]" />
              <div className="h-16 rounded-xl border border-violet-300/10 bg-violet-300/[0.045]" />
              <div className="h-16 rounded-xl border border-white/[0.06] bg-white/[0.025]" />
            </div>
            <div className="mt-3 h-20 rounded-xl border border-white/[0.06] bg-white/[0.02]" />
            <div className="mt-5 flex items-center gap-2 text-[10px] text-white/25">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300/70" />
              Describe → generate → preview → rework
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070709] text-white antialiased">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
        <header className="relative z-10">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src={"/newlogo.svg"}
                width={40}
                height={40}
                alt="surforaAI logo"
              />
              <Image
                src={"/name.svg"}
                width={100}
                height={60}
                alt="surforaAI logo"
              />
            </Link>
            <a
              href="/workspace"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-zinc-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to workspace
            </a>
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center py-12 lg:py-16">
          <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.75fr] lg:gap-24">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/10 bg-violet-300/[0.035] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-violet-200/65">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-300/80 shadow-[0_0_12px_rgba(167,139,250,0.7)]" />
                  AI-first interface development
                </div>
                <h1 className="mt-7 max-w-2xl text-[clamp(3rem,5.2vw,5rem)] font-[450] leading-[0.98] tracking-[-0.065em] text-white">
                  Pick up where
                  <span className="block bg-gradient-to-r from-white via-violet-100 to-fuchsia-200 bg-clip-text text-transparent">
                    your interface begins.
                  </span>
                </h1>
                <p className="mt-6 max-w-lg text-[15px] leading-7 text-white/45">
                  Sign in to turn ideas into working interfaces, see them live,
                  and keep refining them through conversation.
                </p>
                <div className="mt-8 flex flex-wrap gap-5 text-[11px] text-white/30">
                  <span className="inline-flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-violet-300/65" />
                    Generate and rework
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-violet-300/65" />
                    Your workspace, preserved
                  </span>
                </div>
                <ProductSignal />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto w-full max-w-[430px]"
            >
              <div className="rounded-[28px] border border-white/[0.09] bg-[#0b0b0e]/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-8">
                <div className="mt-7 lg:mt-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-violet-200/60">
                    Welcome back
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-[28px]">
                    Continue building.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/38">
                    Sign in to open your SurforaAI workspace.
                  </p>
                </div>
                <div className="mt-8 space-y-3">
                  <SignInGoogle />
                  <SignInGithub />
                </div>
                <div className="my-7 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.07]" />
                  <span className="text-[10px] uppercase tracking-[0.16em] text-white/20">
                    secure sign in
                  </span>
                  <div className="h-px flex-1 bg-white/[0.07]" />
                </div>
                <p className="text-center text-[11px] leading-5 text-white/28">
                  By continuing, you agree to SurforaAI&apos;s terms and
                  acknowledge its privacy policy.
                </p>
              </div>
              <p className="mt-5 text-center text-[10px] text-white/20">
                No password to remember. Use your existing Google or GitHub
                account.
              </p>
            </motion.section>
          </div>
        </div>

        <footer className="flex items-center justify-between border-t border-white/[0.05] pt-5 text-[10px] text-white/20">
          <span>© 2026 SurforaAI</span>
          <span>Build the interface. Then keep improving it.</span>
        </footer>
      </div>
    </main>
  );
}
