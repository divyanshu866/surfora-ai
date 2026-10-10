"use client";

import { useState, useRef, useEffect } from "react";
import { useEditorContext } from "@/context/EditorContext";
import { Search, SlidersHorizontal } from "lucide-react";
import { ArrowUp } from "lucide-react";
import { useConsole } from "@/context/ConsoleContext";
import { AI_MODELS } from "@/ai/models";
import ChatList from "@/components/Chat/ChatList";
import ModelSelector from "@/components/ModelSelector";
import TargetTechTabs from "./TargetTechTabs";
import GenerationSuggestions from "./GenerationSuggestions";
import PlanRequiredModal from "@/components/upgrade/PlanRequiredModal";
import GenerationLimitModal from "@/components/GenerationLimitModal";
import GenerationUsageIndicator from "@/components/GenerationUsageIndicator";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

const AIEditor = ({ user, isMobile }) => {
  const [planRequiredModel, setPlanRequiredModel] = useState(null);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [selectedEffort, setSelectedEffort] = useState(
    selectedModel?.defaultEffort,
  );
  const { setConsoleLogs } = useConsole();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [generationMode, setGenerationMode] = useState("AUTO");
  const [resolvedGenerationMode, setResolvedGenerationMode] = useState("ASK");
  const [webSearchEnabeled, setWebSearchEnabeled] = useState(false);

  const {
    components,
    activeMessages,
    setActiveMessages,
    activeEditor,
    setActiveEditor,
    activeComponent,
    setActiveComponent,
    activeComponentId,
    setActiveComponentId,
    reworkUI,
    setReworkUI,
    previewKey,
    setPreviewKey,
    saveComponent,
    changeDesc,
    setChangeDesc,
    isGenerating,
    isGeneratingCode,
    setIsGeneratingCode,
    showPreview,
    setShowPreview,
    updatePreview,
    setIsGenerating,
    selectedVisualStyle,
    setSelectedVisualStyle,
    targetTech,
    generationUsage,
    setGenerationUsage,
    generationLimitModalOpen,
    setGenerationLimitModalOpen,
  } = useEditorContext();

  const router = useRouter();

  const [styleOptions, setStyleOptions] = useState([
    /* ---- original 11 presets here ---- */
    {
      name: "Skeuomorphic",
      icon: "archive-alt",
      description: "Real-world textures and shadows",
    },
    {
      name: "Fluent 2",
      icon: "cube",
      description: "Microsoft’s depth-rich Fluent tokens",
    },
    {
      name: "Carbon",
      icon: "flask",
      description: "IBM’s modular, accessibility-first system",
    },
    {
      name: "Skeuomorphic Antient Antique",
      icon: "antient",
      description:
        "Timeless heritage-inspired style blending classical with modern polish",
    },
    {
      name: "Antient Antique",
      icon: "antient",
      description:
        "Timeless heritage-inspired style blending classical with modern polish",
    },
    {
      name: "Metal",
      icon: "metal",
      description:
        "Industrial-inspired aesthetic featuring sleek metallic surfaces, sharp edges, and durable textures",
    },
    {
      name: "Bento Grid",
      icon: "grid-alt",
      description: "Dense tile layout with 3-D offsets",
    },
    {
      name: "Brutalist",
      icon: "slash",
      description: "Raw, intentionally rough aesthetics",
    },
    {
      name: "Neo-Brutalist",
      icon: "shield-cracked",
      description: "Harsh lines, high contrast blocks",
    },
    {
      name: "Cyberpunk",
      icon: "cpu-lightning",
      description: "Neon gradients and sci-fi glows",
    },
    {
      name: "Glassmorphism",
      icon: "layers",
      description: "Frosted, transparent glass effect",
    },
    {
      name: "3-D Glass",
      icon: "cube-transparent",
      description: "Frosted glass with depth",
    },
    {
      name: "Claymorphism",
      icon: "cloud-light",
      description: "Soft clay-like surfaces",
    },
    {
      name: "Paper Wireframe",
      icon: "file-text-alt",
      description: "Outlined paper-style mockups",
    },
    {
      name: "Minimal",
      icon: "minimize",
      description: "Clean and distraction-free UI",
    },
    {
      name: "Pastel Memphis",
      icon: "chrome",
      description: "Playful 80s pastel shapes",
    },
    {
      name: "Techno Dark",
      icon: "circuit-board",
      description: "Dark mode with cyan accents",
    },
    {
      name: "Techno Dark (Pink-Purple Gradients/Accents)",
      icon: "circuit-board",
      description: "Dark mode with cyan accents",
    },
    {
      name: "Solarized Light",
      icon: "sun-cloud",
      description: "Beige + teal readable palette",
    },
    {
      name: "Solarized Dark",
      icon: "moon-cloud",
      description: "Twin dark variant of Solarized",
    },
    {
      name: "Gradient Mesh",
      icon: "gradient",
      description: "Organic mesh gradients",
    },
    {
      name: "Cinematic",
      icon: "film",
      description: "Letterboxed, movie-inspired frame style",
    },
    {
      name: "AI Futuristic (Pink-Purple Dark)",
      icon: "brain-circuit",
      description: "Holographic AI-themed visuals",
    },
    {
      name: "Retro",
      icon: "cpu",
      description: "Old-school colors and pixel art",
    },
    {
      name: "Retro 8-bit",
      icon: "monitor",
      description: "Pixel art retro palette",
    },
    {
      name: "Holographic",
      icon: "prism",
      description: "Iridescent holo effects",
    },
    {
      name: "Corporate Neutral",
      icon: "building",
      description: "Conservative enterprise palette",
    },
    {
      name: "Cinematic",
      icon: "film",
      description: "Letterboxed, filmic UI chrome",
    },
    {
      name: "Material 3",
      icon: "layers-3",
      description: "Latest Google Material tokens",
    },
    {
      name: "Flat Pastel",
      icon: "drop",
      description: "Low-contrast pastel blocks",
    },
    {
      name: "Organic Shapes",
      icon: "leaf",
      description: "Curved blobs & asymmetric cuts",
    },
    {
      name: "Wireframe",
      icon: "slash-forward",
      description: "Monochrome dashed outlines",
    },
  ]);

  const promptAreaRef = useRef(null);
  const generationLimitReached = generationUsage?.remaining === 0;

  const handleAIResponseError = async (response) => {
    let errorData = null;

    try {
      errorData = await response.json();
    } catch {
      // Response did not contain JSON.
    }

    if (errorData?.error === "PLAN_REQUIRED") {
      const requiredModel = AI_MODELS.find(
        (model) => model.value === errorData.model,
      );

      if (requiredModel) {
        setPlanRequiredModel(requiredModel);
      }

      return true;
    }

    if (errorData?.error === "INVALID_MODEL") {
      alert("The selected AI model is not available.");
      return true;
    }

    if (response.status === 401) {
      alert("Please sign in to continue.");
      return true;
    }

    if (errorData?.error === "GENERATION_LIMIT_REACHED") {
      setGenerationUsage((previous) => {
        if (!previous) return previous;

        return {
          ...previous,
          used: errorData.limit,
          remaining: 0,
          limit: errorData.limit,
        };
      });

      setGenerationLimitModalOpen(true);
      return true;
    }

    return false;
  };

  const generateComponent = async (promptOverride) => {
    if (generationUsage?.remaining === 0) {
      setGenerationLimitModalOpen(true);
      return;
    }

    const prompt = promptOverride ?? changeDesc;
    if (!prompt?.trim()) {
      console.log("PROMPT EMPTY");
      return;
    }

    try {
      setIsGenerating(true);
      setIsGeneratingCode(false);
      setReworkUI(true);
      let usageMetadata;
      const userMessage = {
        id: null,
        role: "USER",
        message: prompt,
        componentId: null,
        createdAt: null,
      };
      setChangeDesc("");
      const assistantPlaceholder = {
        id: null,
        role: "ASSISTANT",
        message: "",
        componentId: null,
        createdAt: null,
      };
      const streamState = {
        name: activeComponent.name ?? "",
        messages: [userMessage, assistantPlaceholder],
        targetTech: targetTech,
        jsx: activeComponent.jsx ?? "",
        html: activeComponent.html ?? "",
        css: activeComponent.css ?? "",
        js: activeComponent.js ?? "",
        usageMetadata: null,
        model: selectedModel,
        effort: selectedEffort,
      };

      setActiveMessages(streamState.messages);

      const enrichedPrompt = `Use the following 'User Request' to resolve user intent to 'REWORK' or 'ASK' mode.

        Selected Visual Style:${selectedVisualStyle}

        User Request:${prompt}`;

      const messages = [
        { role: "USER", message: enrichedPrompt },
        { role: "ASSISTANT", message: "" },
      ];

      const updateStreamingComponent = (section, content) => {
        if (resolvedMode !== "REWORK") {
          return;
        }
        setIsGeneratingCode(true);
        setShowPreview(true);
        streamState[section] += content;
        setActiveComponent({ ...streamState });
      };

      const appendAssistantMessageChunk = (content) => {
        streamState.messages = streamState.messages.map((msg, index) =>
          index === streamState.messages.length - 1 && msg.role === "ASSISTANT"
            ? {
                ...msg,
                message: `${msg.message || ""}${content || ""}`,
              }
            : msg,
        );
        setActiveMessages(streamState.messages);
      };

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
          targetTech: targetTech,
          generationMode: generationMode,
          model: selectedModel.value,
          effort: selectedEffort,
          webSearchEnabeled: webSearchEnabeled,
        }),
      });

      if (!response.ok) {
        const handled = await handleAIResponseError(response);

        if (handled) {
          return;
        }

        throw new Error(`Failed: ${response.status}`);
      }

      const generationsRemaining = response.headers.get(
        "X-Generations-Remaining",
      );

      if (generationsRemaining !== null) {
        const remaining = Number(generationsRemaining);

        setGenerationUsage((previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            remaining,
            used: previous.limit - remaining,
          };
        });
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let resolvedMode = response.headers.get("X-Resolved-Generation-Mode");
      if (resolvedMode !== "ASK" && resolvedMode !== "REWORK") {
        resolvedMode = "ASK";
      }
      setResolvedGenerationMode(resolvedMode);

      if (resolvedMode === "REWORK") {
        streamState.name = "";
        streamState.html = "";
        streamState.css = "";
        streamState.js = "";
        streamState.jsx = "";

        clearScreen();
        setActiveComponent({
          ...streamState,
        });
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          if (event.startsWith("data: ")) {
            try {
              const data = JSON.parse(event.substring(6));

              switch (data.type) {
                case "name":
                  streamState.name += data.content;
                  setActiveComponent({ ...streamState });
                  break;
                case "message":
                  appendAssistantMessageChunk(data.content);
                  break;
                case "html":
                  updateStreamingComponent(data.type, data.content);
                  break;
                case "css":
                  updateStreamingComponent(data.type, data.content);
                  break;
                case "js":
                  updateStreamingComponent(data.type, data.content);
                  break;
                case "jsx":
                  updateStreamingComponent(data.type, data.content);
                  break;
                case "usage_metadata":
                  streamState.usageMetadata = data.content;
                  break;
              }
            } catch (err) {
              console.error("Error parsing streaming data:", err);
            }
          } else if (event.startsWith("event: end")) {
            updatePreview(streamState);
            setActiveEditor("AI");
            setIsGeneratingCode(false);

            await saveComponent(streamState);
            return;
          } else if (event.startsWith("event: error")) {
            const errorData = JSON.parse(event.substring(12));
            console.error("Streaming error:", errorData?.error);
            setIsGenerating(false);
            alert("An Error occurred. Please try again.");
            return;
          }
        }
      }
    } catch (err) {
      alert("An Error occurred. Please try again.");
      console.error("Error calling /api/generate:", err);
      setIsGenerating(false);
      setActiveEditor("AI");
    } finally {
      setIsGenerating(false);
      setIsGeneratingCode(false);
    }
  };

  async function rework() {
    if (generationUsage?.remaining === 0) {
      setGenerationLimitModalOpen(true);
      return;
    }
    if (!changeDesc.trim()) {
      console.log("EMPTY");
      return;
    }
    try {
      setIsGenerating(true);
      setIsGeneratingCode(false);

      const userMessage = {
        id: null,
        role: "USER",
        message: changeDesc,
        componentId: activeComponent.id,
        createdAt: null,
      };
      setChangeDesc("");

      const assistantPlaceholder = {
        id: null,
        role: "ASSISTANT",
        message: "",
        componentId: activeComponent.id,
        createdAt: null,
      };

      const streamState = {
        id: activeComponent.id,
        name: activeComponent.name ?? "",
        messages: [...activeMessages, userMessage, assistantPlaceholder],
        html: activeComponent.html ?? "",
        css: activeComponent.css ?? "",
        js: activeComponent.js ?? "",
        jsx: activeComponent.jsx ?? "",
        targetTech: targetTech,
        usageMetadata: null,
        model: selectedModel,
        effort: selectedEffort,
      };

      setActiveMessages(streamState.messages);

      const updateStreamingComponent = (section, content) => {
        if (resolvedMode !== "REWORK") {
          return;
        }
        setShowPreview(true);
        setIsGeneratingCode(true);
        streamState[section] += content;
        setActiveComponent({ ...streamState });
      };

      const appendAssistantMessageChunk = (content) => {
        streamState.messages = streamState.messages.map((msg, index) =>
          index === streamState.messages.length - 1 && msg.role === "ASSISTANT"
            ? {
                ...msg,
                message: `${msg.message || ""}${content || ""}`,
              }
            : msg,
        );
        setActiveMessages(streamState.messages);
      };

      const response = await fetch("/api/ai", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: activeComponent.name ?? "",
          messages: streamState.messages ?? [],
          html: activeComponent.html ?? "",
          css: activeComponent.css ?? "",
          js: activeComponent.js ?? "",
          jsx: activeComponent.jsx ?? "",
          targetTech: streamState.targetTech,
          generationMode: generationMode,
          model: selectedModel.value,
          effort: selectedEffort,
          webSearchEnabeled: webSearchEnabeled,
        }),
      });

      if (!response.ok) {
        const handled = await handleAIResponseError(response);

        if (handled) {
          return;
        }

        throw new Error(`Failed: ${response.status}`);
      }

      const generationsRemaining = response.headers.get(
        "X-Generations-Remaining",
      );

      if (generationsRemaining !== null) {
        const remaining = Number(generationsRemaining);

        setGenerationUsage((previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            remaining,
            used: previous.limit - remaining,
          };
        });
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      let resolvedMode = response.headers.get("X-Resolved-Generation-Mode");
      if (resolvedMode !== "ASK" && resolvedMode !== "REWORK") {
        resolvedMode = "ASK";
      }
      setResolvedGenerationMode(resolvedMode);

      if (resolvedMode === "REWORK") {
        streamState.name = "";
        streamState.html = "";
        streamState.css = "";
        streamState.js = "";
        streamState.jsx = "";

        setActiveComponent({
          ...streamState,
        });
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const event of events) {
          if (event.startsWith("data: ")) {
            try {
              const data = JSON.parse(event.substring(6));
              switch (data.type) {
                case "name":
                  if (resolvedMode !== "REWORK") {
                    break;
                  }
                  streamState.name += data.content;
                  setActiveComponent({ ...streamState });
                  break;
                case "message":
                  appendAssistantMessageChunk(data.content);
                  break;
                case "html":
                  updateStreamingComponent(data.type, data.content);
                  break;
                case "css":
                  updateStreamingComponent(data.type, data.content);
                  break;
                case "js":
                  updateStreamingComponent(data.type, data.content);
                  break;
                case "jsx":
                  updateStreamingComponent(data.type, data.content);
                  break;
                case "usage_metadata":
                  streamState.usageMetadata = data.content;
                  break;
              }
            } catch (err) {
              console.error("Error parsing streaming data:", err);
            }
          } else if (event.startsWith("event: end")) {
            updatePreview(streamState);
            setIsGeneratingCode(false);
            setActiveEditor("AI");
            const newMessages = streamState.messages.slice(-2);
            streamState.messages = newMessages;
            await saveComponent(streamState);
            return;
          } else if (event.startsWith("event: error")) {
            const errorData = JSON.parse(event.substring(12));
            console.error("Streaming error:", errorData?.error);
            setIsGenerating(false);
            alert("An Error occurred. Please try again.");
            return;
          }
        }
      }
    } catch (err) {
      console.error("Error calling /api/generate:", err);
      alert("An Error occurred. Please try again.");
      setIsGenerating(false);
      setActiveEditor("AI");
    } finally {
      setIsGenerating(false);
      setIsGeneratingCode(false);
    }
  }

  const clearScreen = (name, html, css, js, jsx, targetTech) => {
    console.log("Editor cleared from AI-EDITOR");
    setSelectedVisualStyle("Custom style");
    setActiveComponentId(null);

    setActiveComponent({
      id: "",
      messages: [],
      name: name ?? "",
      targetTech: targetTech,
      jsx: jsx ?? "",
      html: html ?? "",
      css: css ?? "",
      js: js ?? "",
    });

    setConsoleLogs([]);
    updatePreview();
  };

  useEffect(() => {
    if (isGenerating) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const textarea = promptAreaRef.current;

      if (
        !textarea ||
        textarea.disabled ||
        window.matchMedia("(max-width: 639px)").matches
      ) {
        return;
      }

      textarea.focus();

      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    });

    return () => cancelAnimationFrame(frame);
  }, [isGenerating, activeComponentId]);

  return (
    <div
      className={`${activeEditor == "AI" ? "" : "hidden"} relative mx-auto flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-transparent text-zinc-100`}
    >
      <ModelSelector
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedEffort={selectedEffort}
        setSelectedEffort={setSelectedEffort}
        userPlan={generationUsage?.plan}
        reworkUI={reworkUI}
        isMobile={isMobile}
        onPlanRequired={(model) => {
          setPlanRequiredModel(model);
        }}
      />

      <div className="relative flex min-h-0 w-full flex-1 flex-col items-center">
        <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain">
          <ChatList
            resolvedGenerationMode={resolvedGenerationMode}
            isGeneratingCode={isGeneratingCode}
          />

          {!reworkUI && !showPreview && (
            <section
              aria-labelledby="welcome-heading"
              className="mx-auto my-auto w-full max-w-4xl px-4 sm:my-auto sm:px-5 sm:py-10 md:my-auto md:px-10 md:pb-14"
            >
              <div className="mx-auto max-w-2xl">
                <h1
                  id="welcome-heading"
                  className="text-balance text-center text-[clamp(1.75rem,8vw,2.25rem)] font-medium leading-[1.06] tracking-[-0.045em] text-zinc-50 text4xl sm:text-5xl lg:text-6xl"
                >
                  Start with the part{" "}
                  <span className="text-violet-300">you can picture.</span>
                </h1>
                {/* <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-zinc-400 sm:mt-4 sm:text-base">
                  Describe the little detail, the rough idea, or the whole
                  interface. We’ll shape it together.
                </p> */}
              </div>
            </section>
          )}
        </div>

        <div
          className={`z-5 w-full ${
            reworkUI
              ? "pointer-events-none absolute inset-x-0 bottom-0 bg-transparent"
              : ""
          }`}
        >
          {/* Composer + TargetTech + GenerationSuggestions + Filters */}
          <div
            className={`mx-auto flex w-full max-w-4xl flex-col overflow-y-auto overscroll-contain px-3 sm:px-6 lg:px-8 ${
              reworkUI
                ? `
        pointer-events-none
        max-h-[min(48dvh,20rem)]
        gap-2.5
        pt-2.5
        pb-[max(0.75rem,env(safe-area-inset-bottom))]
        max-[639px]:gap-2
        max-[639px]:pt-1.5
        max-[639px]:pb-[max(0.5rem,env(safe-area-inset-bottom))]
        sm:gap-3
        sm:pt-3
        sm:pb-4
      `
                : `
        max-h-[min(70dvh,36rem)]
        gap-3
        pt-3
        pb-[max(0.75rem,env(safe-area-inset-bottom))]
        max-[639px]:gap-2
        max-[639px]:pt-2
        max-[639px]:pb-[max(0.5rem,env(safe-area-inset-bottom))]
        sm:max-h-[min(60dvh,38rem)]
        sm:gap-3.5
        sm:pt-4
        sm:pb-5
      `
            }`}
          >
            {/* Target technology */}
            <div
              className={`flex min-w-0 items-center justify-center ${
                reworkUI ? "pointer-events-auto" : "mb-0.5"
              }`}
            >
              <TargetTechTabs />
            </div>

            {/* Generation suggestions */}
            {!reworkUI &&
              activeComponent.id === "" &&
              activeMessages.length === 0 &&
              !isGenerating && (
                <div
                  aria-label="Prompt suggestions"
                  className="pointer-events-auto min-w-0 max-w-full max-[639px]:-mt-0.5"
                >
                  <GenerationSuggestions
                    disabled={isGenerating}
                    onGenerate={(prompt) => {
                      generateComponent(prompt);
                    }}
                  />
                </div>
              )}

            {/* Type / style filters */}
            {!reworkUI && showFilters && (
              <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 max-[639px]:gap-2">
                {/* Visual style */}
                <label className="group block min-w-0">
                  <span className="mb-1.5 block px-0.5 text-[11px] font-medium uppercase tracking-[0.06em] text-white/40 max-[639px]:mb-1 max-[639px]:text-[10px] max-[639px]:tracking-[0.04em]">
                    Visual style
                  </span>
                  <div className="relative mb-2">
                    <select
                      value={selectedVisualStyle}
                      onChange={(e) => setSelectedVisualStyle(e.target.value)}
                      name="style"
                      className="
              h-11 w-full min-w-0 cursor-pointer appearance-none
              rounded-xl border border-white/[0.08]
              bg-white/[0.03] px-3.5 pr-9
              text-[13px] font-medium text-white/90
              outline-none transition-all duration-150
              [color-scheme:dark]
              hover:border-white/[0.14] hover:bg-white/[0.05]
              focus:border-violet-400/50 focus:bg-violet-500/[0.06]
              focus:ring-2 focus:ring-violet-400/15
              max-[639px]:h-10 max-[639px]:rounded-[11px]
              max-[639px]:px-3 max-[639px]:pr-8 max-[639px]:text-[16px]
            "
                    >
                      <option
                        value="Custom style"
                        className="bg-[#18171d] text-white"
                      >
                        Describe visual style in prompt
                      </option>
                      {styleOptions.map((style, index) => (
                        <option
                          key={`${style.name}-${index}`}
                          value={style.name}
                          className="bg-[#18171d] text-white"
                        >
                          {style.name}
                        </option>
                      ))}
                    </select>
                    <span
                      className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-white/35 max-[639px]:right-2.5"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-4 w-4 max-[639px]:h-3.5 max-[639px]:w-3.5"
                      >
                        <path
                          d="m6 8 4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* Composer */}
            <div
              className={`
    pointer-events-auto flex w-full min-w-0 flex-col overflow-hidden
    border transition-[background-color,border-color,box-shadow] duration-200
    focus-within:ring-1 focus-within:ring-violet-400/10
    ${
      reworkUI
        ? `
          rounded-[12px] border-[#302936]
          bg-[#0d0c10] p-2.5
          shadow-[0_10px_30px_-24px_rgba(0,0,0,0.9)]
          focus-within:border-violet-400/35
          max-[639px]:rounded-[11px] max-[639px]:p-2
        `
        : `
          rounded-[12px]
          ${
            generationMode === "ASK"
              ? "border-emerald-400/20 bg-[#0d100e]"
              : "border-[#28262c] bg-[#0d0d0f]"
          }
          p-2.5
          shadow-[0_10px_30px_-24px_rgba(0,0,0,0.75)]
          focus-within:border-violet-400/30
          max-[639px]:rounded-[11px] max-[639px]:p-2
        `
    }
  `}
            >
              <label htmlFor="prompt" className="sr-only">
                Describe your changes
              </label>

              {/* Prompt input */}
              <textarea
                ref={promptAreaRef}
                name="prompt"
                id="prompt"
                value={changeDesc}
                disabled={isGenerating}
                rows={1}
                placeholder={
                  activeComponent.id
                    ? "Describe the changes you want..."
                    : "Describe what you want to build..."
                }
                className={`
      m-0 w-full min-w-0 resize-none overflow-y-auto
      bg-transparent px-2
      text-[13.5px] font-normal leading-[1.55]
      tracking-[-0.012em] text-zinc-100
      outline-none placeholder:text-zinc-600
      disabled:cursor-not-allowed disabled:opacity-50
      ${reworkUI ? "max-h-[140px] min-h-9 py-1.5" : "max-h-[220px] min-h-11 py-2"}
      max-[639px]:max-h-[120px] max-[639px]:min-h-9
      max-[639px]:px-1.5 max-[639px]:py-2
      max-[639px]:text-[16px] max-[639px]:leading-5
      max-[639px]:tracking-[-0.005em]
    `}
                onChange={(e) => {
                  setChangeDesc(e.target.value);
                  e.target.style.height = "0px";
                  e.target.style.height = `${Math.min(
                    e.target.scrollHeight,
                    reworkUI ? 140 : 220,
                  )}px`;
                  e.target.value.length > 75 && setIsExpanded(true);
                  e.target.value.length < 1 && setIsExpanded(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    activeComponent.id === "" ? generateComponent() : rework();
                    if (promptAreaRef.current) {
                      promptAreaRef.current.style.height = "";
                    }
                    setIsExpanded(false);
                  }
                }}
              />

              {/* Composer controls */}
              <div
                className={`
      flex w-full min-w-0 items-center justify-end gap-1
      border-t border-white/[0.045] px-0.5
      ${reworkUI ? "mt-1.5 pt-2" : "mt-2 pt-2"}
      sm:gap-1
      max-[639px]:mt-1 max-[639px]:gap-0.5
      max-[639px]:pt-1.5 max-[639px]:px-0
    `}
              >
                {/* Generation mode */}
                <select
                  name="generation-mode"
                  aria-label="Generation mode"
                  value={generationMode}
                  disabled={isGenerating}
                  onChange={(e) => setGenerationMode(e.target.value)}
                  className={`
        min-w-0 cursor-pointer appearance-none rounded-[7px]
        border border-transparent bg-transparent px-2
        text-[11.5px] font-medium tracking-[-0.01em]
        text-zinc-500 outline-none transition-colors
        [color-scheme:dark]
        hover:bg-white/[0.035] hover:text-zinc-300
        focus-visible:border-violet-400/25
        focus-visible:bg-violet-400/[0.035]
        disabled:cursor-not-allowed disabled:opacity-50
        h-7
        max-[639px]:h-8 max-[639px]:rounded-md max-[639px]:px-1.5
        max-[639px]:text-[12px]
      `}
                >
                  <option value="AUTO" className="bg-[#18171d] text-white">
                    Auto
                  </option>
                  <option value="ASK" className="bg-[#18171d] text-white">
                    Ask
                  </option>
                </select>

                {/* Filters */}
                {!reworkUI && (
                  <button
                    type="button"
                    aria-label="Toggle filters"
                    aria-pressed={showFilters}
                    onClick={() => {
                      setShowFilters((v) => !v);
                      setSelectedVisualStyle("Custom style");
                    }}
                    className={`
          flex h-7 w-7 shrink-0 items-center justify-center
          rounded-[7px] border border-transparent
          transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-violet-400/30
          ${
            showFilters
              ? "border-violet-400/15 bg-violet-400/[0.08] text-violet-300"
              : "text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-300"
          }
          max-[639px]:h-8 max-[639px]:w-8
        `}
                  >
                    <SlidersHorizontal
                      size={14}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </button>
                )}

                {/* Web search */}
                <button
                  type="button"
                  aria-label="Toggle web search"
                  aria-pressed={webSearchEnabeled}
                  onClick={() => {
                    setWebSearchEnabeled((prev) => !prev);
                  }}
                  className={`
        flex h-7 w-7 shrink-0 items-center justify-center
        rounded-[7px] border border-transparent
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-violet-400/30
        ${
          webSearchEnabeled
            ? "border-violet-400/15 bg-violet-400/[0.08] text-violet-300"
            : "text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-300"
        }
        max-[639px]:h-8 max-[639px]:w-8
      `}
                >
                  <Search size={14} strokeWidth={1.7} aria-hidden="true" />
                </button>

                {/* Submit */}
                <button
                  type="button"
                  aria-label={isGenerating ? "Generating" : "Send prompt"}
                  onClick={() => {
                    activeComponent.id === "" ? generateComponent() : rework();
                    if (promptAreaRef.current) {
                      promptAreaRef.current.style.height = "";
                    }
                    setIsExpanded(false);
                  }}
                  disabled={isGenerating || !changeDesc.trim()}
                  className={`
        ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center
        rounded-[7px] border border-violet-300/[0.12]
        bg-[#5725a8] text-white
        shadow-[0_2px_10px_-6px_rgba(139,92,246,0.65)]
        transition-[background-color,transform,box-shadow] duration-150
        hover:bg-[#6932c4]
        active:scale-[0.96]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-violet-300/50
        focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0f]
        disabled:cursor-not-allowed disabled:opacity-35
        disabled:shadow-none disabled:hover:bg-[#5725a8]
        max-[639px]:h-8 max-[639px]:w-8 max-[639px]:rounded-lg
      `}
                >
                  {isGenerating ? (
                    <span
                      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowUp
                      className="h-4 w-4"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PlanRequiredModal
        model={planRequiredModel}
        open={Boolean(planRequiredModel)}
        currentPlan={generationUsage?.plan ?? "FREE"}
        onClose={() => setPlanRequiredModel(null)}
        onUpgrade={(requiredPlan) => {
          setPlanRequiredModel(null);
          window.location.assign("/upgrade");
        }}
      />
      <GenerationLimitModal
        open={generationLimitModalOpen}
        generationUsage={generationUsage}
        onClose={() => setGenerationLimitModalOpen(false)}
        onUpgrade={() => {
          setGenerationLimitModalOpen(false);
          window.location.assign("/upgrade");
        }}
      />
    </div>
  );
};

export default AIEditor;
