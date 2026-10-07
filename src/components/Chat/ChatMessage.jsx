"use client";

import ChatMarkdown from "./ChatMarkdown";
import ChatPreviewToggle from "./ChatPreviewToggle";
import AnimatedCodePreview from "./AnimatedCodePreview";
import { AI_MODELS } from "@/ai/models";

/* ------------------------------------------------------------------
   Type + rhythm tokens
   desktop body → 15px / 28px
   mobile body  → 14px / 24px
   label         → 11–13px
   meta          → 10–11px tabular numerals
   mobile rhythm → tighter spacing, wider message column
------------------------------------------------------------------- */

const Dot = () => (
  <span aria-hidden="true" className="text-white/10">
    ·
  </span>
);

const Stat = ({ label, value }) => (
  <span className="inline-flex items-baseline gap-1">
    <span className="text-neutral-500">{label}</span>
    <span className="font-medium tabular-nums text-neutral-300">{value}</span>
  </span>
);

const MessageMeta = ({ aiRequest }) => {
  if (!aiRequest) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] leading-4 sm:mt-3 sm:gap-x-2.5 sm:gap-y-1 sm:text-[11px] sm:leading-5">
      <Stat label="Input" value={aiRequest.inputTokens ?? 0} />
      <Dot />
      <Stat label="Output" value={aiRequest.outputTokens ?? 0} />
      <Dot />
      <Stat label="Thinking" value={aiRequest.thinkingTokens ?? 0} />
      <Dot />
      <Stat label="Total" value={aiRequest.totalTokens ?? 0} />
    </div>
  );
};

const AssistantHeader = ({ isGenerating, aiRequest }) => {
  const modelUsed = AI_MODELS.find((model) => model.value === aiRequest?.model);

  return (
    <div className="mb-2.5 flex min-w-0 items-center gap-2 sm:mb-3 sm:gap-2.5">
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        {isGenerating ? (
          <span
            className="
              inline-flex
              shrink-0
              items-center
              gap-1.5
              rounded-full
              border
              border-violet-400/15
              bg-violet-400/[0.05]
              px-1.5
              py-0.5
              text-[9px]
              font-medium
              tracking-[0.06em]
              text-violet-200/70
              sm:px-2
              sm:text-[10px]
            "
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="
                  absolute
                  inset-0
                  rounded-full
                  bg-violet-300
                  opacity-40
                  animate-ping
                "
              />
              <span className="relative h-1.5 w-1.5 rounded-full bg-violet-300" />
            </span>
            Generating
          </span>
        ) : null}

        {modelUsed ? (
          <span
            className="
              inline-flex
              min-w-0
              flex-wrap
              items-center
              gap-x-1.5
              gap-y-1
              text-[9px]
              font-medium
              uppercase
              tracking-[0.075em]
              text-neutral-400
              sm:gap-x-2
              sm:text-[10px]
              sm:tracking-[0.08em]
            "
          >
            <span
              aria-hidden="true"
              className="hidden h-3 w-px bg-white/10 sm:block"
            />

            <span className="truncate">{modelUsed.label}</span>

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

const UserMessage = ({ message }) => {
  return (
    <div className="flex min-w-0 justify-end">
      <div
        className="
          min-w-0
          max-w-[94%]
          motion-safe:animate-[chat-entry_220ms_cubic-bezier(0.22,1,0.36,1)]
          sm:max-w-[78%]
        "
      >
        <div className="mb-1.5 flex justify-end px-1 sm:mb-2">
          <span className="text-[11px] font-medium leading-4 tracking-[0.01em] text-neutral-400 sm:text-[13px] sm:leading-5">
            You
          </span>
        </div>

        <div
          className="
            rounded-2xl
            rounded-br-md
            border
            border-violet-300/15
            bg-violet-600/50
            px-3.5
            py-2.5
            text-[14px]
            leading-6
            text-neutral-50
            shadow-[0_4px_18px_rgba(0,0,0,0.14)]
            transition-colors
            duration-200
            sm:rounded-2xl
            sm:px-4
            sm:py-3
            sm:text-[15px]
            sm:leading-7
            sm:shadow-[0_6px_24px_rgba(0,0,0,0.12)]
          "
        >
          <p className="whitespace-pre-wrap break-words">{message}</p>
        </div>
      </div>
    </div>
  );
};

const AssistantMessage = ({
  message,
  aiRequest,
  isCurrentAssistant,
  isLastMessage,
  isGenerating,
  isGenerationRequest,
  isCodePreviewOpen,
  showPreview,
  setShowPreview,
}) => {
  const isActive = isGenerating && isCurrentAssistant;

  return (
    <div
      className="
        flex
        min-w-0
        justify-start
        motion-safe:animate-[chat-entry_260ms_cubic-bezier(0.22,1,0.36,1)]
      "
    >
      <div className="relative w-full min-w-0 max-w-full sm:max-w-[94%]">
        <AssistantHeader isGenerating={isActive} aiRequest={aiRequest} />

        <div className="min-w-0 pt-0.5 sm:pt-1">
          <div
            className={
              isActive ? "relative transition-opacity duration-200" : "relative"
            }
          >
            <div
              className="
    min-w-0
    text-[14px]
    leading-6
    text-neutral-200
    [&>*+*]:mt-2.5
    [&>*:first-child]:mt-0
    [&>*:last-child]:mb-0
    sm:text-[15px]
    sm:leading-7
    sm:[&>*+*]:mt-3
  "
            >
              <ChatMarkdown>{message}</ChatMarkdown>
            </div>

            {isActive ? (
              <span
                aria-hidden="true"
                className="
                  ml-0.5
                  inline-block
                  h-[1.05em]
                  w-[2px]
                  translate-y-[3px]
                  rounded-full
                  bg-violet-300/80
                  shadow-[0_0_8px_rgba(196,181,253,0.35)]
                  motion-safe:animate-pulse
                "
              />
            ) : null}
          </div>

          <MessageMeta aiRequest={aiRequest} />
        </div>

        {isLastMessage && isGenerationRequest ? (
          <AnimatedCodePreview isOpen={isCodePreviewOpen} />
        ) : null}

        {!isGenerating && isLastMessage ? (
          <div
            className="
              mt-2
              flex
              justify-end
              sm:absolute
              sm:bottom-3
              sm:right-0
              sm:mt-0
            "
          >
            <ChatPreviewToggle
              showPreview={showPreview}
              setShowPreview={setShowPreview}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

const ChatMessage = ({
  message,
  aiRequest,
  isCurrentAssistant,
  isLastMessage,
  isGenerating,
  isGenerationRequest,
  isCodePreviewOpen,
  showPreview,
  setShowPreview,
}) => {
  const text = message?.message?.trim() ?? "";

  if (message?.role === "USER") {
    return <UserMessage message={text} />;
  }

  return (
    <AssistantMessage
      message={text}
      aiRequest={aiRequest}
      isCurrentAssistant={isCurrentAssistant}
      isLastMessage={isLastMessage}
      isGenerating={isGenerating}
      isGenerationRequest={isGenerationRequest}
      isCodePreviewOpen={isCodePreviewOpen}
      showPreview={showPreview}
      setShowPreview={setShowPreview}
    />
  );
};

export default ChatMessage;
