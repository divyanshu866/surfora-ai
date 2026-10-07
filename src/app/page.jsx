"use client";

import { useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Command,
  Cpu,
  Gauge,
  Globe2,
  Layers3,
  Monitor,
  MousePointer2,
  Play,
  RotateCcw,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import TheIdea from "../components/Landing/TheIdea";
import TheWhy from "../components/Landing/TheWhy";
import Capabilities from "../components/Landing/Capabilities";
import UseCases from "../components/Landing/UseCases";
import Pricing from "../components/Landing/Pricing";
import Start from "../components/Landing/Start";
import Footer from "../components/Landing/Footer";
import { Glow } from "../components/Landing/Helpers";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent text-white selection:bg-violet-500/30 selection:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-70 [background-image:radial-gradient(rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
      />

      <Navbar />

      <Hero />
      <TheIdea />

      <TheWhy />

      <Capabilities />

      <UseCases />
      <Pricing />

      <Start />

      <Footer />
    </main>
  );
}
