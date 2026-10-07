import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";
import { Glow } from "./Helpers";
import Image from "next/image";

export default function Start() {
  return (
    <section
      id="start"
      className="relative px-5 pb-24 pt-12 sm:px-6 lg:px-8 lg:pb-32 lg:pt-20"
    >
      <Glow className="left-1/2 top-12 h-96 w-96 -translate-x-1/2 opacity-35" />

      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[30px] border border-violet-400/15 bg-[#050305] px-6 py-16 text-center sm:px-10 sm:py-20">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08]">
          <Image
            src={"/newlogo.svg"}
            width={35}
            height={35}
            alt="surforaAI logo"
          />
        </div>

        <h2 className="mx-auto mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
          You have the idea. Describe it.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/52 sm:text-lg">
          Start with a prompt. Get a working interface. Keep refining until it
          feels right.
        </p>

        <a
          href="/workspace"
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-400 px-5 py-3 text-sm font-medium text-black shadow-[0_18px_70px_rgba(139,92,246,0.18)] transition hover:bg-violet-300"
        >
          Start building for free
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}
