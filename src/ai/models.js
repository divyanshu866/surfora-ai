//All Models
export const MODEL_CATALOG = {
  GPT_6_LUNA: {
    label: "GPT-6 Luna",
    value: "gpt-6-luna",
    description: "Fast & efficient",
    minimumPlan: "FREE",
    defaultEffort: "medium",
    allowedEfforts: {
      FREE: ["none", "low", "medium"],
      PRO: ["none", "low", "medium", "high", "xhigh", "max"],
      MAX: ["none", "low", "medium", "high", "xhigh", "max"],
    },
  },

  GPT_6_SOL: {
    label: "GPT-6 Sol",
    value: "gpt-6-sol",
    description: "Advanced reasoning",
    minimumPlan: "PRO",
    defaultEffort: "medium",
    allowedEfforts: {
      PRO: ["none", "low", "medium", "high", "xhigh", "max"],
      MAX: ["none", "low", "medium", "high", "xhigh", "max"],
    },
  },

  GLM_5_3_FLASH: {
    label: "GLM-5.3 Flash",
    value: "glm-5.3-flash",
    description: "Strong coding, slower at high effort",
    minimumPlan: "FREE",
    defaultEffort: "low",
    allowedEfforts: {
      FREE: ["low", "high"],
      PRO: ["low", "high"],
      MAX: ["low", "high", "max"],
    },
  },

  GPT_6_ASTRA: {
    label: "GPT-6 Astra",
    value: "gpt-6-astra",
    description: "Maximum intelligence",
    minimumPlan: "MAX",
    defaultEffort: "medium",
    allowedEfforts: {
      MAX: ["low", "medium", "high", "xhigh", "max"],
    },
  },

  GEMINI_3_8_FLASH: {
    label: "Gemini 3.8 Flash",
    value: "gemini-3.8-flash",
    description: "Advanced coding",
    minimumPlan: "PRO",
    defaultEffort: "medium",
    allowedEfforts: {
      PRO: ["low", "medium", "high"],
      MAX: ["low", "medium", "high"],
    },
  },

  GEMINI_3_5_FLASH_LITE: {
    label: "Gemini 3.5 Flash-Lite",
    value: "gemini-3.5-flash-lite",
    description: "Fast alternative",
    minimumPlan: "FREE",
    defaultEffort: "low",
    allowedEfforts: {
      FREE: ["minimal", "low", "medium", "high"],
      PRO: ["minimal", "low", "medium", "high"],
      MAX: ["minimal", "low", "medium", "high"],
    },
  },
};
export const EFFORT_OPTIONS = {
  none: {
    label: "None",
    description: "No additional reasoning",
  },
  minimal: {
    label: "Minimal",
    description: "Fastest response",
  },
  low: {
    label: "Low",
    description: "Fast reasoning",
  },
  medium: {
    label: "Medium",
    description: "Balanced reasoning",
  },
  high: {
    label: "High",
    description: "Deeper reasoning",
  },
  xhigh: {
    label: "XHigh",
    description: "Maximum reasoning",
  },
  max: {
    label: "Max",
    description: "Maximum reasoning depth",
  },
};

//Models actually offered to users
export const AI_MODELS = [
  MODEL_CATALOG.GPT_6_LUNA,
  MODEL_CATALOG.GPT_6_SOL,
  MODEL_CATALOG.GEMINI_3_8_FLASH,
  MODEL_CATALOG.GEMINI_3_5_FLASH_LITE,
  MODEL_CATALOG.GLM_5_3_FLASH,
];
export const INTERNAL_MODELS = {
  classifier: MODEL_CATALOG.GPT_6_LUNA,
  classifierFallback: MODEL_CATALOG.GEMINI_3_5_FLASH_LITE,
};
export const CLASSIFIER_MODEL_VALUE = INTERNAL_MODELS.classifier.value;
export const CLASSIFIER_EFFORT_VALUE = "low";
