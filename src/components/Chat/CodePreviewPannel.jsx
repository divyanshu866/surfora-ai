"use client";

import { useEffect, useMemo, useRef } from "react";
import hljs from "highlight.js";
import { useEditorContext } from "@/context/EditorContext";

const LANGUAGE_CONFIG = {
  JSX: {
    highlightLanguage: "jsx",
    accent: "text-violet-300",
  },

  HTML: {
    highlightLanguage: "xml",
    accent: "text-orange-300",
  },

  CSS: {
    highlightLanguage: "css",
    accent: "text-sky-300",
  },

  JS: {
    highlightLanguage: "javascript",
    accent: "text-amber-300",
  },
};

const getActiveSection = (component) => {
  if (!component) {
    return null;
  }

  if (typeof component === "string") {
    return {
      label: "CODE",
      code: component,
    };
  }

  /*
   * The last non-empty section is the section currently being streamed.
   * This works with the streaming component shape where sections are
   * progressively populated.
   */
  const sections = [
    ["jsx", "JSX"],
    ["html", "HTML"],
    ["css", "CSS"],
    ["js", "JS"],
  ];

  let activeSection = null;

  for (const [key, label] of sections) {
    const value = component[key];

    if (typeof value === "string" && value.trim()) {
      activeSection = {
        label,
        code: value,
      };
    }
  }

  return activeSection;
};

const getHighlightedCode = (code, section) => {
  if (!code) {
    return "";
  }

  try {
    const language = LANGUAGE_CONFIG[section]?.highlightLanguage;

    if (language) {
      return hljs.highlight(code, {
        language,
        ignoreIllegals: true,
      }).value;
    }

    return hljs.highlightAuto(code).value;
  } catch {
    return hljs.escapeHTML(code);
  }
};

const LoadingCode = () => {
  return (
    <div className="flex h-full flex-col justify-center px-5">
      <div className="space-y-3">
        {[58, 82, 68, 91, 47].map((width, index) => (
          <div
            key={index}
            className="relative h-2 overflow-hidden rounded-full bg-white/[0.055]"
            style={{ width: `${width}%` }}
          >
            <div
              className="
                absolute
                inset-y-0
                -left-1/2
                w-1/2
                bg-linear-to-r
                from-transparent
                via-violet-200/[0.09]
                to-transparent
                motion-safe:animate-[chat-shimmer_1.8s_linear_infinite]
              "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const CodePreviewPannel = () => {
  const { activeComponent } = useEditorContext();

  const codeContainerRef = useRef(null);

  const activeSection = useMemo(
    () => getActiveSection(activeComponent),
    [activeComponent],
  );

  const language = activeSection?.label ?? "CODE";
  const code = activeSection?.code ?? "";

  const lines = useMemo(() => (code ? code.split(/\r?\n/) : []), [code]);

  const highlightedCode = useMemo(
    () => getHighlightedCode(code, language),
    [code, language],
  );

  useEffect(() => {
    const element = codeContainerRef.current;

    if (!element) {
      return;
    }

    element.scrollTop = element.scrollHeight;
  }, [code]);

  const accentClass = LANGUAGE_CONFIG[language]?.accent ?? "text-violet-300";

  return (
    <div
      className="
        relative
        flex
        h-[340px]
        w-full
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-white/[0.085]
        bg-[#0d0d10]
        shadow-[0_16px_40px_rgba(0,0,0,0.24)]
        sm:h-[370px]
      "
    >
      {/* Header */}
      <div
        className="
          flex
          h-10
          shrink-0
          items-center
          justify-between
          border-b
          border-white/[0.065]
          bg-[#101014]
          px-3.5
        "
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="
              flex
              h-5.5
              w-5.5
              items-center
              justify-center
              rounded-md
              border
              border-white/[0.08]
              bg-white/[0.04]
              text-[10px]
              font-semibold
              text-white/55
            "
          >
            {"{}"}
          </span>

          <span
            className={`
              text-[11px]
              font-semibold
              tracking-[0.07em]
              ${accentClass}
            `}
          >
            {language}
          </span>
        </div>

        <div
          className="
            flex
            items-center
            gap-1.5
            rounded-full
            border
            border-violet-300/[0.13]
            bg-violet-300/[0.045]
            px-2.5
            py-1
            text-[9px]
            font-medium
            text-violet-200/70
          "
        >
          <span className="relative h-1.5 w-1.5">
            <span
              className="
                absolute
                inset-0
                rounded-full
                bg-violet-300/30
                motion-safe:animate-ping
              "
            />

            <span
              className="
                relative
                block
                h-1.5
                w-1.5
                rounded-full
                bg-violet-300/90
                shadow-[0_0_7px_rgba(196,181,253,0.32)]
              "
            />
          </span>
          Building
        </div>
      </div>

      {/* Code viewport */}
      <div
        ref={codeContainerRef}
        className="
          min-h-0
          flex-1
          overflow-x-auto
          overflow-y-auto
          bg-[#09090c]
          scrollbar-thin
          scrollbar-track-transparent
          scrollbar-thumb-white/10
          scroll-smooth
        "
      >
        {code ? (
          <div
            className="
              min-w-max
              py-4
              pr-5
              font-mono
              text-[12px]
              leading-[1.75]
            "
          >
            <div className="flex">
              {/* Line numbers */}
              <div
                aria-hidden="true"
                className="
                  sticky
                  left-0
                  z-10
                  mr-4
                  w-10
                  shrink-0
                  select-none
                  bg-[#09090c]
                  pr-2
                  text-right
                  text-[10px]
                  leading-[1.75]
                  tabular-nums
                  text-white/[0.25]
                "
              >
                {lines.map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>

              {/* Source */}
              <div className="flex min-w-0">
                <pre
                  className="
                    m-0
                    whitespace-pre
                    text-[#d8d5df]
                    [&_.hljs-comment]:text-emerald-300/70
                    [&_.hljs-quote]:text-emerald-300/70

                    [&_.hljs-keyword]:text-violet-300
                    [&_.hljs-selector-tag]:text-violet-300

                    [&_.hljs-built_in]:text-cyan-300
                    [&_.hljs-variable]:text-cyan-300

                    [&_.hljs-type]:text-sky-300
                    [&_.hljs-attr]:text-sky-300
                    [&_.hljs-attribute]:text-sky-300

                    [&_.hljs-title]:text-blue-300
                    [&_.hljs-section]:text-blue-300

                    [&_.hljs-literal]:text-amber-300
                    [&_.hljs-number]:text-orange-300

                    [&_.hljs-string]:text-emerald-300
                    [&_.hljs-regexp]:text-emerald-300

                    [&_.hljs-symbol]:text-fuchsia-300
                    [&_.hljs-meta]:text-fuchsia-300

                    [&_.hljs-name]:text-orange-300
                    [&_.hljs-tag]:text-orange-300

                    [&_.hljs-params]:text-zinc-300
                  "
                  dangerouslySetInnerHTML={{
                    __html: highlightedCode,
                  }}
                />

                {/* Streaming caret */}
                <span
                  aria-hidden="true"
                  className="
                    ml-1
                    mt-[0.4em]
                    h-[1.05em]
                    w-px
                    shrink-0
                    rounded-full
                    bg-violet-300/90
                    shadow-[0_0_7px_rgba(196,181,253,0.35)]
                    motion-safe:animate-pulse
                  "
                />
              </div>
            </div>
          </div>
        ) : (
          <LoadingCode />
        )}
      </div>
    </div>
  );
};

export default CodePreviewPannel;
