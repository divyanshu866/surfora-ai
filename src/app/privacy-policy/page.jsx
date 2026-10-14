"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  ArrowLeft,
  ArrowUp,
  Clock,
  Printer,
  Copy,
  Check,
  Menu,
  X,
  ExternalLink,
  Shield,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react";
import Link from "next/link";

const OPERATOR_NAME =
  typeof process !== "undefined" &&
  process.env?.NEXT_PUBLIC_PRIVACY_OPERATOR_NAME?.trim()
    ? process.env.NEXT_PUBLIC_PRIVACY_OPERATOR_NAME.trim()
    : "";

const PRIVACY_EMAIL =
  typeof process !== "undefined" &&
  process.env?.NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL?.trim()
    ? process.env.NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL.trim()
    : "";

const OPERATOR_ADDRESS =
  typeof process !== "undefined" &&
  process.env?.NEXT_PUBLIC_PRIVACY_OPERATOR_ADDRESS?.trim()
    ? process.env.NEXT_PUBLIC_PRIVACY_OPERATOR_ADDRESS.trim()
    : "";

const effectiveDate = "14 October 2026";

const sections = [
  [
    "who-we-are",
    "1. Who we are",
    "Operator, hosting locations & company identity",
  ],
  [
    "scope",
    "2. Scope of this policy",
    "Applicable services, workspaces, and third-party limits",
  ],
  [
    "information-we-collect",
    "3. Information we collect",
    "Account data, prompts, code, telemetry & billing info",
  ],
  [
    "how-we-use",
    "4. How we use information",
    "Purposes for AI generation, maintenance & security",
  ],
  [
    "ai-processing",
    "5. AI requests, providers, and generated content",
    "Model providers (OpenAI, Google Vertex, Z.AI) & handling",
  ],
  [
    "preview",
    "6. Live preview and third-party code",
    "Browser sandbox, package CDN (esm.sh) & execution safety",
  ],
  [
    "sharing",
    "7. When information is shared",
    "Subprocessors, Vercel, Neon, Paddle & authorities",
  ],
  [
    "payments",
    "8. Subscriptions and payments",
    "Paddle checkout, card security & subscription records",
  ],
  [
    "legal-basis",
    "9. Legal grounds for processing",
    "GDPR compliance table & contractual lawful bases",
  ],
  [
    "retention",
    "10. Retention and deletion",
    "Data life cycles, backup rotation & erasure requests",
  ],
  [
    "security",
    "11. Security",
    "Technical safeguards, encryption & shared responsibilities",
  ],
  [
    "international",
    "12. International processing",
    "Cross-border transfers & operational jurisdiction",
  ],
  [
    "rights",
    "13. Your privacy rights and choices",
    "GDPR/CCPA rights, access, correction & portability",
  ],
  [
    "cookies",
    "14. Cookies and browser storage",
    "Essential session tokens, storage & browser settings",
  ],
  [
    "children",
    "15. Children",
    "Developer-focused age requirements & removal policy",
  ],
  [
    "changes",
    "16. Changes to this policy",
    "Policy updates, notices & effective date tracking",
  ],
  [
    "contact",
    "17. Contact and privacy requests",
    "Operator address, contact email & inquiry guidelines",
  ],
];

function ProviderLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1 font-medium text-violet-300 decoration-violet-400/40 underline-offset-4 hover:underline hover:text-violet-200 transition-colors"
    >
      <span>{children}</span>
      <ExternalLink className="h-3 w-3 opacity-60 inline" />
    </a>
  );
}

function DataTable({ rows }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.015]">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.04] text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <tr>
              <th
                scope="col"
                className="px-5 py-3.5 border-b border-white/[0.08]"
              >
                Purpose / Activity
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 border-b border-white/[0.08]"
              >
                Typical Lawful Basis (GDPR / UK GDPR)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.map(([purpose, basis]) => (
              <tr
                key={purpose}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <th
                  scope="row"
                  className="px-5 py-4 font-medium text-zinc-200 text-xs sm:text-sm"
                >
                  {purpose}
                </th>
                <td className="px-5 py-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  <span className="inline-block rounded-md bg-violet-500/10 px-2 py-1 text-violet-300 border border-violet-500/20 text-xs mr-2 mb-1">
                    Applicable Basis
                  </span>
                  {basis}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sm:hidden px-4 py-2 bg-white/[0.02] border-t border-white/[0.06] text-[11px] text-zinc-500 flex items-center justify-between">
        <span>← Swipe horizontally to view full table →</span>
      </div>
    </div>
  );
}

function PolicySection({ id, title, subtitle, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      id={id}
      className="group relative scroll-mt-24 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 sm:p-8 backdrop-blur-sm transition-all hover:border-white/[0.12]"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5 border-b border-white/[0.06] pb-4">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-violet-400 font-medium">
            Section Ref
          </span>
          <h2 className="mt-0.5 text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-xs text-zinc-400 font-normal">{subtitle}</p>
          )}
        </div>

        <button
          onClick={handleCopyLink}
          type="button"
          aria-label={`Copy link to ${title}`}
          className="inline-flex items-center gap-1.5 self-start rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.07] hover:border-white/[0.15] transition"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-medium text-[11px]">
                Copied URL
              </span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 opacity-60" />
              <span className="text-[11px]">Share Link</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-4 text-[14px] leading-7 text-zinc-300/90 sm:text-[15px] sm:leading-8 font-normal">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("who-we-are");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Filter sections based on user search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter(
      ([id, title, desc]) =>
        title.toLowerCase().includes(query) ||
        id.toLowerCase().includes(query) ||
        (desc && desc.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  // Scroll spy & reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalHeight > 0) {
        setScrollProgress(
          Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100)),
        );
      }

      setShowBackToTop(currentScroll > 400);

      // Determine active section
      const sectionElements = sections.map(([id]) =>
        document.getElementById(id),
      );
      const scrollPos = window.scrollY + 180;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i][0]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileDrawerOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const topOffset =
        element.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const currentSectionMeta = sections.find(([id]) => id === activeSection);
  const currentSectionIndex =
    sections.findIndex(([id]) => id === activeSection) + 1;

  return (
    <main className="min-h-screen bg-[#08080b] text-zinc-300 selection:bg-violet-600/40 selection:text-white font-sans antialiased">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/[0.05] z-50">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Radial aura glow */}
      <div className="pointer-events-none fixed inset-0 -z-0 bg-[radial-gradient(ellipse_60%_36%_at_50%_0%,rgba(124,58,237,0.13),transparent_72%)]" />
      <div className="pointer-events-none fixed bottom-0 right-0 -z-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full" />

      {/* Sticky Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#08080b]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to App</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 border-l border-white/[0.08] pl-4">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
              <span className="text-xs font-medium text-zinc-400">
                SurforaAI Legal Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Print button */}
            <button
              onClick={handlePrint}
              type="button"
              title="Print policy or save to PDF"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* Mobile TOC Drawer Trigger */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              type="button"
              className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-500/20 transition"
            >
              <Menu className="h-4 w-4" />
              <span>Contents ({currentSectionIndex}/17)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 pt-8 sm:pt-12">
        {/* Hero Section */}
        <div className="border-b border-white/[0.08] pb-10 sm:pb-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium tracking-wide text-violet-300">
              <Shield className="h-3 w-3" />
              Official Documentation
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-zinc-400">
              <Clock className="h-3 w-3 opacity-60" />
              ~8 min read
            </span>
            <span className="text-xs text-zinc-500">
              Effective Date:{" "}
              <strong className="text-zinc-300 font-medium">
                {effectiveDate}
              </strong>
            </span>
          </div>

          <div className="mt-5 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg sm:leading-8">
              This policy explains how SurforaAI handles personal information
              when you create an account, describe interfaces to our AI,
              generate or rework frontend components, inspect code in live
              sandboxed previews, and manage enterprise or developer
              subscriptions.
            </p>
          </div>

          {/* Key Takeaway Callout Card */}
          <div className="mt-8 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/20 to-zinc-900/40 p-5 sm:p-6 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-violet-500/20 p-1.5 text-violet-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  Executive Summary & Core Privacy Commitments
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-300/90">
                  <strong className="text-violet-200 font-medium">
                    No Foundation Model Training:
                  </strong>{" "}
                  We do not sell your prompts or interface code, nor do we train
                  internal foundation models on your intellectual property. Data
                  submitted is routed specifically to the AI provider
                  corresponding to your chosen model to return frontend results.
                  Subscriptions and billing are securely administered through
                  Paddle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: Sticky Sidebar + Main Article */}
        <div className="mt-8 sm:mt-12 grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          {/* Desktop Sticky Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-3 scrollbar-thin">
              {/* Search Within Policy */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.09] bg-white/[0.03] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-violet-500 focus:bg-white/[0.06] focus:outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-xs text-zinc-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Table of Contents
                </p>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {filteredSections.length} items
                </span>
              </div>

              <nav aria-label="Privacy policy table of contents">
                <ul className="space-y-1">
                  {filteredSections.map(([id, title]) => {
                    const isActive = activeSection === id;
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => scrollToSection(id)}
                          className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-all flex items-center justify-between group ${
                            isActive
                              ? "bg-violet-500/15 text-violet-200 font-medium border border-violet-500/25 shadow-sm"
                              : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
                          }`}
                        >
                          <span className="truncate pr-2">{title}</span>
                          <ChevronRight
                            className={`h-3 w-3 shrink-0 transition-transform ${
                              isActive
                                ? "text-violet-400 translate-x-0.5"
                                : "opacity-0 group-hover:opacity-100 text-zinc-600"
                            }`}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Quick Jump Contact Help Box */}
              <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs text-zinc-400">
                <p className="font-medium text-white mb-1">
                  Need legal clarification?
                </p>
                <p className="text-[11px] leading-relaxed mb-3">
                  Contact our designated Data Protection desk for inquiries.
                </p>
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="w-full text-center rounded-lg border border-white/[0.1] bg-white/[0.04] py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/[0.08] transition"
                >
                  Jump to Contact Details →
                </button>
              </div>
            </div>
          </aside>

          {/* Policy Body Content */}
          <article className="min-w-0 space-y-8 sm:space-y-10">
            {/* Section 1 */}
            <PolicySection
              id="who-we-are"
              title="1. Who we are"
              subtitle="Identity of the operator and cloud architecture"
            >
              <p>
                “SurforaAI,” “we,” “us,” and “our” refer to the operator of the
                SurforaAI service. SurforaAI is an AI-first interface
                development platform that lets users describe an interface,
                generate working frontend code, inspect it in a live preview
                sandbox, and iteratively rework and refine it.
              </p>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 my-2">
                <p className="text-xs sm:text-sm">
                  <span className="text-zinc-400">Service Operator: </span>
                  <strong className="text-white font-medium">
                    {OPERATOR_NAME ||
                      "SurforaAI operator details must be completed before publication"}
                  </strong>
                </p>
              </div>
              <p>
                Our primary application database is PostgreSQL, currently hosted
                in India. The web application is hosted through Vercel. Some
                service providers may process information in other countries, as
                explained below in Section 12.
              </p>
            </PolicySection>

            {/* Section 2 */}
            <PolicySection
              id="scope"
              title="2. Scope of this policy"
              subtitle="Covered services and third-party demarcations"
            >
              <p>
                This policy applies to the SurforaAI website, account and
                workspace features, AI interface generation and rework, saved
                interface projects, the React and HTML/CSS/JavaScript preview
                workflows, and subscription features operated by SurforaAI.
              </p>
              <p>
                It does not govern third-party websites, identity providers,
                payment services, AI providers, or external APIs independently.
                Those services process information under their own terms and
                privacy notices when you interact with them or when the service
                transmits necessary request payloads to them.
              </p>
            </PolicySection>

            {/* Section 3 */}
            <PolicySection
              id="information-we-collect"
              title="3. Information we collect"
              subtitle="Data categories received from your account and workspace"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    Account and sign-in information
                  </h3>
                  <p className="mt-1">
                    We process account identifiers and profile details made
                    available through your chosen sign-in method, which may
                    include your name, email address, profile image, and
                    identity-provider identifiers. Google and GitHub sign-in may
                    involve those providers receiving authentication requests
                    and returning the required cryptographic claims needed to
                    establish and maintain your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    Prompts, interfaces, and saved work
                  </h3>
                  <p className="mt-1">
                    We process content you submit or create through SurforaAI,
                    such as prompts, conversation messages, interface
                    descriptions, rework instructions, generated responses,
                    project names, and source code. Depending on the interface
                    format, this may include JSX/React code or HTML, CSS, and
                    JavaScript. If you save a project or use conversation-based
                    refinement, associated project and prompt history may be
                    stored so that the service can retrieve, inspect, and update
                    that work.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    Usage and diagnostic information
                  </h3>
                  <p className="mt-1">
                    We may process feature usage, generation counts, account
                    plan and entitlement state, selected model and effort
                    setting, AI usage metadata such as token counts, timestamps,
                    preview errors, and diagnostic or error logs. This
                    information helps operate the platform, enforce quotas,
                    diagnose browser preview anomalies, protect accounts, and
                    optimize performance.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    Technical and transaction metadata
                  </h3>
                  <p className="mt-1">
                    When you access the service, SurforaAI and its
                    infrastructure providers may process technical data
                    associated with a request, such as IP address,
                    browser/device user-agent strings, request timestamps, and
                    server security logs. If you subscribe to a paid tier, we
                    also process subscription and transaction metadata supplied
                    by Paddle, such as customer identifiers, plan tier, price
                    ID, payment status, billing cycle, and renewal states.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200/90 leading-relaxed">
                  <strong className="font-semibold text-amber-200">
                    Notice on sensitive data:{" "}
                  </strong>
                  We strictly do not ask you to submit sensitive personal data,
                  passwords, private cryptographic keys, production database
                  secrets, or third-party confidential secrets in prompts or
                  generated code. Please exclude secrets that are not required
                  for your interface generation tasks.
                </div>
              </div>
            </PolicySection>

            {/* Section 4 */}
            <PolicySection
              id="how-we-use"
              title="4. How we use information"
              subtitle="Operational purposes and processing boundaries"
            >
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {[
                  "Create, maintain, and authenticate your user workspace.",
                  "Process prompts, synthesize code, and return AI-generated components.",
                  "Save, retrieve, branch, and inspect project revision history.",
                  "Operate live sandboxed previews and dynamically resolve module dependencies.",
                  "Enforce plan quotas, token limits, and subscription tier entitlements.",
                  "Process customer transactions, billing lifecycle, and tax reconciliation records.",
                  "Maintain service reliability, prevent DDoS or abusive workloads, and secure accounts.",
                  "Comply with mandatory legal requests and establish or defend legal claims.",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-zinc-300"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[11px] font-mono font-medium text-violet-300">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.015]">
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  <strong className="text-white font-medium">
                    Model Training Guarantee:{" "}
                  </strong>
                  We do not sell your prompts, source code, or generated
                  interfaces as standalone products, and we do not use your
                  proprietary project content to train a SurforaAI foundation
                  model. Any new use materially different from these specified
                  purposes will be explicitly disclosed where required by law.
                </p>
              </div>
            </PolicySection>

            {/* Section 5 */}
            <PolicySection
              id="ai-processing"
              title="5. AI requests, providers, and generated content"
              subtitle="How prompts are routed to foundation model vendors"
            >
              <p>
                When you request an AI answer, generate an interface, or ask for
                a rework, the relevant prompt, conversation context, and code
                needed to fulfil that request are sent to the AI service
                associated with the selected model. SurforaAI currently uses
                multiple providers; depending on model and service
                configuration, this may include OpenAI, Google Cloud Vertex
                AI/Agent Platform for Gemini services, and Z.AI for GLM
                services. The provider and model available to you may depend on
                your plan and current product configuration.
              </p>
              <p>
                The AI provider processes the request to return an output. The
                content that is sent may contain personal information if you
                include it in your prompt or code. Do not submit confidential or
                sensitive data unless you are authorised to do so and are
                comfortable with the applicable processing.
              </p>
              <p>
                SurforaAI does not operate its own foundation-model training
                programme using your prompts or generated code. Third-party
                providers may have their own logging, abuse-monitoring,
                retention, and data-use terms. These terms can differ by
                provider, product, account type, and configuration. We do not
                promise that every provider has identical retention or
                zero-data-retention settings; review the applicable provider
                terms:
              </p>

              <div className="grid sm:grid-cols-3 gap-3 my-2">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs">
                  <p className="font-semibold text-white mb-1.5">OpenAI</p>
                  <p className="text-zinc-400 mb-2 text-[11px]">
                    GPT-4o, o-series & related APIs
                  </p>
                  <div className="space-y-1">
                    <div>
                      <ProviderLink href="https://openai.com/policies/privacy-policy/">
                        Privacy Policy
                      </ProviderLink>
                    </div>
                    <div>
                      <ProviderLink href="https://developers.openai.com/api/docs/guides/your-data">
                        API Data Controls
                      </ProviderLink>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs">
                  <p className="font-semibold text-white mb-1.5">
                    Google Cloud Vertex
                  </p>
                  <p className="text-zinc-400 mb-2 text-[11px]">
                    Gemini 1.5/Flash infrastructure
                  </p>
                  <div className="space-y-1">
                    <div>
                      <ProviderLink href="https://policies.google.com/privacy">
                        Google Privacy
                      </ProviderLink>
                    </div>
                    <div>
                      <ProviderLink href="https://cloud.google.com/vertex-ai/generative-ai/docs/data-governance">
                        Vertex Governance
                      </ProviderLink>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs">
                  <p className="font-semibold text-white mb-1.5">Z.AI</p>
                  <p className="text-zinc-400 mb-2 text-[11px]">
                    GLM model series endpoints
                  </p>
                  <div className="space-y-1">
                    <div>
                      <ProviderLink href="https://chat.z.ai/legal-agreement/privacy-policy">
                        Privacy Policy
                      </ProviderLink>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[11px]">
                        API Data Terms
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-400">
                AI-generated text and code may be inaccurate, insecure,
                incomplete, or unsuitable for production. Review generated code
                before using it, especially where it processes personal
                information or connects to external services.
              </p>
            </PolicySection>

            {/* Section 6 */}
            <PolicySection
              id="preview"
              title="6. Live preview and third-party code"
              subtitle="Sandboxing, iframe containment, and client-side package CDNs"
            >
              <p>
                SurforaAI can compile and display generated interfaces in a
                browser-based, iframe-style preview. The React preview may load
                JavaScript packages from an external package CDN, including
                esm.sh, so that imported dependencies can run directly in the
                browser. Such CDN requests can expose ordinary request metadata,
                such as your IP address and browser user-agent, to the relevant
                provider.
              </p>
              <p>
                Generated code and third-party packages may also make network
                requests when their functionality requires it—for example, to
                load remote images, fonts, datasets, or an API that you or the
                generated code configure. Those requests go to the relevant
                third party and are governed by that party’s terms and privacy
                practices. SurforaAI does not control independent third-party
                destinations used by code in a preview.
              </p>
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-xs leading-relaxed text-zinc-300">
                <strong className="text-violet-300">
                  Sandbox Safety Rule:{" "}
                </strong>
                Treat preview code as executable code. Inspect it before running
                it, and do not put private API keys, passwords, or other secrets
                into client-side code: code running in a browser can be
                inspected by anyone with browser devtools access. The preview
                sandbox is a containment measure, not a promise that code cannot
                make external network requests.
              </div>
              <p className="text-xs text-zinc-400">
                Package CDN provider:{" "}
                <ProviderLink href="https://esm.sh/">esm.sh</ProviderLink>.
              </p>
            </PolicySection>

            {/* Section 7 */}
            <PolicySection
              id="sharing"
              title="7. When information is shared"
              subtitle="Authorized subprocessors and third-party data flows"
            >
              <p>
                We disclose information to service providers only as needed to
                operate, secure, support, and improve the requested service, to
                process payments, or to meet legal obligations. Depending on the
                feature you use, recipients may include:
              </p>

              <div className="space-y-2.5">
                {[
                  [
                    "Hosting & application infrastructure",
                    "Vercel for application edge hosting, DNS delivery, and operational logs; and Neon (managed PostgreSQL) for persistent user projects, accounts, prompts, and metadata.",
                    "https://vercel.com/legal/privacy-notice",
                  ],
                  [
                    "AI inference providers",
                    "OpenAI, Google Cloud Vertex AI/Agent Platform, or Z.AI for processing prompts and synthesizing component code as configured for the model.",
                    "https://openai.com/policies/privacy-policy/",
                  ],
                  [
                    "Sign-in & authentication providers",
                    "Google or GitHub when authenticating through OAuth2 federated sign-in methods.",
                    "https://policies.google.com/privacy",
                  ],
                  [
                    "Payment merchant & billing",
                    "Paddle for checkout, invoicing, recurring subscriptions, tax calculation, and fraud analysis. Paddle acts as the Merchant of Record.",
                    "https://www.paddle.com/legal/privacy",
                  ],
                  [
                    "Package delivery CDN",
                    "esm.sh or fallback package CDNs to resolve and stream imported npm modules within the client sandbox.",
                    "https://esm.sh/",
                  ],
                  [
                    "Legal authorities & professional advisers",
                    "Disclosures required by applicable subpoena, law enforcement mandate, or to protect critical security and legal claims.",
                    null,
                  ],
                ].map(([name, desc, link], i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-xs sm:text-sm"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-zinc-200">
                        {name}:{" "}
                      </span>
                      <span className="text-zinc-400 leading-relaxed">
                        {desc}
                      </span>
                    </div>
                    {link && (
                      <div className="mt-1 sm:mt-0 shrink-0">
                        <ProviderLink href={link}>Notice</ProviderLink>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs sm:text-sm">
                We may also disclose information as part of a proposed or
                completed business transfer, restructuring, or acquisition,
                subject to applicable law and appropriate protections. We do not
                sell personal information for money.
              </p>
            </PolicySection>

            {/* Section 8 */}
            <PolicySection
              id="payments"
              title="8. Subscriptions and payments"
              subtitle="Paddle merchant-of-record protocols and card security"
            >
              <p>
                Paid subscriptions and checkout are handled through Paddle.
                During checkout, Paddle may collect payment-card details,
                billing information, contact details, and information needed to
                prevent fraud, process a transaction, calculate applicable
                taxes, and meet legal requirements. The details Paddle collects
                directly are subject to Paddle’s own privacy notice and checkout
                flow.
              </p>
              <p>
                SurforaAI receives and stores the identifiers and status
                information required to link a transaction or subscription to
                your account, apply the correct plan, and administer renewals,
                cancellations, refunds, and entitlements. We do not ask you to
                send full payment-card numbers or security codes to SurforaAI.
              </p>
              <p>
                Read{" "}
                <ProviderLink href="https://www.paddle.com/legal/privacy">
                  Paddle’s privacy policy
                </ProviderLink>{" "}
                for information about its handling of payment and transaction
                data.
              </p>
            </PolicySection>

            {/* Section 9 */}
            <PolicySection
              id="legal-basis"
              title="9. Legal grounds for processing"
              subtitle="GDPR & statutory legal basis matrix"
            >
              <p>
                Where a law such as the EU or UK GDPR requires a lawful basis,
                the basis depends on the purpose and circumstances. The
                following describes the bases we generally expect to rely on,
                where applicable; the precise basis can vary by jurisdiction and
                processing context.
              </p>

              <DataTable
                rows={[
                  [
                    "Creating and managing an account; saving and retrieving projects",
                    "Performing the service contract or taking steps requested before entering it.",
                  ],
                  [
                    "Sending prompts to an AI provider and returning results",
                    "Performing the service you requested and, where relevant, legitimate interests in operating the AI workflow safely.",
                  ],
                  [
                    "Managing plans, quotas, and subscription status",
                    "Performing the service contract and administering the subscription.",
                  ],
                  [
                    "Payment records, tax, and financial compliance",
                    "Compliance with legal obligations and administration of the transaction.",
                  ],
                  [
                    "Security, fraud prevention, diagnostics, and service reliability",
                    "Legitimate interests in protecting and maintaining the service, balanced against applicable rights.",
                  ],
                  [
                    "Responding to legal requests and protecting legal rights",
                    "Compliance with legal obligations and/or legitimate interests in handling or defending claims.",
                  ],
                ]}
              />

              <p className="text-xs sm:text-sm text-zinc-400">
                Where consent is required, we will seek it for the relevant
                activity and you may withdraw it at any time. Withdrawing
                consent does not make prior processing unlawful, though it may
                affect features that depend on that data.
              </p>
            </PolicySection>

            {/* Section 10 */}
            <PolicySection
              id="retention"
              title="10. Retention and deletion"
              subtitle="Data lifecycles, archival schedules, and erasure procedures"
            >
              <p>
                We keep personal information for no longer than reasonably
                necessary for the purposes described in this policy, subject to
                legal requirements, disputes, and legitimate security needs.
                Retention depends on the category of data and why it is needed:
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">•</span>
                  <span>
                    <strong>Account details & projects:</strong> Retained while
                    the account is active until deletion is requested or the
                    data is no longer utilized.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">•</span>
                  <span>
                    <strong>Prompt & AI session logs:</strong> Retained with
                    project files to support undo/redo, revision diffing,
                    debugging, and quota reconciliation.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">•</span>
                  <span>
                    <strong>System & audit logs:</strong> Kept for short windows
                    strictly necessary to protect against distributed attacks,
                    analyze crash dumps, and uphold uptime.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">•</span>
                  <span>
                    <strong>Financial ledgers:</strong> Certain transaction
                    metadata is retained to comply with mandatory statutory
                    accounting and tax retention periods.
                  </span>
                </li>
              </ul>

              <p className="text-xs sm:text-sm">
                To request permanent deletion of your account and saved
                interface workspaces, contact our privacy desk via Section 17.
                Identity verification may be required before completing deletion
                requests.
              </p>
            </PolicySection>

            {/* Section 11 */}
            <PolicySection
              id="security"
              title="11. Security"
              subtitle="Technical measures, encryption standards, and security hygiene"
            >
              <p>
                We use reasonable technical and organisational measures intended
                to protect information against unauthorised access, loss,
                misuse, alteration, or disclosure. Measures include TLS
                encryption in transit, managed database access controls, and
                defensive safeguards provided by our cloud hosting and
                authentication partners.
              </p>
              <p>
                No internet transmission or digital repository can be guaranteed
                completely impenetrable. You are responsible for keeping your
                sign-in methods safe and never embedding production private keys
                or credentials into client-side interface code. Contact us
                immediately if you suspect any account compromise.
              </p>
            </PolicySection>

            {/* Section 12 */}
            <PolicySection
              id="international"
              title="12. International processing"
              subtitle="Cross-border data routing and adequacy mechanisms"
            >
              <p>
                SurforaAI is operated from India and its primary application
                database is currently hosted in India. However, the web
                application, AI providers, identity providers, payment services,
                and package CDNs may process data in other countries where they
                or their service providers operate. This means information may
                cross national borders and fall under legal jurisdictions
                differing from your home state.
              </p>
              <p>
                Where applicable cross-border data protection laws mandate
                safeguards, we rely on standard contractual clauses, vendor
                commitments, or recognized adequacy mechanisms.
              </p>
            </PolicySection>

            {/* Section 13 */}
            <PolicySection
              id="rights"
              title="13. Your privacy rights and choices"
              subtitle="Data subject rights: access, rectification, objection & portability"
            >
              <p>
                Depending on your location and applicable privacy statutes
                (including EU/UK GDPR and California CCPA/CPRA), you may hold
                the right to:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-2">
                {[
                  [
                    "Access & Inspection",
                    "Request a copy of personal information we hold.",
                  ],
                  ["Rectification", "Correct inaccurate or outdated records."],
                  [
                    "Erasure",
                    "Request permanent deletion of your profile and data.",
                  ],
                  [
                    "Restriction",
                    "Limit processing during ongoing dispute reviews.",
                  ],
                  [
                    "Data Portability",
                    "Obtain your saved interface code in machine-readable format.",
                  ],
                  [
                    "Consent Withdrawal",
                    "Revoke optional permissions without retroactive penalty.",
                  ],
                ].map(([title, desc], idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-xs"
                  >
                    <p className="font-semibold text-zinc-200">{title}</p>
                    <p className="mt-1 text-zinc-400 text-[11px] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs sm:text-sm text-zinc-400">
                To exercise any of these protections, submit your request using
                the contact methods in Section 17.
              </p>
            </PolicySection>

            {/* Section 14 */}
            <PolicySection
              id="cookies"
              title="14. Cookies and browser storage"
              subtitle="Session tokens, local storage, and tracking choices"
            >
              <p>
                SurforaAI utilizes essential session cookies and standard
                browser local storage to maintain your authentication state,
                remember workspace configurations, and protect application
                workflows against CSRF attacks. Third-party identity providers
                (Google/GitHub) may also set necessary cookies during login
                handshakes.
              </p>
              <p>
                You may disable or block cookies through your browser
                preferences; however, doing so will degrade or prevent the
                platform’s ability to authenticate your account and persist
                project modifications.
              </p>
            </PolicySection>

            {/* Section 15 */}
            <PolicySection
              id="children"
              title="15. Children"
              subtitle="Developer age limitations and safeguarding procedures"
            >
              <p>
                SurforaAI is a developer-focused software engineering
                environment and is not intended for or directed toward children.
                We do not knowingly collect personal information from
                individuals under the age of 16 (or applicable regional age
                limit). If you believe a minor has created an account, notify us
                immediately so we can promptly delete the relevant records.
              </p>
            </PolicySection>

            {/* Section 16 */}
            <PolicySection
              id="changes"
              title="16. Changes to this policy"
              subtitle="Version histories and modification alerts"
            >
              <p>
                We may periodically update this policy to reflect updates in our
                platform capabilities, newer AI models, subprocessor
                configurations, or statutory regulatory standards. The updated
                date at the top of this document will reflect any revision.
                Material changes will be accompanied by direct dashboard
                notifications or email notices.
              </p>
            </PolicySection>

            {/* Section 17 */}
            <PolicySection
              id="contact"
              title="17. Contact and privacy requests"
              subtitle="Direct channels for data inquiries and legal notices"
            >
              <p>
                For privacy inquiries, rights enforcement requests, or
                compliance documentation, reach out to our legal officer:
              </p>

              <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/20 to-zinc-900/60 p-5 sm:p-6 backdrop-blur">
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-violet-400">
                      Designated Entity
                    </span>
                    <p className="text-base font-semibold text-white mt-0.5">
                      {OPERATOR_NAME ||
                        "SurforaAI Operator (Legal entity name pending configuration)"}
                    </p>
                  </div>

                  {OPERATOR_ADDRESS && (
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                        Postal Address
                      </span>
                      <p className="text-xs sm:text-sm text-zinc-300 whitespace-pre-line mt-0.5">
                        {OPERATOR_ADDRESS}
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                      Privacy Email Address
                    </span>
                    {PRIVACY_EMAIL ? (
                      <p className="mt-0.5">
                        <a
                          href={`mailto:${PRIVACY_EMAIL}`}
                          className="text-sm font-medium text-violet-300 underline decoration-violet-400/40 underline-offset-4 hover:text-violet-200"
                        >
                          {PRIVACY_EMAIL}
                        </a>
                      </p>
                    ) : (
                      <p className="text-xs text-amber-300/80 mt-0.5">
                        Note: NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL is currently not
                        configured in environment variables.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                Please provide sufficient context in your request so our desk
                can identify your account securely. Do not include credit card
                numbers, passwords, or confidential private keys in email
                transmissions.
              </p>
            </PolicySection>

            {/* Footer notice */}
            <div className="pt-2 text-xs text-zinc-600 leading-relaxed border-t border-white/[0.06]">
              This policy describes SurforaAI’s data practices and should be
              kept aligned with production configurations, subprocessor data
              processing agreements, and statutory compliance frameworks.
            </div>
          </article>
        </div>

        {/* Global Footer */}
        <footer className="mt-16 sm:mt-24 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] pt-8 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-300">SurforaAI</span>
            <span>·</span>
            <span>Interface Engineering Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection("who-we-are")}
              className="hover:text-zinc-300 transition"
            >
              Top of Policy
            </button>
            <span>·</span>
            <span>Effective {effectiveDate}</span>
          </div>
        </footer>
      </div>

      {/* Floating Bottom Navigation for Mobile & Quick Actions */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        {/* Back to top button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            type="button"
            aria-label="Back to top"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.12] bg-[#121218]/90 text-zinc-300 shadow-xl backdrop-blur-md hover:bg-white/[0.1] hover:text-white transition active:scale-95"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}

        {/* Floating section index pill for quick jump on mobile */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          type="button"
          className="lg:hidden flex items-center gap-2 rounded-full border border-violet-500/30 bg-[#121218]/95 px-4 py-2.5 text-xs font-medium text-zinc-200 shadow-2xl backdrop-blur-md hover:border-violet-500/60 active:scale-95 transition"
        >
          <span className="flex h-2 w-2 rounded-full bg-violet-400" />
          <span className="truncate max-w-[140px] font-medium text-white">
            {currentSectionMeta ? currentSectionMeta[1] : "Jump"}
          </span>
          <span className="text-[10px] text-violet-300 bg-violet-500/20 px-1.5 py-0.5 rounded">
            {currentSectionIndex}/17
          </span>
        </button>
      </div>

      {/* Mobile Table of Contents Modal Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer sheet */}
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl border-t border-white/[0.12] bg-[#0c0c11] p-5 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-violet-400" />
                <h3 className="text-sm font-semibold text-white">
                  Table of Contents
                </h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                type="button"
                className="rounded-full p-1 text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick search inside mobile drawer */}
            <div className="my-3 relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="Search section titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto space-y-1.5 pr-1 py-1 flex-1 scrollbar-thin">
              {filteredSections.map(([id, title, desc]) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`w-full text-left rounded-xl p-3 text-xs transition flex items-start justify-between ${
                      isActive
                        ? "bg-violet-600/20 text-violet-200 border border-violet-500/40"
                        : "text-zinc-300 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-white">{title}</p>
                      {desc && (
                        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                          {desc}
                        </p>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-[10px] text-violet-300 font-mono font-bold shrink-0 ml-2">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500">
              <span>{filteredSections.length} sections found</span>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  scrollToTop();
                }}
                className="text-violet-400 font-medium"
              >
                Scroll to Top
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
