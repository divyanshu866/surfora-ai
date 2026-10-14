"use client";
import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, Menu, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.09] bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5"
        >
          <Image
            src={"/newlogo.svg"}
            width={36}
            height={36}
            alt="surforaAI logo"
            className="h-8 w-8 sm:h-9 sm:w-9"
          />

          <Image
            src={"/name.svg"}
            width={80}
            height={30}
            alt="surforaAI logo"
            className="h-5 w-auto"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-6 whitespace-nowrap text-xs text-white/52 lg:flex lg:gap-8">
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
          <Link href="/privacy-policy" className="transition hover:text-white">
            Privacy Policy
          </Link>
        </div>

        {/* Action Controls & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/sign-in"
            className="hidden rounded-lg px-3 py-2 text-xs text-white/52 transition hover:text-white sm:block"
          >
            Sign in
          </Link>

          <Link
            href="/workspace"
            className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-violet-100 sm:gap-2 sm:px-3.5 sm:py-2"
          >
            <span className="hidden sm:inline">Start building</span>
            <span className="sm:hidden">Build</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* Mobile Menu Hamburger / Close Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-1 focus:ring-white/20 lg:hidden"
            aria-controls="mobile-navbar-menu"
            aria-expanded={menuOpen}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-navbar-menu"
        className={`overflow-hidden border-b border-white/[0.09] bg-black/95 transition-all duration-300 ease-in-out lg:hidden ${
          menuOpen
            ? "max-h-96 opacity-100 py-4"
            : "max-h-0 opacity-0 py-0 border-none"
        }`}
      >
        <div className="flex flex-col space-y-1 px-5">
          <Link
            href="#workflow"
            onClick={closeMenu}
            className="rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Workflow
          </Link>
          <Link
            href="#capabilities"
            onClick={closeMenu}
            className="rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Capabilities
          </Link>
          <Link
            href="#use-cases"
            onClick={closeMenu}
            className="rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Use cases
          </Link>
          <Link
            href="#pricing"
            onClick={closeMenu}
            className="rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/privacy-policy"
            onClick={closeMenu}
            className="rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Privacy Policy
          </Link>

          <div className="mt-3 border-t border-white/[0.08] pt-3 sm:hidden">
            <Link
              href="/sign-in"
              onClick={closeMenu}
              className="flex w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
