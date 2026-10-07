import { ChevronLeft } from "lucide-react";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function TopBar() {
  return (
    <header className="relative z-20 flex items-center justify-between border-b border-white/[0.05] px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
      <Link href="/" aria-label="Back to SurforaAI">
        <Logo />
      </Link>
      <Link
        href="/workspace"
        className="inline-flex items-center gap-1.5 text-xs text-white/35 transition-colors hover:text-white/70"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to workspace
      </Link>
    </header>
  );
}
