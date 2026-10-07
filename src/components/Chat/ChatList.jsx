"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useEditorContext } from "@/context/EditorContext";
import ChatMessage from "./ChatMessage";
import PendingAssistant from "./PendingAssistant";

const GENERATION_ANCHOR_RATIO = 0.23;

const getLatestAssistantIndex = (messages) => {
  for (let index = messages.length - 1; index >= 0; index--) {
    if (messages[index]?.role === "ASSISTANT") {
      return index;
    }
  }

  return -1;
};

const getLatestUserIndex = (messages) => {
  for (let index = messages.length - 1; index >= 0; index--) {
    if (messages[index]?.role === "USER") {
      return index;
    }
  }

  return -1;
};

const ChatList = ({ resolvedGenerationMode, isGeneratingCode }) => {
  const {
    reworkUI,
    activeMessages,
    activeComponentIndex,
    isGenerating,
    showPreview,
    setShowPreview,
  } = useEditorContext();

  const chatListRef = useRef(null);

  // Ensures the generation anchor is applied only once.
  const generationAnchorAppliedRef = useRef(false);

  // Tracks whether a generation was previously active.
  const wasGeneratingRef = useRef(false);

  // Tracks whether the code preview was previously open.
  const wasCodePreviewOpenRef = useRef(false);

  // Used when changing spacer height while preserving viewport position.
  const pendingRestoreScrollTopRef = useRef(null);

  // Tracks the currently active component.
  const previousComponentIdRef = useRef(activeComponentIndex);

  const [bottomSpacerHeight, setBottomSpacerHeight] = useState(0);

  const messages = activeMessages ?? [];

  const latestAssistantIndex = getLatestAssistantIndex(messages);
  const latestAssistant = messages[latestAssistantIndex];

  const latestUserIndex = getLatestUserIndex(messages);

  const hasLatestAssistantContent = Boolean(latestAssistant?.message?.trim());

  const isWaitingForAssistant = isGenerating && !hasLatestAssistantContent;

  const isGenerationRequest = resolvedGenerationMode === "REWORK";

  const isCodePreviewOpen = isGenerationRequest && isGeneratingCode;

  /*
   * ---------------------------------------------------------
   * COMPONENT SWITCH
   * ---------------------------------------------------------
   *
   * When the user switches to another component, immediately
   * show the bottom of that component's conversation.
   *
   * This is intentionally driven by activeComponentIndex rather
   * than activeMessages, so streaming updates cannot trigger it.
   */
  useLayoutEffect(() => {
    const element = chatListRef.current;

    if (!element) {
      return;
    }

    // Ignore initial mount.
    if (previousComponentIdRef.current === activeComponentIndex) {
      return;
    }

    previousComponentIdRef.current = activeComponentIndex;

    // Reset generation-specific state for the new component.
    generationAnchorAppliedRef.current = false;
    wasGeneratingRef.current = false;
    wasCodePreviewOpenRef.current = false;
    pendingRestoreScrollTopRef.current = null;

    setBottomSpacerHeight(0);

    requestAnimationFrame(() => {
      const current = chatListRef.current;

      if (!current) {
        return;
      }

      current.scrollTo({
        top: current.scrollHeight,
        behavior: "auto",
      });
    });
  }, [activeComponentIndex]);

  /*
   * ---------------------------------------------------------
   * GENERATION START
   * ---------------------------------------------------------
   *
   * Add a temporary viewport-sized spacer so the latest user
   * prompt can be positioned near the top portion of the
   * viewport.
   */
  useLayoutEffect(() => {
    if (!isGenerating) {
      return;
    }

    const element = chatListRef.current;

    if (!element) {
      return;
    }

    // Only initialize this when a new generation starts.
    if (!wasGeneratingRef.current) {
      generationAnchorAppliedRef.current = false;

      setBottomSpacerHeight(element.clientHeight);
    }

    wasGeneratingRef.current = true;
  }, [isGenerating]);

  /*
   * ---------------------------------------------------------
   * GENERATION ANCHOR
   * ---------------------------------------------------------
   *
   * Smoothly position the latest user prompt around 23%
   * down the viewport.
   *
   * This runs once per generation.
   */
  useLayoutEffect(() => {
    if (!isGenerating) {
      return;
    }

    if (generationAnchorAppliedRef.current) {
      return;
    }

    if (bottomSpacerHeight <= 0) {
      return;
    }

    if (latestUserIndex < 0) {
      return;
    }

    const element = chatListRef.current;

    if (!element) {
      return;
    }

    const target = element.querySelector(
      `[data-chat-index="${latestUserIndex}"]`,
    );

    if (!target) {
      return;
    }

    const containerRect = element.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const targetDocumentTop =
      targetRect.top - containerRect.top + element.scrollTop;

    const desiredViewportOffset =
      element.clientHeight * GENERATION_ANCHOR_RATIO;

    const desiredScrollTop = targetDocumentTop - desiredViewportOffset;

    generationAnchorAppliedRef.current = true;

    element.scrollTo({
      top: Math.max(0, desiredScrollTop),
      behavior: "smooth",
    });
  }, [isGenerating, latestUserIndex, bottomSpacerHeight]);

  /*
   * ---------------------------------------------------------
   * CODE PREVIEW OPENS
   * ---------------------------------------------------------
   *
   * Once the temporary code preview appears, it provides real
   * content below the assistant response. Reduce the temporary
   * spacer to only what is actually needed to preserve the
   * current viewport.
   */
  useLayoutEffect(() => {
    if (!isCodePreviewOpen) {
      wasCodePreviewOpenRef.current = false;
      return;
    }

    const element = chatListRef.current;

    if (!element) {
      return;
    }

    if (wasCodePreviewOpenRef.current) {
      return;
    }

    wasCodePreviewOpenRef.current = true;

    if (bottomSpacerHeight <= 0) {
      return;
    }

    const currentScrollTop = element.scrollTop;

    const contentHeight = element.scrollHeight - bottomSpacerHeight;

    const naturalMaxScrollTop = Math.max(
      0,
      contentHeight - element.clientHeight,
    );

    const requiredSpacerHeight = Math.max(
      0,
      currentScrollTop - naturalMaxScrollTop,
    );

    pendingRestoreScrollTopRef.current = currentScrollTop;

    setBottomSpacerHeight(requiredSpacerHeight);
  }, [isCodePreviewOpen, bottomSpacerHeight]);

  /*
   * ---------------------------------------------------------
   * GENERATION FINISH
   * ---------------------------------------------------------
   *
   * Remove only the temporary spacer that is no longer needed,
   * while preserving the current viewport position.
   */
  useLayoutEffect(() => {
    if (isGenerating) {
      return;
    }

    const element = chatListRef.current;

    if (!element) {
      return;
    }

    if (!wasGeneratingRef.current) {
      return;
    }

    wasGeneratingRef.current = false;
    generationAnchorAppliedRef.current = false;
    wasCodePreviewOpenRef.current = false;

    if (bottomSpacerHeight <= 0) {
      return;
    }

    const currentScrollTop = element.scrollTop;

    const contentHeight = element.scrollHeight - bottomSpacerHeight;

    const naturalMaxScrollTop = Math.max(
      0,
      contentHeight - element.clientHeight,
    );

    const requiredSpacerHeight = Math.max(
      0,
      currentScrollTop - naturalMaxScrollTop,
    );

    pendingRestoreScrollTopRef.current = currentScrollTop;

    setBottomSpacerHeight(requiredSpacerHeight);
  }, [isGenerating, bottomSpacerHeight]);

  /*
   * ---------------------------------------------------------
   * RESTORE SCROLL POSITION
   * ---------------------------------------------------------
   *
   * After the temporary spacer changes size, restore the
   * previous viewport position so no snap occurs.
   */
  useLayoutEffect(() => {
    const element = chatListRef.current;

    if (!element) {
      return;
    }

    const desiredScrollTop = pendingRestoreScrollTopRef.current;

    if (desiredScrollTop === null) {
      return;
    }

    const maxScrollTop = Math.max(
      0,
      element.scrollHeight - element.clientHeight,
    );

    element.scrollTop = Math.min(desiredScrollTop, maxScrollTop);

    pendingRestoreScrollTopRef.current = null;
  }, [bottomSpacerHeight]);

  if (!reworkUI) {
    return null;
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-backgroundDark pt-4 pb-16">
      <div
        ref={chatListRef}
        className="
          h-full
          w-full
          overflow-x-hidden
          overflow-y-auto
          px-4
          pt-8
          pb-34
          sm:px-6
          lg:px-7
          scrollbar-thin
          scrollbar-track-transparent
          scrollbar-thumb-white/10
        "
      >
        {/* ? */}
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {messages.map((message, index) => {
            const isAssistant = message.role === "ASSISTANT";
            const hasContent = Boolean(message.message?.trim());

            // Empty assistant messages represent an in-progress response.
            if (isAssistant && !hasContent) {
              return null;
            }

            const aiRequest = isAssistant
              ? (messages[index - 1]?.aiRequest ?? null)
              : null;

            return (
              <div
                key={message.id ?? `${message.role}-${index}`}
                data-chat-index={index}
              >
                <ChatMessage
                  message={message}
                  aiRequest={aiRequest}
                  isCurrentAssistant={
                    isAssistant && index === latestAssistantIndex
                  }
                  isLastMessage={index === messages.length - 1}
                  isGenerating={isGenerating}
                  isGeneratingCode={isGeneratingCode}
                  isCodePreviewOpen={isCodePreviewOpen}
                  isGenerationRequest={isGenerationRequest}
                  showPreview={showPreview}
                  setShowPreview={setShowPreview}
                />
              </div>
            );
          })}

          {isWaitingForAssistant ? <PendingAssistant /> : null}

          {bottomSpacerHeight > 0 ? (
            <div
              aria-hidden="true"
              className="shrink-0"
              style={{
                height: `${bottomSpacerHeight}px`,
              }}
            />
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#070708] via-[#070708]/80 to-transparent" />
    </div>
  );
};

export default ChatList;
