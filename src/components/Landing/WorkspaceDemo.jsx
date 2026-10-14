import React, { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  FileCode2,
  Globe,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const INITIAL_PROMPT =
  "Create a premium editorial analytics dashboard for a financial intelligence product. Strong data hierarchy, contextual charts, elegant spacing, and responsive interactions.";

const REWORK_PROMPT =
  "Refine the interface: make the hierarchy denser, add a network health panel, and give the dashboard a stronger executive feel.";

const INITIAL_RESPONSE =
  "Built an editorial capital velocity interface with dominant liquidity indices, an SVG velocity curve, and live settlement corridor telemetry.";

const REWORK_RESPONSE =
  "Refined the interface with denser executive hierarchy, a 14-node resilience matrix, and real-time corridor settlement telemetry.";

const PROJECTS = [
  { name: "Capital Velocity", kind: "react" },
  { name: "SaaS Billing Engine", kind: "web" },
];

const INITIAL_CODE = [
  'import { EditorialMasthead, VelocityCurve } from "./intelligence";',
  'import { SettlementCorridors } from "./telemetry";',
  "",
  "export default function CapitalVelocityPage() {",
  "  return (",
  '    <main className="min-h-full bg-[#060608] text-white">',
  '      <EditorialMasthead index="$68.42B" delta="+38.4%" />',
  '      <VelocityCurve resolution="high" interval="24h" />',
  '      <SettlementCorridors pairs={["NY-LON", "SGP-HK", "FRA-TYO"]} />',
  "    </main>",
  "  );",
  "}",
];

const REWORK_CODE = [
  'import { EditorialMasthead, VelocityCurve } from "./intelligence";',
  'import { NetworkResilienceMatrix } from "./telemetry";',
  "",
  "export default function CapitalVelocityPage() {",
  "  return (",
  '    <main className="min-h-full bg-[#060608] text-white dense">',
  '      <EditorialMasthead index="$68.42B" delta="+38.4%" executive />',
  '      <VelocityCurve resolution="high" interval="24h" />',
  "      <NetworkResilienceMatrix nodes={14} latency={18} sync />",
  "    </main>",
  "  );",
  "}",
];

// Playback timeline in milliseconds.
// Preview compilation starts only when the code streaming commences.
const DESKTOP_T = {
  firstType: [300, 2300],
  firstSend: 2300,
  firstThink: [2350, 3550],
  firstRespond: [3550, 5200],
  firstCode: [4900, 7200],
  firstPreview: [5200, 7800],

  reworkType: [12600, 14600],
  reworkSend: 14600,
  reworkThink: [14650, 15800],
  reworkRespond: [15800, 17400],
  reworkCode: [16900, 19200],
  reworkPreview: [17200, 19800],

  loop: 25600,
};

const MOBILE_T = {
  firstType: [300, 2300],
  firstSend: 2300,
  firstThink: [2350, 3500],
  firstRespond: [3500, 5000],
  firstCode: [4800, 6800],
  firstPreview: [7000, 9200],
  firstPreviewClose: 13600,

  reworkType: [14200, 16200],
  reworkSend: 16200,
  reworkThink: [16250, 17400],
  reworkRespond: [17400, 19000],
  reworkCode: [18600, 20800],
  reworkPreview: [21000, 23200],

  loop: 27600,
};

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const ease = (value) => 1 - Math.pow(1 - clamp01(value), 3);
const progress = (elapsed, [start, end]) =>
  clamp01((elapsed - start) / Math.max(1, end - start));

function getTypedText(fullText, elapsed, [start, end]) {
  if (elapsed < start) return "";
  if (elapsed >= end) return fullText;
  const t = (elapsed - start) / (end - start);
  const eased = Math.min(1, Math.max(0, Math.pow(t, 1.2)));
  return fullText.slice(0, Math.floor(fullText.length * eased));
}

function useTimeline(enabled, loop) {
  const [elapsed, setElapsed] = useState(0);
  const lastFrame = useRef(null);

  useEffect(() => {
    if (!enabled) {
      lastFrame.current = null;
      return;
    }

    let frame;
    const tick = (now) => {
      if (lastFrame.current !== null) {
        const delta = Math.min(now - lastFrame.current, 100);
        setElapsed((prev) => (prev + delta) % loop);
      }
      lastFrame.current = now;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      lastFrame.current = null;
    };
  }, [enabled, loop]);

  return elapsed;
}

function JsxIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        stroke="#818cf8"
        strokeWidth="1.5"
        transform="rotate(30 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        stroke="#818cf8"
        strokeWidth="1.5"
        transform="rotate(90 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        stroke="#818cf8"
        strokeWidth="1.5"
        transform="rotate(150 12 12)"
      />
      <circle cx="12" cy="12" r="1.8" fill="#c084fc" />
    </svg>
  );
}

function CssIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 3L6 19L12 21L18 19L20 3H4Z"
        stroke="#38bdf8"
        strokeWidth="1.5"
      />
      <path d="M12 6V18.5L16.5 17L18 7H12Z" fill="#38bdf8" fillOpacity="0.25" />
    </svg>
  );
}

function BrowserBar() {
  return (
    <div
      aria-label="Browser chrome"
      className="relative flex h-8 shrink-0 items-center border-b border-white/[0.07] bg-backgroundLight px-3 sm:h-11 sm:px-4"
    >
      <div aria-hidden="true" className="flex items-center gap-1.5 opacity-60">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80 sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]/80 sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]/80 sm:h-2.5 sm:w-2.5" />
      </div>

      <div className="absolute left-1/2 flex h-5 w-[min(52%,300px)] -translate-x-1/2 items-center justify-center rounded-md border border-white/[0.06] bg-[#0c0b11] px-2.5 text-[8.5px] font-medium text-white/50 sm:h-6 sm:w-[min(38%,320px)] sm:text-[9.5px]">
        <span className="truncate">
          surforaai.com/workspace/capital-velocity
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-medium text-emerald-300 sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Runtime Ready
        </span>
      </div>
    </div>
  );
}

function ProjectRow({ name, active, kind = "react" }) {
  return (
    <motion.div
      animate={{
        backgroundColor: active
          ? "rgba(139,92,246,0.08)"
          : "rgba(255,255,255,0)",
        borderColor: active
          ? "rgba(139,92,246,0.22)"
          : "rgba(255,255,255,0.03)",
      }}
      transition={{ duration: 0.3 }}
      className="flex min-w-0 items-center gap-2.5 rounded-lg border px-2.5 py-2"
    >
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-white/[0.04]">
        {kind === "web" ? (
          <Globe size={11} className="text-sky-400" />
        ) : (
          <JsxIcon />
        )}
      </span>
      <span
        className={`min-w-0 truncate text-[11px] ${
          active ? "font-medium text-white" : "text-white/60"
        }`}
      >
        {name}
      </span>
    </motion.div>
  );
}

function Sidebar({ active }) {
  return (
    <aside className="hidden w-[205px] shrink-0 border-r border-white/[0.06] bg-backgroundLight lg:block">
      <div className="border-b border-white/[0.06] p-3">
        <button
          type="button"
          className="flex h-9 w-full items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-left text-[11px] font-medium text-white/80 transition hover:border-violet-400/30 hover:bg-violet-400/[0.05]"
        >
          <span className="grid h-5 w-5 place-items-center rounded-md bg-white/[0.04] text-white/70">
            <Plus size={12} strokeWidth={2} />
          </span>
          <span className="flex-1">New Interface</span>
          <span className="text-[9px] text-white/30">⌘ K</span>
        </button>
      </div>

      <div className="px-3 pt-4">
        <div className="mb-2 px-1 text-[9px] font-medium uppercase tracking-[0.16em] text-white/35">
          Workspace Projects
        </div>
        <div className="space-y-1">
          {PROJECTS.map((project) => (
            <ProjectRow
              key={project.name}
              name={project.name}
              kind={project.kind}
              active={project.name === "Capital Velocity" && active}
            />
          ))}
          <ProjectRow name="Yield Curve Analysis" kind="react" active={false} />
        </div>
      </div>
    </aside>
  );
}

function EditorTabs() {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-b border-white/[0.06] bg-backgroundLight px-3 sm:h-10 sm:px-4">
      <div className="flex h-full items-center gap-1">
        <div className="flex h-full items-center gap-1.5 border-b-2 border-violet-400 px-3 text-[10px] font-medium text-white">
          <JsxIcon />
          <span>Dashboard.jsx</span>
        </div>
        <div className="flex h-full items-center gap-1.5 px-3 text-[10px] font-medium text-white/45 transition hover:text-white/70">
          <CssIcon />
          <span>styles.css</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-2.5 py-0.5 text-[9px] font-medium text-violet-200">
        <Sparkles size={10} className="text-violet-300" />
        <span>Surfora AI Runtime</span>
      </div>
    </div>
  );
}

function ModelBar({ active, label = "Generating" }) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-2 border-b border-white/[0.05] bg-backgroundLight px-3 text-[9.5px] sm:h-9 sm:px-4 sm:text-[10px]">
      <span className="font-medium text-white/90">GPT-6 Sol</span>
      <span className="text-white/20">/</span>
      <span className="text-violet-300/80">Extended Reasoning</span>
      <ChevronDown size={10} className="text-white/30" />
      {active ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-auto inline-flex items-center gap-1.5 text-violet-300/80 font-medium"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          {label}…
        </motion.span>
      ) : null}
    </div>
  );
}

function UserBubble({ text, visible }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="ml-auto w-[min(90%,44rem)] pb-1"
    >
      <div className="mb-1 text-right text-[8.5px] font-medium uppercase tracking-wider text-white/30">
        You
      </div>
      <div className="rounded-2xl rounded-tr-sm border-0 bg-violet-600/60 p-4 text-[11.5px] leading-relaxed text-white/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] sm:p-4.5 sm:text-[12px]">
        {text}
      </div>
    </motion.div>
  );
}

function ThinkingState({ text, visible }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 py-1 text-white/45"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
      <span className="text-[10px] font-medium">{text}…</span>
    </motion.div>
  );
}

function AssistantMessage({ text, visible, streamProgress, rework = false }) {
  if (!visible) return null;

  const chars = Math.floor(text.length * ease(streamProgress));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[94%]"
    >
      <div className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-wider text-white/40">
        <span className="font-semibold text-violet-300">SurforaAI</span>
        <span className="h-2.5 w-px bg-white/10" />
        <span>GPT-6 Sol X-High</span>
        {rework ? (
          <span className="rounded border border-violet-400/30 bg-violet-400/[0.1] px-1.5 py-0.5 text-[8px] font-medium text-violet-200">
            Refinement
          </span>
        ) : null}
      </div>
      <p className="text-[12px] leading-relaxed text-white/85 sm:text-[12.5px]">
        {text.slice(0, chars)}
        {streamProgress < 1 ? (
          <span className="ml-0.5 inline-block h-3 w-0.5 bg-violet-400 animate-pulse" />
        ) : null}
      </p>
    </motion.div>
  );
}

function highlightCode(line) {
  const pattern =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:import|from|export|default|function|return|const)\b)|(\b(?:EditorialMasthead|VelocityCurve|SettlementCorridors|NetworkResilienceMatrix|CapitalVelocityPage)\b)|(\b(?:index|delta|resolution|interval|pairs|dense|nodes|latency|sync|executive)\b)|(\b\d+%?\b)|([{}()[\].,;=<>/+])/g;
  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(
        <span key={lastIndex} className="text-slate-300">
          {line.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const color = match[1]
      ? "text-emerald-300"
      : match[2]
        ? "text-violet-300 font-medium"
        : match[3]
          ? "text-cyan-300"
          : match[4]
            ? "text-amber-300"
            : match[5]
              ? "text-orange-300"
              : "text-slate-400";

    tokens.push(
      <span key={match.index} className={color}>
        {match[0]}
      </span>,
    );
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push(
      <span key={lastIndex} className="text-slate-300">
        {line.slice(lastIndex)}
      </span>,
    );
  }

  return tokens;
}

function CodePanel({ lines, visible, streamProgress, rework = false }) {
  if (!visible) return null;

  const count = Math.max(
    2,
    Math.min(lines.length, Math.ceil(streamProgress * lines.length)),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-white/[0.08] bg-darkBorder/20"
    >
      <div className="flex h-8 items-center justify-between border-b border-white/[0.06] bg-[#09080e] px-3">
        <div className="flex items-center gap-1.5">
          <FileCode2 size={11} className="text-violet-400" />
          <span className="text-[8.5px] font-medium text-white/60">
            {rework ? "Dashboard.rework.jsx" : "Dashboard.jsx"}
          </span>
        </div>
        <span className="rounded border border-violet-400/20 bg-violet-400/[0.08] px-1.5 py-0.5 text-[7.5px] font-medium text-violet-300">
          {streamProgress >= 0.98 ? "Ready" : "Generating…"}
        </span>
      </div>

      <div className="max-h-[175px] overflow-hidden p-3 font-mono text-[8px] leading-[1.8] sm:max-h-[220px] sm:text-[8.5px]">
        {lines.slice(0, count).map((line, index) => (
          <div key={`${index}-${line}`} className="whitespace-pre">
            <span className="mr-3 inline-block w-3.5 text-right text-white/20">
              {index + 1}
            </span>
            {line ? highlightCode(line) : " "}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Composer({ elapsed, compact = false, timeline = DESKTOP_T }) {
  const firstTyping =
    elapsed >= timeline.firstType[0] && elapsed < timeline.firstSend;
  const reworkTyping =
    elapsed >= timeline.reworkType[0] && elapsed < timeline.reworkSend;

  const sending =
    (elapsed >= timeline.firstSend && elapsed < timeline.firstSend + 150) ||
    (elapsed >= timeline.reworkSend && elapsed < timeline.reworkSend + 150);

  const text = firstTyping
    ? getTypedText(INITIAL_PROMPT, elapsed, timeline.firstType)
    : reworkTyping
      ? getTypedText(REWORK_PROMPT, elapsed, timeline.reworkType)
      : "";

  return (
    <div
      className={`rounded-2xl border border-white/[0.09] bg-[#0d0c10] ${
        compact ? "p-2 sm:p-2.5" : "p-3 sm:p-3.5"
      }`}
    >
      <div
        className={`min-h-[44px] px-1.5 text-[11px] leading-relaxed text-white/85 sm:min-h-[48px] sm:text-[11.5px] ${
          compact ? "min-h-[40px] text-[10px]" : ""
        }`}
      >
        {text ? (
          <>
            {text}
            {!sending ? (
              <span className="ml-0.5 inline-block h-3 w-0.5 translate-y-[1px] bg-violet-400 animate-pulse" />
            ) : null}
          </>
        ) : (
          <span className="select-none text-white/30">
            Describe an interface, design system, or workflow...
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.05] pt-2">
        <div className="flex items-center gap-1.5 text-[8.5px] text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          <span>Interactive Synthesis</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Search models"
            className="grid h-6 w-6 place-items-center rounded-md text-white/40 transition hover:bg-white/[0.05] hover:text-white"
          >
            <Search size={11} />
          </button>
          <motion.button
            type="button"
            aria-label="Send prompt"
            animate={{
              scale: sending ? [1, 0.92, 1] : 1,
              backgroundColor: sending ? "#7c3aed" : "#6d28d9",
            }}
            transition={{ duration: 0.25 }}
            className="grid h-7 w-7 place-items-center rounded-lg text-white shadow-[0_0_12px_rgba(109,40,217,0.4)]"
          >
            <ArrowUp size={12} strokeWidth={2.2} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function CenterConversation({ elapsed, timeline = DESKTOP_T }) {
  const conversationRef = useRef(null);

  useEffect(() => {
    const node = conversationRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [elapsed]);

  const initialPrompt = elapsed >= timeline.firstSend;
  const initialThinking =
    elapsed >= timeline.firstThink[0] && elapsed < timeline.firstThink[1];
  const initialResponse = elapsed >= timeline.firstRespond[0];
  const initialCode = elapsed >= timeline.firstCode[0];

  const reworkPrompt = elapsed >= timeline.reworkSend;
  const reworkThinking =
    elapsed >= timeline.reworkThink[0] && elapsed < timeline.reworkThink[1];
  const reworkResponse = elapsed >= timeline.reworkRespond[0];
  const reworkCode = elapsed >= timeline.reworkCode[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-backgroundDark">
      <div
        ref={conversationRef}
        className="workspace-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6"
      >
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5 pb-4">
          <div className="space-y-6">
            <UserBubble text={INITIAL_PROMPT} visible={initialPrompt} />
            <ThinkingState
              text="Reviewing interface requirements"
              visible={initialThinking}
            />
            <AssistantMessage
              text={INITIAL_RESPONSE}
              visible={initialResponse}
              streamProgress={progress(elapsed, timeline.firstRespond)}
            />
            <CodePanel
              lines={INITIAL_CODE}
              visible={initialCode}
              streamProgress={progress(elapsed, timeline.firstCode)}
            />
          </div>

          <AnimatePresence initial={false}>
            {reworkPrompt ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <UserBubble text={REWORK_PROMPT} visible />
                <ThinkingState
                  text="Structuring denser hierarchy & telemetry"
                  visible={reworkThinking}
                />
                <AssistantMessage
                  text={REWORK_RESPONSE}
                  visible={reworkResponse}
                  streamProgress={progress(elapsed, timeline.reworkRespond)}
                  rework
                />
                <CodePanel
                  lines={REWORK_CODE}
                  visible={reworkCode}
                  streamProgress={progress(elapsed, timeline.reworkCode)}
                  rework
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Clean Structural Skeleton Loader with 1px top hairline progress
function StructuralSkeletonLoader({ progress: val, rework = false }) {
  const percent = Math.round(val * 100);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#07060a] p-4 sm:p-5 text-white">
      {/* 1px Hairline Progress Bar across the top */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-white/[0.04]">
        <motion.div
          style={{ width: `${percent}%` }}
          className="h-full bg-gradient-to-r from-violet-500 via-violet-300 to-emerald-400 transition-all duration-150"
        />
      </div>

      {/* Structural Wireframe Placeholder */}
      <div className="flex flex-1 flex-col justify-between pt-2 animate-pulse opacity-40">
        <div>
          {/* Header row skeleton */}
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-white/15" />
              <div className="h-3 w-28 rounded bg-white/10" />
            </div>
            <div className="h-4 w-20 rounded-full bg-white/10" />
          </div>

          {/* Metric skeleton */}
          <div className="mt-4 space-y-2">
            <div className="h-2.5 w-32 rounded bg-white/10" />
            <div className="h-8 w-44 rounded bg-white/15" />
            <div className="h-2 w-56 rounded bg-white/[0.07]" />
          </div>

          {/* Chart area skeleton */}
          <div className="mt-4 h-24 w-full rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
            <div className="flex justify-between">
              <div className="h-2 w-20 rounded bg-white/10" />
              <div className="h-2 w-16 rounded bg-white/10" />
            </div>
            <div className="mt-6 h-10 w-full border-b border-dashed border-white/10" />
          </div>

          {/* Rows skeleton */}
          <div className="mt-4 space-y-2">
            <div className="h-6 w-full rounded-lg bg-white/[0.02]" />
            <div className="h-6 w-full rounded-lg bg-white/[0.02]" />
          </div>
        </div>

        {/* Minimal compile readout */}
        <div className="flex items-center justify-between border-t border-white/[0.05] pt-3 text-[8.5px] text-white/40">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span>
              {rework ? "Applying refinements…" : "Compiling layout…"}
            </span>
          </div>
          <span className="font-mono text-white/50">{percent}%</span>
        </div>
      </div>
    </div>
  );
}

// Bespoke Editorial Analytics & Capital Velocity Preview
function CapitalVelocityPreview({ reworked = false }) {
  const [activeTimeframe, setActiveTimeframe] = useState("24H");
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="h-full overflow-y-auto bg-[#07060a] text-white [scrollbar-width:thin] [scrollbar-color:#2a2536_transparent]">
      <div className="relative min-h-full p-4 sm:p-5">
        {/* Subtle top ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-3xl"
        />

        {/* Masthead */}
        <header className="relative z-10 flex items-center justify-between border-b border-white/[0.07] pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md border border-violet-400/30 bg-violet-400/[0.1] text-[9px] font-semibold text-violet-300">
              V
            </span>
            <div>
              <div className="text-[9.5px] font-semibold tracking-tight text-white/95">
                CAPITAL VELOCITY
              </div>
              <div className="text-[7px] tracking-wider uppercase text-white/35">
                Liquidity Intelligence
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[7.5px] font-medium text-emerald-300">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              SETTLEMENT ACTIVE
            </span>
          </div>
        </header>

        {/* Primary Editorial Metric Display */}
        <div className="relative z-10 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-medium uppercase tracking-[0.18em] text-white/40">
              Aggregate Liquidity Index
            </span>
            <div className="flex gap-1 text-[8px]">
              {["1H", "24H", "7D", "30D"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTimeframe(tab)}
                  className={`rounded px-1.5 py-0.5 transition ${
                    activeTimeframe === tab
                      ? "bg-violet-400/20 text-violet-200 font-medium"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-3">
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
              $68.42B
            </h2>
            <div className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-0.5 text-[9px] font-semibold text-emerald-300">
              <TrendingUp size={10} />
              <span>+38.4%</span>
            </div>
          </div>

          <p className="mt-1 text-[8.5px] leading-relaxed text-white/50">
            Global cross-currency routing volume with sub-20ms settlement across
            14 clearing corridors.
          </p>
        </div>

        {/* SVG Fluid Velocity Ribbon */}
        <div className="relative z-10 mt-3 rounded-xl border border-white/[0.07] bg-[#09080e]/90 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
          <div className="flex items-center justify-between text-[7.5px] text-white/40">
            <span>VELOCITY CORRIDOR FLUX</span>
            <span className="font-mono text-emerald-300">Peak: $4.82B / s</span>
          </div>

          <div className="relative mt-2 h-20 w-full">
            <svg
              viewBox="0 0 400 100"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid guide */}
              <line
                x1="0"
                y1="25"
                x2="400"
                y2="25"
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="2 4"
              />
              <line
                x1="0"
                y1="60"
                x2="400"
                y2="60"
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="2 4"
              />

              {/* Gradient area */}
              <path
                d="M 0 80 C 60 85, 110 50, 160 55 C 210 60, 260 20, 310 25 C 360 30, 380 15, 400 18 L 400 100 L 0 100 Z"
                fill="url(#curveGradient)"
              />

              {/* Primary stroke line */}
              <path
                d="M 0 80 C 60 85, 110 50, 160 55 C 210 60, 260 20, 310 25 C 360 30, 380 15, 400 18"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2.2"
              />

              {/* Active data beacon */}
              <circle cx="310" cy="25" r="3.5" fill="#34d399" />
              <circle
                cx="310"
                cy="25"
                r="7"
                fill="none"
                stroke="#34d399"
                strokeWidth="1"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* Live Corridors Stream */}
        <div className="relative z-10 mt-3.5 space-y-2">
          <div className="flex items-center justify-between text-[8px] font-medium tracking-wider uppercase text-white/35">
            <span>Settlement Corridors</span>
            <span>Latency</span>
          </div>

          {[
            {
              pair: "NY-LON Corridor",
              vol: "$24.8B",
              lat: "12ms",
              health: "Optimal",
            },
            {
              pair: "SGP-HK Corridor",
              vol: "$18.4B",
              lat: "16ms",
              health: "Optimal",
            },
            {
              pair: "FRA-TYO Corridor",
              vol: "$14.2B",
              lat: "19ms",
              health: "Balanced",
            },
          ].map((item) => (
            <div
              key={item.pair}
              className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.015] px-2.5 py-1.5 text-[8.5px] transition hover:border-violet-400/20"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-medium text-white/90">{item.pair}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/50">{item.vol}</span>
                <span className="font-mono text-emerald-300/80">
                  {item.lat}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Reworked Dynamic Panel: Network Health & Resilience */}
        {reworked ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mt-4 rounded-xl border border-violet-400/30 bg-violet-950/[0.25] p-3 shadow-[0_0_24px_rgba(139,92,246,0.15)]"
          >
            <div className="flex items-center justify-between border-b border-violet-400/15 pb-2">
              <div className="flex items-center gap-1.5 text-[8.5px] font-medium text-violet-200">
                <ShieldCheck size={12} className="text-violet-300" />
                <span>Executive Network Resilience</span>
              </div>
              <span className="rounded bg-emerald-400/10 px-1.5 py-0.2 text-[7px] font-semibold text-emerald-300">
                14/14 NODES ACTIVE
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2 text-[8px]">
              <div className="rounded-md border border-white/[0.05] bg-black/30 p-2">
                <span className="text-white/40 block">AVERAGE LATENCY</span>
                <span className="font-mono text-sm font-semibold text-white">
                  18.2ms
                </span>
                <span className="text-emerald-400 text-[7px]">
                  ▼ -4.1ms routing optimization
                </span>
              </div>

              <div className="rounded-md border border-white/[0.05] bg-black/30 p-2">
                <span className="text-white/40 block">CLEARING PROTOCOL</span>
                <span className="font-mono text-xs font-semibold text-violet-200">
                  ISO 20022
                </span>
                <span className="text-white/40 text-[7px]">
                  Synchronous settlement
                </span>
              </div>
            </div>

            {/* 14-Node Topology Indicators */}
            <div className="mt-2.5 flex items-center justify-between gap-1 pt-1">
              {[...Array(14)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedNode(i)}
                  className={`h-2 flex-1 rounded-sm transition ${
                    selectedNode === i
                      ? "bg-emerald-300 scale-110 shadow-[0_0_6px_#34d399]"
                      : "bg-emerald-500/40 hover:bg-emerald-400"
                  }`}
                  title={`Node ${i + 1}: Healthy`}
                />
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

function PreviewPlaceholder() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-backgroundLight p-6 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.05] blur-2xl" />

      <div className="relative flex flex-col items-center text-center">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
          <Play size={14} className="text-white/40 ml-0.5" />
        </div>
        <div className="mt-4 text-[11px] font-medium text-white/60">
          Interface Canvas Ready
        </div>
        <div className="mt-1 text-[8px] uppercase tracking-wider text-white/30">
          Waiting for prompt
        </div>
      </div>
    </div>
  );
}

function PreviewContent({ elapsed, timeline, mobile = false }) {
  const initialBuilding =
    elapsed >= timeline.firstPreview[0] && elapsed < timeline.firstPreview[1];
  const initialReady =
    elapsed >= timeline.firstPreview[1] && elapsed < timeline.reworkPreview[0];
  const reworkBuilding =
    elapsed >= timeline.reworkPreview[0] && elapsed < timeline.reworkPreview[1];
  const reworked = elapsed >= timeline.reworkPreview[1];

  const baseMode = reworked
    ? "reworked"
    : initialReady || reworkBuilding
      ? "initial"
      : "placeholder";

  const building = initialBuilding || reworkBuilding;

  return (
    <section
      aria-label="Live preview"
      className={
        mobile
          ? "flex h-full flex-col overflow-hidden bg-[#07060a]"
          : "flex h-[320px] min-w-0 flex-col border-t border-white/[0.06] bg-[#07060a] sm:h-[370px] lg:h-auto lg:w-[32%] lg:shrink-0 lg:border-l lg:border-t-0"
      }
    >
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-white/[0.06] bg-backgroundLight px-3.5 sm:h-10 sm:px-4">
        <div className="flex items-center gap-2 text-[10px] font-medium text-white/70">
          <Play size={10} fill="currentColor" className="text-emerald-400" />
          <span>Live Interface</span>
        </div>
        <span className="rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[7.5px] uppercase tracking-wider text-white/50">
          {reworkBuilding
            ? "Refining"
            : initialBuilding
              ? "Compiling"
              : reworked
                ? "Dense Executive"
                : initialReady
                  ? "Live v1.0"
                  : "Idle"}
        </span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          {baseMode === "placeholder" ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <PreviewPlaceholder />
            </motion.div>
          ) : null}

          {baseMode === "initial" ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <CapitalVelocityPreview />
            </motion.div>
          ) : null}

          {baseMode === "reworked" ? (
            <motion.div
              key="reworked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <CapitalVelocityPreview reworked />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence initial={false} mode="sync">
          {building ? (
            <motion.div
              key={reworkBuilding ? "rework-builder" : "initial-builder"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-10"
            >
              <StructuralSkeletonLoader
                progress={progress(
                  elapsed,
                  reworkBuilding
                    ? timeline.reworkPreview
                    : timeline.firstPreview,
                )}
                rework={reworkBuilding}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex h-7 shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#07060a] px-3.5 text-[8px] sm:px-4 text-white/40">
        <span>
          {initialBuilding
            ? "Compiling interface…"
            : reworkBuilding
              ? "Applying layout refinements…"
              : reworked
                ? "Live preview updated"
                : initialReady
                  ? "Ready for inspection"
                  : "Waiting for instructions"}
        </span>
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>
    </section>
  );
}

function DesktopWorkspace({ elapsed }) {
  const isLoopEnding = elapsed >= DESKTOP_T.loop - 700;
  const loopOpacity = isLoopEnding
    ? 1 - (elapsed - (DESKTOP_T.loop - 700)) / 700
    : 1;

  const thinking =
    (elapsed >= DESKTOP_T.firstThink[0] && elapsed < DESKTOP_T.firstThink[1]) ||
    (elapsed >= DESKTOP_T.reworkThink[0] && elapsed < DESKTOP_T.reworkThink[1]);

  const reworkActive =
    elapsed >= DESKTOP_T.reworkSend && elapsed < DESKTOP_T.reworkPreview[1];

  return (
    <div
      style={{ opacity: Math.max(0.04, loopOpacity) }}
      className="hidden transition-opacity duration-300 lg:block"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#07060a] shadow-[0_20px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.06)]">
        <BrowserBar />
        <div className="flex lg:h-[720px] lg:flex-row">
          <Sidebar active={elapsed >= DESKTOP_T.firstSend} />

          <section className="flex min-w-0 flex-1 flex-col bg-[#07060a]">
            <EditorTabs />
            <ModelBar
              active={thinking}
              label={reworkActive ? "Refining" : "Synthesizing"}
            />
            <CenterConversation elapsed={elapsed} timeline={DESKTOP_T} />
            <div className="bg-backgroundDark p-3 sm:p-4 border-0">
              <div className="mx-auto max-w-[720px]">
                <Composer elapsed={elapsed} timeline={DESKTOP_T} />
              </div>
            </div>
          </section>

          <PreviewContent elapsed={elapsed} timeline={DESKTOP_T} />
        </div>
      </div>
    </div>
  );
}

function MobileWorkspace({ elapsed }) {
  const isLoopEnding = elapsed >= MOBILE_T.loop - 700;
  const loopOpacity = isLoopEnding
    ? 1 - (elapsed - (MOBILE_T.loop - 700)) / 700
    : 1;

  const thinking =
    (elapsed >= MOBILE_T.firstThink[0] && elapsed < MOBILE_T.firstThink[1]) ||
    (elapsed >= MOBILE_T.reworkThink[0] && elapsed < MOBILE_T.reworkThink[1]);

  const previewVisit =
    elapsed >= MOBILE_T.firstPreview[0] && elapsed < MOBILE_T.firstPreviewClose
      ? "initial"
      : elapsed >= MOBILE_T.reworkPreview[0]
        ? "rework"
        : null;

  return (
    <div
      style={{ opacity: Math.max(0.04, loopOpacity) }}
      className="block transition-opacity duration-300 lg:hidden"
    >
      <div className="overflow-hidden rounded-xl border border-white/[0.09] bg-[#07060a]">
        <BrowserBar />
        <div className="relative overflow-hidden">
          <EditorTabs />
          <ModelBar
            active={thinking}
            label={elapsed >= MOBILE_T.reworkSend ? "Refining" : "Synthesizing"}
          />
          <div className="flex h-[360px] flex-col">
            <CenterConversation elapsed={elapsed} timeline={MOBILE_T} />
          </div>
          <div className="bg-[#07060a] p-2 sm:p-3 border-t border-white/[0.05]">
            <Composer elapsed={elapsed} compact timeline={MOBILE_T} />
          </div>

          <AnimatePresence initial={false} mode="sync">
            {previewVisit ? (
              <motion.div
                key={previewVisit}
                initial={{ x: "100%", opacity: 0.98 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.98 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 z-10 bg-[#07060a]"
              >
                <PreviewContent elapsed={elapsed} timeline={MOBILE_T} mobile />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function WorkspaceDemo() {
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(true);

  const desktopClock = useTimeline(playing && !reducedMotion, DESKTOP_T.loop);
  const mobileClock = useTimeline(playing && !reducedMotion, MOBILE_T.loop);

  const desktopElapsed = reducedMotion
    ? DESKTOP_T.reworkPreview[1] + 1000
    : desktopClock;
  const mobileElapsed = reducedMotion
    ? MOBILE_T.reworkPreview[1] + 1000
    : mobileClock;

  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-4 text-white sm:px-6 lg:px-8">
      {/* Background ambient lighting */}

      <div className="relative mx-auto max-w-7xl">
        <div className="relative isolate mx-auto mt-10 max-w-[1240px] sm:mt-12">
          <DesktopWorkspace elapsed={desktopElapsed} />
          <MobileWorkspace elapsed={mobileElapsed} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {!reducedMotion ? (
            <button
              type="button"
              onClick={() => setPlaying((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium text-white/80 transition hover:bg-white/[0.06] hover:text-white"
            >
              {playing ? (
                <>
                  <span className="text-violet-300">❚❚</span>
                  <span>Pause playback</span>
                </>
              ) : (
                <>
                  <Play
                    size={11}
                    fill="currentColor"
                    className="text-violet-300"
                  />
                  <span>Resume playback</span>
                </>
              )}
            </button>
          ) : null}

          <span className="text-[10px] text-white/40">
            Continuous loop · Prompt → Code → Live Preview → Refine
          </span>
        </div>
      </div>
    </section>
  );
}
