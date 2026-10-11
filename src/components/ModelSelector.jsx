import { useEffect, useRef, useState } from "react";
import {
  Brain,
  Check,
  ChevronDown,
  Cpu,
  Lock,
  SlidersHorizontal,
} from "lucide-react";

import { AI_MODELS, EFFORT_OPTIONS } from "@/ai/models";
import { hasPlanAccess, getRequiredPlanForEffort } from "@/lib/billing/plans";

function getModelEfforts(model) {
  return [...new Set(Object.values(model?.allowedEfforts ?? {}).flat())];
}

function getPlanEfforts(model, plan = "FREE") {
  const efforts = model?.allowedEfforts?.[plan];
  return Array.isArray(efforts) ? efforts : [];
}

function getDefaultEffort(model, plan = "FREE") {
  const efforts = getPlanEfforts(model, plan);

  if (efforts.includes(model?.defaultEffort)) {
    return model.defaultEffort;
  }

  if (efforts.includes("low")) {
    return "low";
  }

  return efforts[0] ?? null;
}

export default function ModelSelector({
  selectedModel,
  setSelectedModel,
  selectedEffort,
  setSelectedEffort,
  userPlan = "FREE",
  onPlanRequired,
  reworkUI = false,
  isMobile,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const availableEfforts = getModelEfforts(selectedModel);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (!selectedModel) {
      return;
    }

    const planEfforts = getPlanEfforts(selectedModel, userPlan);

    if (!planEfforts.includes(selectedEffort)) {
      setSelectedEffort(getDefaultEffort(selectedModel, userPlan));
    }
  }, [selectedModel, selectedEffort, setSelectedEffort, userPlan]);

  const handleModelSelect = (model) => {
    const canAccess = hasPlanAccess(userPlan, model.minimumPlan);

    if (!canAccess) {
      setOpen(false);
      onPlanRequired?.(model);
      return;
    }

    setSelectedModel(model);
    setSelectedEffort(getDefaultEffort(model, userPlan));
  };

  const handleEffortSelect = (effort) => {
    const planEfforts = getPlanEfforts(selectedModel, userPlan);

    if (!planEfforts.includes(effort)) {
      const requiredPlan = getRequiredPlanForEffort(
        selectedModel,
        effort,
        userPlan,
      );

      if (!requiredPlan) {
        console.error(
          "No eligible upgrade plan configured for effort:",
          selectedModel?.value,
          effort,
        );
        return;
      }

      setOpen(false);

      onPlanRequired?.({
        ...selectedModel,
        label: `${EFFORT_OPTIONS[effort]?.label ?? effort} effort`,
        description: `${
          EFFORT_OPTIONS[effort]?.description ?? "Advanced reasoning"
        } is available with the ${requiredPlan} plan.`,
        minimumPlan: requiredPlan,
      });

      return;
    }

    setSelectedEffort(effort);
  };

  return (
    <div
      ref={containerRef}
      className={`${
        reworkUI && "backdrop-blur-sm"
      } absolute left-0 top-0 z-10 flex h-10 w-full items-center gap-1 border-b border-transparent bg-transparent px-2 pl-4 text-xs`}
    >
      <div className="relative">
        {/* Selected model */}
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((previous) => !previous)}
          className={`
    group
    relative
    flex
    h-9
    min-w-[178px]
    items-center
    gap-2.5

    rounded-lg
    px-1
    pr-2.5
    text-left
    transition-all
    duration-150
    ${
      open
        ? `
          bg-transparent
        `
        : ``
    }
  `}
        >
          {/* Model + effort */}
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={`
        min-w-0
        truncate
        text-[12px]
        font-medium
        leading-none
        tracking-[-0.01em]
        ${open ? "text-white/95" : "text-white/80 group-hover:text-white/90"}
      `}
            >
              {selectedModel?.label ?? "Select model"}
            </span>

            {selectedModel &&
              !hasPlanAccess(userPlan, selectedModel.minimumPlan) && (
                <Lock
                  size={9}
                  strokeWidth={2}
                  className="shrink-0 text-amber-300/65"
                />
              )}

            {selectedEffort && availableEfforts.includes(selectedEffort) ? (
              <>
                <span className="h-3 w-px shrink-0 bg-white/[0.08]" />

                <span
                  className={`
            shrink-0
            text-[9px]
            font-medium
            leading-none
            tracking-[0.025em]
            ${
              open
                ? "text-violet-200/85"
                : "text-violet-300/65 group-hover:text-violet-200/80"
            }
          `}
                >
                  {EFFORT_OPTIONS[selectedEffort]?.label ?? selectedEffort}
                </span>
              </>
            ) : null}
          </span>

          {/* Chevron */}
          <span
            className={`
      flex
      h-5
      w-5
      shrink-0
      items-center
      justify-center
      rounded-md
      transition-colors duration-150
      ${
        open
          ? "bg-white/[0.045] text-white/55"
          : "text-white/25 group-hover:bg-white/[0.03] group-hover:text-white/45"
      }
    `}
          >
            <ChevronDown
              size={12}
              strokeWidth={1.8}
              className={`
        transition-transform duration-200
        ${open ? "rotate-180" : ""}
      `}
            />
          </span>
        </button>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-1 w-[290px] overflow-hidden rounded-2xl border border-lightBorder bg-backgroundLight p-2 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            {/* Models */}
            <div className="space-y-1">
              {AI_MODELS.map((model) => {
                const isSelected = model.value === selectedModel?.value;

                const isLocked = !hasPlanAccess(userPlan, model.minimumPlan);

                return (
                  <button
                    key={model.value}
                    type="button"
                    onClick={() => handleModelSelect(model)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "bg-white/[0.08]"
                        : isLocked
                          ? "hover:bg-white/[0.025]"
                          : "hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-xs font-medium ${
                          isSelected
                            ? "text-white"
                            : isLocked
                              ? "text-neutral-500"
                              : "text-neutral-300"
                        }`}
                      >
                        {model.label}
                      </div>

                      {model.description && (
                        <div className="mt-0.5 truncate text-[10px] text-neutral-500">
                          {model.description}
                        </div>
                      )}
                    </div>

                    {isLocked ? (
                      <div className="flex shrink-0 items-center gap-1 text-[9px] font-medium uppercase tracking-wide text-yellow-300/70">
                        <Lock width={10} height={10} />
                        {model.minimumPlan}
                      </div>
                    ) : (
                      isSelected && (
                        <Check
                          width={13}
                          height={13}
                          className="shrink-0 text-violet-400"
                        />
                      )
                    )}
                  </button>
                );
              })}
            </div>

            {/* Effort selector */}
            {selectedModel && availableEfforts.length > 0 && (
              <div className="mt-2 border-t border-white/[0.06] pt-2">
                <div className="flex items-center gap-2 px-3 pb-2 pt-1">
                  <SlidersHorizontal
                    width={12}
                    height={12}
                    className="text-violet-400/80"
                  />

                  <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-600">
                    Reasoning effort
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  {availableEfforts.map((effort) => {
                    const isSelected = selectedEffort === effort;
                    const isLocked = !getPlanEfforts(
                      selectedModel,
                      userPlan,
                    ).includes(effort);

                    const requiredPlan = isLocked
                      ? getRequiredPlanForEffort(
                          selectedModel,
                          effort,
                          userPlan,
                        )
                      : null;

                    return (
                      <button
                        key={effort}
                        type="button"
                        onClick={() => handleEffortSelect(effort)}
                        className={`group rounded-lg px-2.5 py-2 text-left transition-all ${
                          isSelected
                            ? "bg-violet-400/[0.10] ring-1 ring-violet-400/20"
                            : isLocked
                              ? "bg-white/[0.015] hover:bg-white/[0.045]"
                              : "hover:bg-white/[0.05]"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between gap-2 text-[11px] font-medium ${
                            isSelected
                              ? "text-violet-200"
                              : isLocked
                                ? "text-neutral-500"
                                : "text-neutral-300"
                          }`}
                        >
                          <span>{EFFORT_OPTIONS[effort]?.label ?? effort}</span>

                          {isLocked && (
                            <span className="flex shrink-0 items-center gap-1 text-[8px] font-medium uppercase tracking-wide text-amber-300/70">
                              <Lock width={10} height={10} />
                              {requiredPlan}
                            </span>
                          )}
                        </div>

                        <div
                          className={`mt-0.5 text-[9px] ${
                            isSelected
                              ? "text-violet-300/50"
                              : "text-neutral-600"
                          }`}
                        >
                          {EFFORT_OPTIONS[effort]?.description ?? ""}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
