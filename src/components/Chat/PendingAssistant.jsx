"use client";
import { AI_MODELS } from "@/ai/models";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_STEPS = [
  "Understanding the objective...",
  "Analyzing context and constraints...",
  "Evaluating reasoning paths...",
  "Preparing the response stream...",
];

const PendingAssistantHeader = ({ aiRequest }) => {
  const modelUsed = AI_MODELS.find((model) => model.value === aiRequest?.model);

  return (
    <div className="mb-3 flex items-center gap-2.5">
      <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
        {/* Generating badge */}
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-violet-400/15
            bg-violet-400/[0.05]
            px-2
            py-0.5
            text-[10px]
            font-medium
            tracking-[0.06em]
            text-violet-200/70
          "
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="
                absolute
                inset-0
                animate-ping
                rounded-full
                bg-violet-300
                opacity-40
              "
            />

            <span className="relative h-1.5 w-1.5 rounded-full bg-violet-300" />
          </span>
          Generating
        </span>

        {/* Generation model */}
        {modelUsed ? (
          <span
            className="
              inline-flex
              items-center
              gap-2
              text-[10px]
              font-medium
              uppercase
              tracking-[0.08em]
              text-neutral-400
            "
          >
            <span aria-hidden="true" className="h-3 w-px bg-white/10" />

            <span>{modelUsed.label}</span>

            {aiRequest?.effort ? (
              <span className="rounded border border-white/10 px-1.5 py-px text-neutral-400">
                {aiRequest.effort}
              </span>
            ) : null}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default function PendingAssistant({
  text,
  steps = DEFAULT_STEPS,
  aiRequest = null,
  className = "",
}) {
  const messages = text
    ? [text, ...steps.filter((step) => step !== text)]
    : steps;

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    function resetStep() {
      setStepIndex(0);
    }
    resetStep();
    if (messages.length < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setStepIndex((currentIndex) => (currentIndex + 1) % messages.length);
    }, 6000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [text, steps, messages.length]);

  const currentMessage = messages[stepIndex % messages.length] || "Thinking...";

  return (
    <div
      className="
        flex
        justify-start
        motion-safe:animate-[chat-entry_260ms_cubic-bezier(0.22,1,0.36,1)]
      "
    >
      <div className="relative w-full max-w-[96%] sm:max-w-[94%]">
        {/* Keep the exact same header footprint as AssistantMessage */}
        <PendingAssistantHeader aiRequest={aiRequest} />

        {/* This is deliberately the same body geometry as AssistantMessage */}
        <div className="pl-0 pt-1">
          <div
            className="
              relative
              flex
              items-center
              gap-2.5
              text-[14.5px]
              leading-7
              text-neutral-100
            "
          >
            <span className="anchor-dot" aria-hidden="true" />
            <div className="relative min-w-0 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={stepIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{
                    duration: 0.32,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`
                    m-0
                    font-normal
                    tracking-[-0.012em]
                    antialiased
                    [text-rendering:optimizeLegibility]
                    ${className}
                  `}
                  role="status"
                  aria-live="polite"
                >
                  <span className="shimmer-text">{currentMessage}</span>
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
