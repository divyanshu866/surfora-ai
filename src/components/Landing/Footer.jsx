import { Sparkles } from "lucide-react";
import Logo from "@/components/Logo";

const PRODUCT_LINKS = [
  { label: "Workspace", href: "/workspace" },
  { label: "Examples", href: "/Examples" },
];

const ACCOUNT_LINKS = [{ label: "Sign in", href: "/sign-in" }];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.09] px-5 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-xs text-white/32 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-white/52">
          <Logo />
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <a href="#workflow" className="transition hover:text-white/50">
            Workflow
          </a>

          <a href="#capabilities" className="transition hover:text-white/50">
            Capabilities
          </a>

          <a href="#pricing" className="transition hover:text-white/50">
            Pricing
          </a>

          <span>Build interfaces by describing them.</span>
        </div>
      </div>
    </footer>
  );
}
