"use client";
import { ArrowRight, ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.09] bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
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

        <div className="hidden items-center gap-8 text-xs text-white/52 md:flex">
          <Link href="#workflow" className="transition hover:text-white">
            Workflow
          </Link>

          <Link href="#capabilities" className="transition hover:text-white">
            Capabilities
          </Link>

          <Link href="#use-cases" className="transition hover:text-white">
            Use cases
          </Link>

          <Link href="#pricing" className="transition hover:text-white">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden rounded-lg px-3 py-2 text-xs text-white/52 transition hover:text-white sm:block"
          >
            Sign in
          </Link>

          <Link
            href="/workspace"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-medium text-black transition hover:bg-violet-100"
          >
            Start building
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
