export const CREDIT_POLICY = {
  FREE: {
    dailyCredits: 20,
    monthlyCredits: 100,
  },
  PRO: {
    monthlyCredits: 1000,
  },
};

// Base credits before effort and task multipliers.
// Keep this list aligned with models available to users.
const MODEL_BASE_CREDITS = {
  "gpt-6-luna": 4,
  "gpt-6-sol": 14,
  "gemini-3.8-flash": 6,
  "gemini-3.5-flash-lite": 2,
  "glm-5.3-flash": 3,
};

const EFFORT_MULTIPLIERS = {
  none: 1,
  minimal: 1,
  low: 1,
  medium: 1.25,
  high: 1.75,
  xhigh: 2.5,
  max: 3.5,
};

const TASK_MULTIPLIERS = {
  ASK: 0.5,
  GENERATE: 1,
  REWORK: 1.25,
};

export function getCreditCost({ model, effort, task }) {
  const baseCredits = MODEL_BASE_CREDITS[model];
  const effortMultiplier = EFFORT_MULTIPLIERS[effort];
  const taskMultiplier = TASK_MULTIPLIERS[task];

  if (
    baseCredits === undefined ||
    effortMultiplier === undefined ||
    taskMultiplier === undefined
  ) {
    throw new Error(
      `Missing credit pricing configuration: model=${model}, effort=${effort}, task=${task}`,
    );
  }

  return Math.max(
    1,
    Math.ceil(baseCredits * effortMultiplier * taskMultiplier),
  );
}
