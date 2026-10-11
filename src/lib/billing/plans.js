export const PLAN_LEVELS = {
  FREE: 0,
  PRO: 1,
  MAX: 2,
};

export const PLAN_CONFIG = {
  FREE: {
    monthlyGenerations: 20,
  },

  PRO: {
    monthlyGenerations: 100,
  },

  MAX: {
    monthlyGenerations: 300,
  },
};

export function hasPlanAccess(userPlan, requiredPlan) {
  const userLevel = PLAN_LEVELS[userPlan] ?? -1;
  const requiredLevel = PLAN_LEVELS[requiredPlan] ?? Infinity;

  return userLevel >= requiredLevel;
}

export function getRequiredPlanForEffort(model, effort, currentPlan = "FREE") {
  const currentLevel = PLAN_LEVELS[currentPlan];

  if (currentLevel === undefined) {
    return null;
  }

  return (
    Object.entries(model?.allowedEfforts ?? {})
      .filter(
        ([plan, efforts]) =>
          PLAN_LEVELS[plan] !== undefined &&
          PLAN_LEVELS[plan] > currentLevel &&
          Array.isArray(efforts) &&
          efforts.includes(effort),
      )
      .sort(
        ([planA], [planB]) => PLAN_LEVELS[planA] - PLAN_LEVELS[planB],
      )[0]?.[0] ?? null
  );
}
