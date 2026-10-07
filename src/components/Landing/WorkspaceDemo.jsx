import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  FileCode2,
  Hammer,
  Play,
  Plus,
  Search,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const INITIAL_PROMPT =
  "Create a premium editorial analytics dashboard for a financial intelligence product. Strong data hierarchy, contextual charts, elegant spacing, and responsive interactions.";

const REWORK_PROMPT =
  "Refine the interface: make the hierarchy denser, add a network health panel, and give the dashboard a stronger executive feel.";

const INITIAL_RESPONSE =
  "Built a dark editorial analytics interface with a dominant economic indicator, contextual trend data, and a restrained information hierarchy.";

const REWORK_RESPONSE =
  "Refined the interface with denser executive hierarchy, network health context, and stronger visual grouping across the live dashboard.";

const PROJECTS = [
  { name: "Editorial Analytics", kind: "react" },
  { name: "SaaS Pricing", kind: "web" },
];

const INITIAL_CODE = [
  'import Dashboard from "./Dashboard";',
  "",
  "const metrics = [",
  '  { label: "Revenue", value: "$64,200", delta: "+31%" },',
  '  { label: "Run-rate", value: "128%", delta: "+12%" },',
  '  { label: "Enterprise", value: "842", delta: "+18%" },',
  "];",
  "",
  "export default function AnalyticsPage() {",
  "  return (",
  '    <Dashboard title="Capital & Network Velocity"',
  "      metrics={metrics}",
  "    />",
  "  );",
  "}",
];

const REWORK_CODE = [
  'import Dashboard from "./Dashboard";',
  'import NetworkHealth from "./NetworkHealth";',
  "",
  "const metrics = [",
  '  { label: "Revenue", value: "$68,420", delta: "+38%" },',
  '  { label: "Run-rate", value: "136%", delta: "+8%" },',
  '  { label: "Network health", value: "94%", delta: "+6%" },',
  "];",
  "",
  "export default function AnalyticsPage() {",
  "  return (",
  '    <Dashboard title="Capital & Network Velocity"',
  "      metrics={metrics}",
  "      dense",
  "    >",
  "      <NetworkHealth />",
  "    </Dashboard>",
  "  );",
  "}",
];

// All values are milliseconds of actual playback time.
// Desktop can build beside the conversation, so its preview starts on send.
const DESKTOP_T = {
  firstType: [0, 1700],
  firstSend: 1700,
  firstThink: [1750, 2650],
  firstRespond: [2650, 4100],
  firstCode: [3850, 6000],
  firstPreview: [1700, 6500],

  reworkType: [10000, 11700],
  reworkSend: 11700,
  reworkThink: [11750, 12650],
  reworkRespond: [12650, 14200],
  reworkCode: [13900, 16100],
  reworkPreview: [11700, 16600],

  loop: 23000,
};

// On mobile, the conversation and preview share one space. Let the response
// and code complete before opening each preview. Leave time for the preview
// to close before the next prompt starts typing.
const MOBILE_T = {
  firstType: [0, 1700],
  firstSend: 1700,
  firstThink: [1750, 2650],
  firstRespond: [2650, 4100],
  firstCode: [3850, 6000],
  firstPreview: [6100, 7900],
  firstPreviewClose: 11200,

  reworkType: [12100, 13800],
  reworkSend: 13800,
  reworkThink: [13850, 14800],
  reworkRespond: [14800, 16200],
  reworkCode: [15900, 18000],
  reworkPreview: [18400, 20200],

  loop: 27400,
};

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const ease = (value) => 1 - Math.pow(1 - clamp01(value), 3);
const progress = (elapsed, [start, end]) =>
  clamp01((elapsed - start) / Math.max(1, end - start));

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
        setElapsed((previous) => (previous + delta) % loop);
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

function BrowserBar() {
  return (
    <div
      aria-label="Browser chrome"
      className="relative flex h-7 shrink-0 items-center border-b border-[#24242a] bg-[#0a0a0d] px-2.5 sm:h-12 sm:px-3"
    >
      <div
        aria-hidden="true"
        className="ml-1 flex items-center gap-1.5 opacity-50"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57] sm:h-2.5 sm:w-2.5" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e] sm:h-2.5 sm:w-2.5" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#28c840] sm:h-2.5 sm:w-2.5" />
      </div>

      <div className="absolute left-1/2 flex h-5 w-[min(42%,260px)] -translate-x-1/2 items-center justify-center rounded-sm border border-[#18181e] bg-[#0e0e12] px-2.5 text-[8px] font-medium text-white/50 sm:h-7 sm:w-[min(34%,340px)] sm:text-[8.5px]">
        <span className="truncate">surforaai.com/workspace</span>
      </div>

      <div className="ml-auto">
        <span className="ml-auto hidden rounded-full border border-green-600/50 bg-emerald-500/50 p-1 px-2 text-xs sm:block">
          D
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
          ? "rgba(255,255,255,0.055)"
          : "rgba(255,255,255,0)",
        borderColor: active ? "rgba(255,255,255,0.065)" : "rgba(255,255,255,0)",
      }}
      transition={{ duration: 0.4 }}
      className="flex min-w-0 items-center gap-2 rounded-[7px] border px-2 py-[7px]"
    >
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-[6px] bg-white/[0.02]">
        <img
          src={kind === "web" ? "/globe2_red.svg" : "/jsx.svg"}
          height="12"
          width="12"
          alt={kind === "web" ? "Web project" : "React project"}
        />
      </span>
      <span
        className={`min-w-0 truncate text-[10px] leading-4 ${
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
    <aside className="hidden w-[190px] shrink-0 border-r border-[#1a1a1c] bg-backgroundLight lg:block">
      <div className="border-b border-[#24242a] p-3">
        <button
          type="button"
          className="flex h-[42px] w-full items-center gap-2 rounded-[9px] border border-[#24242a] bg-neutral-800/20 px-3 text-left text-[11px] font-medium text-white/80 transition-colors hover:border-[#25252d] hover:bg-[#101015]"
        >
          <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-white/[0.025] text-white/70">
            <Plus size={13} strokeWidth={1.7} />
          </span>
          <span className="flex-1">New Project</span>
          <span className="text-[8px] text-white/30">⌘ K</span>
        </button>
      </div>

      <div className="px-3 pt-4">
        <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
          Recent projects
        </div>
        <div className="space-y-0.5">
          {PROJECTS.map((project) => (
            <ProjectRow
              key={project.name}
              name={project.name}
              kind={project.kind}
              active={false}
            />
          ))}
          <ProjectRow
            name="Revenue Intelligence"
            kind="react"
            active={active}
          />
        </div>
      </div>
    </aside>
  );
}

function EditorTabs() {
  return (
    <div className="flex h-9 shrink-0 items-center border-b border-[#24242a]/80 bg-[#0a0a0d] px-3 sm:h-10 sm:px-3.5">
      <div className="flex h-full items-center gap-0.5">
        <div className="flex h-full items-center gap-1.5 border-b border-violet-400 px-3 text-[9px] font-medium text-white sm:text-[10px]">
          <img src="/jsx.svg" height="15" width="15" alt="" />
          JSX
        </div>
        <div className="flex h-full items-center gap-1.5 px-3 text-[9px] font-medium text-neutral-300 sm:text-[10px]">
          <img src="/css.svg" height="15" width="15" alt="" />
          CSS
        </div>
        <span className="mx-2 h-4 w-px bg-[#1d1d23]" />
        <div className="flex items-center gap-1.5 rounded-[7px] border border-yellow-300/70 bg-[#191700] px-2.5 py-1 text-[9px] font-semibold text-yellow-300 sm:text-[10px]">
          <span className="text-[11px]">✦</span>
          AI
        </div>
      </div>
    </div>
  );
}

function ModelBar({ active, label = "Generating" }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-b border-[#17171d] bg-[#09090c] px-3 text-[9px] sm:h-10 sm:px-3.5 sm:text-[10px]">
      <span className="font-medium text-white/90">GPT-6 Luna</span>
      <span className="text-white/20">|</span>
      <span className="text-violet-300/80">Medium</span>
      <ChevronDown size={9} className="text-white/30" />
      {active ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-auto inline-flex items-center gap-1.5 text-white/45"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-violet-300/75" />
          {label}
        </motion.span>
      ) : null}
    </div>
  );
}

function UserBubble({ text, visible }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
      className="ml-auto w-[min(88%,46rem)] pb-1"
    >
      <div className="mb-1.5 text-right text-[8px] font-medium text-white/30 sm:text-[9px]">
        You
      </div>
      <div className="rounded-[12px] rounded-br-[5px] border border-[#46375c] bg-violet-600/70 px-4 py-3.5 text-[11px] leading-[1.7] text-white/95 sm:px-5 sm:py-4 sm:text-[12px] sm:leading-[1.72]">
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
      className="flex items-center gap-2 pt-0.5"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300/70" />
      <span className="text-[9px] font-medium text-white/45 sm:text-[10px]">
        {text}
      </span>
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
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] uppercase tracking-[0.08em] text-white/40 sm:text-[9px]">
        <span className="text-white/60">SurforaAI</span>
        <span className="h-2.5 w-px bg-[#23232a]" />
        <span>GPT-6 Luna</span>
        {rework ? (
          <span className="rounded border border-[#46375c] bg-[#17121f] px-1.5 py-[1px] text-violet-200/80">
            refined
          </span>
        ) : null}
      </div>
      <p className="text-[12px] leading-[1.75] text-white/85 sm:text-[13px] sm:leading-[1.78]">
        {text.slice(0, chars)}
        {streamProgress < 1 ? (
          <span className="ml-0.5 inline-block h-[0.95em] w-px translate-y-[2px] animate-pulse bg-violet-300/70" />
        ) : null}
      </p>
    </motion.div>
  );
}

function highlightCode(line) {
  const tokens = [];
  const pattern =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:import|from|const|export|default|function|return)\b)|(\b(?:Dashboard|NetworkHealth|AnalyticsPage)\b)|(\b(?:title|metrics|label|value|delta|dense)\b)|(\b\d+%?\b)|([{}()[\].,;=<>/+])/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(
        <span key={lastIndex} className="text-slate-200">
          {line.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const color = match[1]
      ? "text-emerald-300"
      : match[2]
        ? "text-fuchsia-300"
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
      <span key={lastIndex} className="text-slate-200">
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
  const scroll = ease(streamProgress) * Math.max(0, lines.length - 9);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[11px] border border-[#24242a] bg-darkBorder/25"
    >
      <div className="flex h-8 items-center justify-between border-b border-[#19191f] bg-[#19191f]/50 px-2.5 sm:h-9 sm:px-3.5">
        <div className="flex items-center gap-1.5">
          <FileCode2 size={9} className="text-violet-400" />
          <span className="text-[7px] text-white/55 sm:text-[8px]">
            {rework ? "Dashboard.jsx" : "AnalyticsPage.jsx"}
          </span>
        </div>
        <span className="rounded border border-[#29242f] bg-[#111017] px-1.5 py-[2px] text-[6.5px] text-white/40 sm:text-[7px]">
          {streamProgress >= 0.98 ? "Ready" : "Building"}
        </span>
      </div>

      <div className="h-[162px] overflow-hidden px-2.5 py-2.5 font-mono text-[7.5px] leading-[1.9] sm:h-[250px] sm:px-3.5 sm:text-[8.5px]">
        <motion.div
          animate={{ y: `${-scroll * 15}px` }}
          transition={{ duration: 0.48, ease: "easeOut" }}
        >
          {lines.slice(0, count).map((line, index) => (
            <div key={`${index}-${line}`} className="whitespace-pre">
              <span className="mr-2.5 inline-block w-4 text-right text-white/20 sm:mr-3">
                {index + 1}
              </span>
              {line ? highlightCode(line) : " "}
            </div>
          ))}
        </motion.div>
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
    ? INITIAL_PROMPT.slice(
        0,
        Math.floor(
          INITIAL_PROMPT.length * ease(progress(elapsed, timeline.firstType)),
        ),
      )
    : reworkTyping
      ? REWORK_PROMPT.slice(
          0,
          Math.floor(
            REWORK_PROMPT.length * ease(progress(elapsed, timeline.reworkType)),
          ),
        )
      : "";

  return (
    <div
      className={`rounded-[13px] border border-[#24242a] bg-white/3 ${
        compact ? "p-1.5 sm:p-2" : "p-2.5 sm:p-3"
      }`}
    >
      <div
        className={`min-h-[40px] px-1 text-[10px] leading-[1.62] text-white/70 sm:min-h-[40px] sm:text-[11px] sm:leading-[1.68] ${
          compact
            ? "min-h-[42px] text-[9px] sm:min-h-[50px] sm:text-[10px]"
            : ""
        }`}
      >
        {text}
        {text && !sending ? (
          <span className="ml-0.5 inline-block h-[0.9em] w-px translate-y-[2px] animate-pulse bg-violet-300/70" />
        ) : null}
      </div>

      <div className="mt-2 flex items-center justify-end gap-1 border-t border-[#18181e] pt-2 sm:gap-1.5">
        <span className="px-1.5 text-[7px] text-neutral-200 sm:text-[8px]">
          Auto
        </span>
        <button
          type="button"
          aria-label="Search"
          className="grid h-6 w-6 place-items-center rounded-md text-neutral-200 transition-colors hover:bg-white/[0.03] hover:text-neutral-50 sm:h-7 sm:w-7"
        >
          <Search size={10} strokeWidth={1.7} />
        </button>
        <motion.button
          type="button"
          aria-label="Send prompt"
          animate={{
            scale: sending ? [1, 0.9, 1] : 1,
            backgroundColor: sending
              ? "rgba(93,55,134,1)"
              : "rgba(69,40,101,1)",
          }}
          transition={{ duration: 0.45 }}
          className="grid h-6 w-6 place-items-center rounded-[7px] text-violet-100 sm:h-8 sm:w-8"
        >
          <ArrowUp size={11} strokeWidth={1.9} />
        </motion.button>
      </div>
    </div>
  );
}

function CenterConversation({
  elapsed,
  autoFollow = true,
  timeline = DESKTOP_T,
}) {
  const conversationRef = useRef(null);
  const contentRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!autoFollow) return;

    const node = conversationRef.current;
    const content = contentRef.current;
    if (!node || !content) return;

    let frame = null;

    const follow = () => {
      if (frame !== null) return;

      const step = () => {
        const target = Math.max(0, node.scrollHeight - node.clientHeight);
        const distance = target - node.scrollTop;

        if (Math.abs(distance) < 0.8) {
          node.scrollTop = target;
          frame = null;
          return;
        }

        node.scrollTop += distance * 0.18;
        frame = requestAnimationFrame(step);
      };

      frame = requestAnimationFrame(step);
    };

    animationRef.current = follow;

    const mutationObserver = new MutationObserver(follow);
    mutationObserver.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    const resizeObserver = new ResizeObserver(follow);
    resizeObserver.observe(content);
    resizeObserver.observe(node);
    follow();

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      animationRef.current = null;
    };
  }, [autoFollow]);

  useEffect(() => {
    if (animationRef.current) animationRef.current();
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
        className="workspace-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-15 sm:py-4"
      >
        <div
          ref={contentRef}
          className="mx-auto flex w-full max-w-[770px] flex-col gap-5 pb-4 sm:gap-7 sm:pb-5"
        >
          <div className="space-y-5 sm:space-y-6">
            <UserBubble text={INITIAL_PROMPT} visible={initialPrompt} />
            <ThinkingState
              text="Thinking through your request"
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
                initial={{ opacity: 0, height: 0, y: 8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                className="space-y-5 sm:space-y-6"
              >
                <UserBubble text={REWORK_PROMPT} visible />
                <ThinkingState
                  text="Refining the interface"
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

function AureliaSpeakerPreview({ isPlaying }) {
  return (
    <div className="relative mx-auto h-[190px] w-[190px] sm:h-[220px] sm:w-[220px]">
      <div className="absolute inset-0 rounded-full border border-[#c8bd9d]/10" />
      <div className="absolute inset-[8%] rounded-full border border-[#c8bd9d]/10" />
      <div className="absolute inset-[13%] rounded-full bg-[linear-gradient(135deg,#9f9572_0%,#59634d_32%,#283329_68%,#151b17_100%)] shadow-[18px_24px_40px_rgba(0,0,0,.45),inset_7px_7px_18px_rgba(255,255,255,.18),inset_-12px_-14px_20px_rgba(0,0,0,.55)] transition-transform duration-700 hover:rotate-[-3deg]">
        <div className="absolute inset-[5%] rounded-full border border-white/15 bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,.20),transparent_25%),linear-gradient(145deg,rgba(255,255,255,.10),transparent_38%,rgba(0,0,0,.18))]" />
        <div className="absolute inset-[11%] rounded-full border border-[#d8d9cb]/20" />
        <div
          className={`absolute inset-[16%] rounded-full border border-[#b7b9a8]/25 bg-[radial-gradient(circle_at_50%_44%,#3f493b_0%,#2f3a30_50%,#202921_76%,#171f1a_100%)] shadow-[inset_0_4px_12px_rgba(255,255,255,.08),inset_0_-10px_18px_rgba(0,0,0,.42)] transition duration-700 ${
            isPlaying
              ? "shadow-[inset_0_4px_12px_rgba(255,255,255,.08),inset_0_-10px_18px_rgba(0,0,0,.42),0_0_28px_rgba(176,190,143,.18)]"
              : ""
          }`}
        >
          <div className="absolute inset-[8%] rounded-full border border-white/10" />
          <div className="absolute inset-[13%] rounded-full opacity-35 [background:repeating-radial-gradient(circle_at_center,rgba(221,224,208,.26)_0px,rgba(221,224,208,.26)_0.7px,transparent_1px,transparent_4px)]" />
          <div className="absolute inset-[27%] rounded-full border border-[#c2c7ae]/15 bg-[radial-gradient(circle_at_38%_30%,#71806a,#354233_58%,#222c24_100%)] shadow-[inset_0_4px_10px_rgba(255,255,255,.14),0_6px_18px_rgba(0,0,0,.18)]" />
          <div className="absolute left-1/2 top-1/2 h-[5%] w-[5%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c6c8b7]/65" />
          <div
            className={`absolute left-1/2 top-[8%] h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
              isPlaying
                ? "bg-[#dce6ba] shadow-[0_0_10px_2px_rgba(213,228,171,.55)]"
                : "bg-[#aeb39e]/70"
            }`}
          />
        </div>
      </div>

      <div
        className={`absolute -right-[1%] top-[36%] flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#1a211b]/90 text-[#d0c49b] shadow-[0_8px_20px_rgba(0,0,0,.32)] backdrop-blur-sm transition-transform duration-500 ${
          isPlaying ? "scale-105" : ""
        }`}
      >
        <span className="flex h-3.5 items-center gap-[2px]" aria-hidden="true">
          {[0, 1, 2, 3].map((bar) => (
            <span
              key={bar}
              className={`w-[2px] rounded-full bg-current transition-all duration-300 ${
                isPlaying ? ["h-1.5", "h-3", "h-2.5", "h-1"][bar] : "h-1"
              }`}
            />
          ))}
        </span>
      </div>

      <div className="absolute -bottom-1 left-[8%] flex items-center gap-2 rounded-full border border-white/10 bg-[#181d18]/90 px-2.5 py-1.5 shadow-[0_8px_18px_rgba(0,0,0,.28)] backdrop-blur-sm">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#30382d] text-[#d0c49b]">
          <ArrowDownRight size={10} />
        </span>
        <span className="pr-1 text-[6.5px] uppercase tracking-[0.14em] text-[#c0bdad]">
          Sculpted sound
        </span>
      </div>
    </div>
  );
}

function AureliaPreview({ reworked = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(reworked);

  useEffect(() => {
    function updateReworked() {
      if (reworked) setShowDetails(true);
    }
    updateReworked();
  }, [reworked]);

  return (
    <div className="h-full overflow-y-auto bg-[#101310] text-[#e9e5d9] [scrollbar-width:thin] [scrollbar-color:#44483f_transparent]">
      <div className="relative min-h-full overflow-hidden px-4 py-4 sm:px-5 sm:py-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_43%,rgba(139,126,83,.16),transparent_42%),radial-gradient(ellipse_at_18%_100%,rgba(67,83,59,.12),transparent_45%),linear-gradient(120deg,transparent_55%,rgba(255,255,255,.018))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-12 h-[280px] w-[280px] rounded-full border border-[#c8bd9d]/10"
        />

        <div className="relative z-10">
          <header className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-[#c8bd9d]/30">
                <span className="h-2 w-2 rounded-full bg-[#c8bd9d]" />
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#e7e2d7]">
                Aurelia
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowDetails((value) => !value)}
              className="group flex items-center gap-1 text-[7px] font-medium text-[#b9b8ac] transition hover:text-[#d4c79d]"
            >
              {showDetails ? "Close" : "The collection"}
              <ArrowUpRight
                size={9}
                className={`transition-transform ${
                  showDetails
                    ? "rotate-45"
                    : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                }`}
              />
            </button>
          </header>

          <div className="grid gap-4 py-5 sm:py-6 md:grid-cols-[0.92fr_1.08fr] md:items-center">
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px w-5 bg-[#a99b72]" />
                <p className="text-[6px] uppercase tracking-[0.18em] text-[#aaa794]">
                  Aurelia No. 01 · Made for the room
                </p>
              </div>
              <h2 className="max-w-[235px] font-serif text-[clamp(2.2rem,6vw,3.5rem)] leading-[0.88] tracking-[-0.06em] text-[#eee9dc]">
                Sound,
                <br />
                given room
                <br />
                <span className="italic text-[#b9aa7e]">to breathe.</span>
              </h2>
              <p className="mt-4 max-w-[215px] text-[8px] leading-4 text-[#aaa99d] sm:text-[9px]">
                A considered sound system that fills a space gently,
                beautifully, and entirely on its own terms.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying((value) => !value)}
                  className="group inline-flex min-h-8 items-center gap-2 rounded-full bg-[#d2c49b] px-3 text-[7px] font-medium text-[#1b2019] transition hover:bg-[#e1d5ad]"
                >
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-black/10">
                    {isPlaying ? <VolumeX size={8} /> : <Volume2 size={8} />}
                  </span>
                  {isPlaying ? "Pause the room" : "Hear the room"}
                  <ArrowUpRight size={9} />
                </button>
                <span className="flex items-center gap-1.5 text-[6px] uppercase tracking-[0.13em] text-[#a3a296]">
                  <span
                    className={`h-1 w-1 rounded-full ${
                      isPlaying
                        ? "bg-[#c3d39b] shadow-[0_0_8px_rgba(195,211,155,.7)]"
                        : "bg-[#686b60]"
                    }`}
                  />
                  {isPlaying ? "Now playing" : "Sound off"}
                </span>
              </div>

              {showDetails ? (
                <div className="mt-4 max-w-[220px] border-l border-[#a99b72] pl-3 text-[7px] leading-4 text-[#aaa99d]">
                  <p className="font-medium text-[#e6e1d4]">
                    One form. A fuller room.
                  </p>
                  <p className="mt-1">
                    Hand-finished mineral composite, room-aware acoustics, and a
                    softly tuned 360° soundstage.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="relative flex min-h-[230px] items-center justify-center md:min-h-[290px]">
              <div
                aria-hidden="true"
                className="absolute h-[80%] w-[80%] rounded-full bg-[radial-gradient(ellipse,rgba(157,145,101,.15),transparent_68%)]"
              />
              <div className="absolute left-[3%] top-[13%] hidden items-center gap-1.5 text-[5.5px] uppercase tracking-[0.18em] text-[#aaa58e] sm:flex">
                <span className="h-1 w-1 rounded-full bg-[#b7a879]" />
                Crafted in Copenhagen
              </div>
              <div className="absolute bottom-[8%] right-[0%] hidden items-center gap-1.5 text-[5.5px] uppercase tracking-[0.18em] text-[#aaa58e] sm:flex">
                Room-aware acoustics
                <span className="h-1 w-1 rounded-full bg-[#b7a879]" />
              </div>
              <AureliaSpeakerPreview isPlaying={isPlaying} />
            </div>
          </div>

          <footer className="flex items-center justify-between border-t border-white/10 pt-3 text-[5.5px] uppercase tracking-[0.15em] text-[#85877d]">
            <span>Pure tone, considered form</span>
            <span>01 — No. 01</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

function PreviewPlaceholder() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0d] px-5 text-white">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(111,76,156,.045),transparent_68%)]"
      />

      <div className="relative mt-7 text-center">
        <div className="text-[10px] font-medium text-white/55 sm:text-[11px]">
          Your interface will appear here
        </div>
        <div className="mt-1.5 text-[7px] uppercase tracking-[0.16em] text-white/20">
          Live preview
        </div>
      </div>
    </div>
  );
}

function BuildingPreview({ progress: value, rework = false, overlay = false }) {
  const impact = value > 0.58 && value < 0.74;
  const reveal = clamp01(value * 1.18);

  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden px-4 text-white ${
        overlay ? "bg-[#06070a]/42 backdrop-blur-[1px]" : "bg-[#0a0a0d]"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_68%_48%,rgba(111,76,156,.055),transparent_38%),radial-gradient(circle_at_20%_80%,rgba(74,74,90,.045),transparent_44%)]"
      />
      <div className="relative flex flex-1 flex-col items-center justify-center">
        <div className="mb-5 text-center">
          <div className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/30">
            {rework ? "Refining interface" : "Building interface"}
          </div>
          <div className="mt-2 text-[18px] font-medium tracking-[-0.04em] text-white/85 sm:text-[21px]">
            Shaping the experience
          </div>
        </div>

        <div className="relative h-[190px] w-full max-w-[310px]">
          <motion.div
            animate={{ opacity: impact ? 1 : 0, scale: impact ? 1 : 0.75 }}
            transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[60%] top-[62%] h-16 w-24 -translate-x-1/2 rounded-full bg-violet-400/[0.045] blur-2xl"
          />

          <motion.div
            animate={{
              y: impact ? 4 : 0,
              rotate: impact ? -0.7 : 0,
              scale: impact ? 0.992 : 1,
            }}
            transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 w-[228px] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="overflow-hidden rounded-[15px] border border-white/[0.10] bg-[#0f1015]">
              <div className="flex h-7 items-center justify-between border-b border-white/[0.055] px-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/[0.08]" />
                </div>
                <span className="text-[6px] uppercase tracking-[0.18em] text-white/25">
                  {rework ? "Refine" : "Canvas"}
                </span>
              </div>

              <div className="relative h-[128px] p-3">
                <div className="absolute left-3 top-3 w-[88px]">
                  <motion.div
                    animate={{ width: `${32 + reveal * 52}px` }}
                    transition={{ duration: 0.5 }}
                    className="h-2 rounded bg-white/[0.19]"
                  />
                  <div className="mt-2 h-1.5 w-16 rounded bg-white/[0.07]" />
                  <div className="mt-1.5 h-1.5 w-12 rounded bg-white/[0.05]" />
                </div>

                <motion.div
                  animate={{
                    scale: 0.68 + reveal * 0.32,
                    rotate: impact ? 6 : 0,
                  }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-4 top-3 h-10 w-10 rounded-full border border-violet-300/20 bg-violet-300/[0.055]"
                />

                <motion.div
                  animate={{ scaleX: 0.45 + reveal * 0.55 }}
                  transition={{ duration: 0.52 }}
                  className="absolute bottom-4 left-3 h-11 w-[118px] origin-left rounded-[9px] border border-white/[0.065] bg-white/[0.018]"
                >
                  <div className="absolute inset-2 flex items-end gap-1">
                    {[28, 45, 38, 64, 52, 76].map((height, index) => (
                      <motion.span
                        key={index}
                        animate={{
                          height: `${Math.max(10, height * Math.max(0.18, reveal))}%`,
                        }}
                        transition={{ duration: 0.56, delay: index * 0.03 }}
                        className="flex-1 rounded-t-[2px] bg-violet-300/35"
                      />
                    ))}
                  </div>
                </motion.div>
                <div className="absolute bottom-4 right-3 h-8 w-14 rounded-[8px] border border-white/[0.065] bg-white/[0.018]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{
              rotate: impact ? [-46, 16, -42] : -42,
              x: impact ? [0, 5, 0] : 0,
              y: impact ? [-2, 8, -2] : -2,
            }}
            transition={{
              duration: impact ? 0.72 : 0.95,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute right-[7%] top-[7%] origin-bottom-left text-violet-200"
          >
            <Hammer size={48} strokeWidth={1.6} />
          </motion.div>

          <AnimatePresence>
            {impact
              ? [
                  ["left-[68%] top-[60%]", "-13px", "-10px", 0.58],
                  ["left-[69%] top-[59%]", "12px", "-7px", 0.52],
                  ["left-[68%] top-[61%]", "4px", "11px", 0.6],
                ].map(([position, x, y, duration], index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.4, 1, 1.18],
                      x,
                      y,
                    }}
                    transition={{ duration, delay: index * 0.025 }}
                    className={`absolute ${position} text-xs ${
                      index === 1 ? "text-white/65" : "text-violet-200"
                    }`}
                  >
                    {index === 1 ? "·" : "✦"}
                  </motion.span>
                ))
              : null}
          </AnimatePresence>
        </div>

        <div className="mt-4 text-center">
          <div className="text-[9px] font-medium text-white/70">
            {rework ? "Reworking the composition" : "Shaping the interface"}
          </div>
          <div className="mt-1 text-[7px] text-white/30">
            {Math.round(value * 100)}% complete
          </div>
        </div>
      </div>
      <div className="relative flex items-center justify-between border-t border-white/[0.06] pt-3 text-[5.5px] uppercase tracking-[0.15em] text-white/20">
        <span>Interface being shaped</span>
        <span>{rework ? "Refinement pass" : "First build"}</span>
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
          ? "flex h-full flex-col overflow-hidden bg-[#0a0a0d]"
          : "flex h-[320px] min-w-0 flex-col border-t border-[#19191f] bg-[#0b0b0f] sm:h-[370px] lg:h-auto lg:w-[27%] lg:shrink-0 lg:border-l lg:border-t-0"
      }
    >
      <div
        className={
          mobile
            ? "flex h-9 shrink-0 items-center justify-between border-b border-[#1d1d22] px-3 sm:px-4"
            : "flex h-10 shrink-0 items-center justify-between border-b border-[#18181e] px-3.5 sm:h-[42px] sm:px-4"
        }
      >
        <div className="flex items-center gap-2 text-[9px] font-medium text-white/60 sm:text-[10px]">
          <Play
            size={mobile ? 8 : 9}
            fill="currentColor"
            className="text-emerald-300/80"
          />
          Live Preview
        </div>
        <span className="text-[7px] uppercase tracking-[0.1em] text-white/40 sm:text-[8px]">
          {reworkBuilding
            ? "Refining"
            : initialBuilding
              ? "Building"
              : reworked
                ? "Refined"
                : initialReady
                  ? "Ready"
                  : "Waiting"}
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
              transition={{ duration: mobile ? 0.4 : 0.45 }}
              className="absolute inset-0"
            >
              <PreviewPlaceholder />
            </motion.div>
          ) : null}

          {baseMode === "initial" ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0, scale: 1.004 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.997 }}
              transition={{
                duration: mobile ? 0.65 : 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0"
            >
              <AureliaPreview />
            </motion.div>
          ) : null}

          {baseMode === "reworked" ? (
            <motion.div
              key="reworked"
              initial={{ opacity: 0, scale: 1.004 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: mobile ? 0.7 : 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0"
            >
              <AureliaPreview reworked />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence initial={false} mode="sync">
          {building ? (
            <motion.div
              key={reworkBuilding ? "rework-builder" : "initial-builder"}
              initial={{ opacity: 0, scale: mobile ? 0.995 : 0.992 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: mobile ? 1.006 : 1.008 }}
              transition={{
                opacity: {
                  duration: mobile ? 0.5 : 0.55,
                  ease: [0.22, 1, 0.36, 1],
                },
                scale: {
                  duration: mobile ? 0.5 : 0.7,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="absolute inset-0 z-10"
            >
              <BuildingPreview
                progress={progress(
                  elapsed,
                  reworkBuilding
                    ? timeline.reworkPreview
                    : timeline.firstPreview,
                )}
                rework={reworkBuilding}
                overlay
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div
        className={
          mobile
            ? "flex h-7 shrink-0 items-center justify-between border-t border-[#1d1d22] px-3 text-[7px] sm:px-4"
            : "flex h-7 shrink-0 items-center justify-between border-t border-[#18181e] px-3.5 text-[7px] sm:px-4"
        }
      >
        <span className={mobile ? "text-white/40" : "text-white/30"}>
          {initialBuilding
            ? "Building interface…"
            : reworkBuilding
              ? "Applying changes…"
              : reworked
                ? "Updated from latest changes"
                : initialReady
                  ? "Live"
                  : "Waiting for prompt"}
        </span>
        <span className="text-emerald-300/75">●</span>
      </div>
    </section>
  );
}

function DesktopWorkspace({ elapsed }) {
  const thinking =
    (elapsed >= DESKTOP_T.firstThink[0] && elapsed < DESKTOP_T.firstThink[1]) ||
    (elapsed >= DESKTOP_T.reworkThink[0] && elapsed < DESKTOP_T.reworkThink[1]);

  const reworkActive =
    elapsed >= DESKTOP_T.reworkSend && elapsed < DESKTOP_T.reworkPreview[1];

  return (
    <div className="hidden bg-[#0a0a0d] lg:block">
      <div className="relative overflow-hidden rounded-3xl border border-[#232326] bg-[#0a0a0d]">
        <BrowserBar />
        <div className="flex lg:h-[750px] lg:flex-row">
          <Sidebar active={elapsed >= DESKTOP_T.firstSend} />

          <section className="flex min-w-0 flex-1 flex-col bg-[#0a0a0d]">
            <EditorTabs />
            <ModelBar
              active={thinking}
              label={reworkActive ? "Refining" : "Generating"}
            />
            <CenterConversation elapsed={elapsed} />
            <div className="bg-backgroundDark px-3 pb-3 pt-2.5 sm:px-10 sm:pb-4 sm:pt-3">
              <div className="mx-auto max-w-[770px]">
                <Composer elapsed={elapsed} />
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
  const thinking =
    (elapsed >= MOBILE_T.firstThink[0] && elapsed < MOBILE_T.firstThink[1]) ||
    (elapsed >= MOBILE_T.reworkThink[0] && elapsed < MOBILE_T.reworkThink[1]);

  // Use one key for each complete visit. Changing from building to ready must
  // update the content, not close and reopen the entire preview.
  const previewVisit =
    elapsed >= MOBILE_T.firstPreview[0] && elapsed < MOBILE_T.firstPreviewClose
      ? "initial"
      : elapsed >= MOBILE_T.reworkPreview[0]
        ? "rework"
        : null;

  return (
    <div className="block lg:hidden">
      <div className="mx-0 overflow-hidden rounded-xl border border-[#19191f] bg-[#0a0a0d] sm:mx-1">
        <BrowserBar />
        <div className="relative overflow-hidden">
          <EditorTabs />
          <ModelBar
            active={thinking}
            label={elapsed >= MOBILE_T.reworkSend ? "Refining" : "Generating"}
          />
          <div className="flex h-[355px] flex-col">
            <CenterConversation elapsed={elapsed} timeline={MOBILE_T} />
          </div>
          <div className="bg-[#09090c] p-2 sm:p-3">
            <Composer elapsed={elapsed} compact timeline={MOBILE_T} />
          </div>

          <AnimatePresence initial={false} mode="sync">
            {previewVisit ? (
              <motion.div
                key={previewVisit}
                initial={{ x: "100%", opacity: 0.98 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.98 }}
                transition={{
                  duration: 0.68,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 z-10 bg-[#0b0b0f]"
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

  // Independent clocks prevent the shorter desktop cycle from being cut off
  // whenever the longer mobile cycle resets.
  const desktopClock = useTimeline(playing && !reducedMotion, DESKTOP_T.loop);
  const mobileClock = useTimeline(playing && !reducedMotion, MOBILE_T.loop);

  const desktopElapsed = reducedMotion
    ? DESKTOP_T.reworkPreview[1] + 1000
    : desktopClock;
  const mobileElapsed = reducedMotion
    ? MOBILE_T.reworkPreview[1] + 1000
    : mobileClock;

  return (
    <section className="relative overflow-hidden bg-transparent px-0 pb-16 text-white sm:pb-20 lg:pb-28">
      <div className="relative mx-auto max-w-full">
        <div className="relative isolate mx-auto mt-9 max-w-[1280px] sm:mt-11 lg:mt-14">
          <div className="relative z-10">
            <DesktopWorkspace elapsed={desktopElapsed} />
            <MobileWorkspace elapsed={mobileElapsed} />
          </div>
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {!reducedMotion ? (
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                aria-label={
                  playing ? "Pause workflow demo" : "Resume workflow demo"
                }
                className="inline-flex items-center gap-2 rounded-full border border-[#1c1c21] bg-white/[0.025] px-3.5 py-2 text-[10px] font-medium text-white/80 transition-colors hover:bg-white/[0.045] hover:text-white sm:text-[11px]"
              >
                {playing ? (
                  <span className="text-violet-200">Ⅱ</span>
                ) : (
                  <Play
                    size={11}
                    fill="currentColor"
                    className="text-violet-200"
                  />
                )}
                {playing ? "Pause demo" : "Resume demo"}
              </button>
            ) : null}
            <span className="text-[9px] text-white/35">
              Product demo · Generate → refine → preview
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
