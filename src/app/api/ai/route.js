import { generate } from "@/ai/providers/generate";
import { createStreamingResponse } from "@/ai/stream_parser";
import { mockStream, mockReactText, mockText } from "./mockStreamGenerator";
import { buildNeutralEditContext } from "./buildEditContents";
import { buildNeutralGenerateContext } from "./buildGenerateContents";
import { resolveMode } from "./modeClassifier";
import { getSession } from "@/lib/get-session";
import { AI_MODELS } from "../../../ai/models";
import { getUserEntitlement } from "@/lib/billing/entitlements";
import { hasPlanAccess, getRequiredPlanForEffort } from "@/lib/billing/plans";

const mockResponse = false; // Set to true to use mock response for testing
const chunkSize = 2; // Set the chunk size for the mock stream
const delay = 1; // Set the delay between chunks in milliseconds

import {
  WEB_BUNDLE_SYSTEM_PROMPT,
  WEB_BUNDLE_EDIT_SYSTEM_PROMPT,
  WEB_BUNDLE_ASK_SYSTEM_PROMPT,
} from "./prompts/webBundle";

import {
  REACT_SYSTEM_PROMPT,
  REACT_EDIT_SYSTEM_PROMPT,
  REACT_ASK_SYSTEM_PROMPT,
} from "./prompts/react";
import { chargeCredits } from "@/lib/billing/credit-usage";
import { startMarkers } from "../../../ai/stream_parser";

const SYSTEM_PROMPTS = {
  HTML: {
    ASK: WEB_BUNDLE_ASK_SYSTEM_PROMPT,
    REWORK: WEB_BUNDLE_SYSTEM_PROMPT,
  },
  REACT: {
    ASK: REACT_ASK_SYSTEM_PROMPT,
    REWORK: REACT_SYSTEM_PROMPT,
  },
};

const EDIT_SYSTEM_PROMPT = {
  HTML: {
    ASK: WEB_BUNDLE_ASK_SYSTEM_PROMPT,
    REWORK: WEB_BUNDLE_EDIT_SYSTEM_PROMPT,
  },
  REACT: {
    ASK: REACT_ASK_SYSTEM_PROMPT,
    REWORK: REACT_EDIT_SYSTEM_PROMPT,
  },
};

async function authorizeModel(userId, model, effort) {
  const modelDefinition = AI_MODELS.find(
    (catalogModel) => catalogModel.value === model,
  );

  if (!modelDefinition) {
    return Response.json(
      {
        error: "INVALID_MODEL",
      },
      { status: 400 },
    );
  }

  const entitlement = await getUserEntitlement(userId);
  console.log("=== MODEL AUTH ===");
  console.log("userId:", userId);
  console.log("requested model:", model);
  console.log("minimum plan:", modelDefinition.minimumPlan);
  console.log("entitlement plan:", entitlement.plan);
  console.log("subscription:", entitlement.subscription);
  console.log(
    "has access:",
    hasPlanAccess(entitlement.plan, modelDefinition.minimumPlan),
  );
  console.log("=================");
  if (!hasPlanAccess(entitlement.plan, modelDefinition.minimumPlan)) {
    return Response.json(
      {
        error: "PLAN_REQUIRED",
        requiredPlan: modelDefinition.minimumPlan,
        model: modelDefinition.value,
      },
      { status: 403 },
    );
  }

  const resolvedEffort = effort ?? modelDefinition.defaultEffort;

  // Reject effort names that are not configured for this model at any tier.
  const configuredEfforts = new Set(
    Object.values(modelDefinition.allowedEfforts ?? {}).flat(),
  );

  if (!configuredEfforts.has(resolvedEffort)) {
    return Response.json(
      {
        error: "INVALID_EFFORT",
        model: modelDefinition.value,
        effort: resolvedEffort,
      },
      { status: 400 },
    );
  }

  // Check the user's exact plan configuration.
  const planEfforts = modelDefinition.allowedEfforts?.[entitlement.plan] ?? [];

  if (!planEfforts.includes(resolvedEffort)) {
    const requiredPlan = getRequiredPlanForEffort(
      modelDefinition,
      resolvedEffort,
      entitlement.plan,
    );

    if (!requiredPlan) {
      return Response.json(
        {
          error: "INVALID_EFFORT",
          model: modelDefinition.value,
          effort: resolvedEffort,
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        error: "EFFORT_PLAN_REQUIRED",
        requiredPlan,
        model: modelDefinition.value,
        effort: resolvedEffort,
      },
      { status: 403 },
    );
  }

  return {
    model: modelDefinition,
    entitlement,
    effort: resolvedEffort,
  };
}
async function chargeAuthorizedRequest(
  userId,
  entitlement,
  { model, effort, task },
) {
  const result = await chargeCredits(userId, entitlement, {
    model,
    effort,
    task,
  });

  if (!result.allowed) {
    return Response.json(
      {
        error: "INSUFFICIENT_CREDITS",
        plan: entitlement.plan,
        cost: result.cost,
        remaining: result.usage.remaining,
        periods: result.usage.periods,
      },
      { status: 429 },
    );
  }

  return result;
}

//API GENERATE NEW COMPONENT
export async function POST(req) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    messages,
    targetTech,
    generationMode,
    model,
    effort,
    webSearchEnabeled,
  } = await req.json();

  // Authorize the requested model before doing any AI work.
  const userId = session.user.id;

  const authorization = await authorizeModel(userId, model, effort);

  if (authorization instanceof Response) {
    return authorization;
  }

  const { entitlement } = authorization;
  const resolvedEffort = authorization.effort;
  //Build neutral Contents
  const contents = buildNeutralGenerateContext(messages);

  const resolvedMode = mockResponse
    ? "REWORK"
    : await resolveMode(generationMode, contents);

  // POST with REWORK generates an interface; ASK is a text-only task.
  const task = resolvedMode === "REWORK" ? "GENERATE" : "ASK";

  // Charge before calling the generation provider.
  const creditUsage = await chargeAuthorizedRequest(userId, entitlement, {
    model,
    effort: resolvedEffort,
    task,
  });

  if (creditUsage instanceof Response) {
    return creditUsage;
  }
  const headers = {
    "X-Resolved-Generation-Mode": resolvedMode,
    "X-Credits-Remaining": String(creditUsage.usage.remaining),
    "X-Credit-Cost": String(creditUsage.cost),
  };

  let stream;
  switch (mockResponse) {
    case true:
      stream = mockStream(
        targetTech === "REACT" ? mockReactText : mockText,
        chunkSize,
        delay,
      );
      break;
    case false:
      stream = await generate(
        SYSTEM_PROMPTS[targetTech][resolvedMode],
        contents,
        model,
        resolvedEffort,
        webSearchEnabeled,
      );
      // const headers = {
      //   "X-Resolved-Generation-Mode": resolvedMode,
      //   "X-Generations-Remaining": String(generationUsage.remaining),
      // };
      break;
  }
  console.log("GENERATION MODE========>:", generationMode);
  console.log("RESOLVED GENERATION MODE========>:", resolvedMode);
  return createStreamingResponse(stream, headers);
}

//API MODIFY EXISTING COMPONENT
export async function PATCH(req) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    name,
    messages,
    html,
    css,
    js,
    jsx,
    targetTech,
    generationMode,
    model,
    effort,
    webSearchEnabeled,
  } = await req.json();

  const request = {
    mode: "edit",
    targetTech,
    component: {
      name,
      html,
      css,
      js,
      jsx,
    },
    messages: messages,
  };
  // Authorize the requested model before doing any AI work.
  const userId = session.user.id;

  const authorization = await authorizeModel(userId, model, effort);

  if (authorization instanceof Response) {
    return authorization;
  }

  const { entitlement } = authorization;
  const resolvedEffort = authorization.effort;
  //Build contents
  const contents = buildNeutralEditContext(request);

  const resolvedMode = mockResponse
    ? "REWORK"
    : await resolveMode(generationMode, contents);

  const task = resolvedMode === "REWORK" ? "REWORK" : "ASK";

  const creditUsage = await chargeAuthorizedRequest(userId, entitlement, {
    model,
    effort: resolvedEffort,
    task,
  });

  if (creditUsage instanceof Response) {
    return creditUsage;
  }

  const headers = {
    "X-Resolved-Generation-Mode": resolvedMode,
    "X-Credits-Remaining": String(creditUsage.usage.remaining),
    "X-Credit-Cost": String(creditUsage.cost),
  };

  let stream;
  switch (mockResponse) {
    case true:
      stream = mockStream(
        targetTech === "REACT" ? mockReactText : mockText,
        chunkSize,
        delay,
      );
      break;
    case false:
      stream = await generate(
        EDIT_SYSTEM_PROMPT[targetTech][resolvedMode],
        contents,
        model,
        resolvedEffort,
        webSearchEnabeled,
      );
      // const headers = {
      //   "X-Resolved-Generation-Mode": resolvedMode,
      //   "X-Generations-Remaining": String(generationUsage.remaining),
      // };
      break;
  }
  console.log("========== FINAL SYSTEM PROMPT ==========");
  const systemPrompt = EDIT_SYSTEM_PROMPT[targetTech][resolvedMode];
  console.log("targetTech:", targetTech);
  console.log("resolvedMode:", resolvedMode);
  console.log("prompt length:", systemPrompt?.length);
  console.log("has NAME_START:", systemPrompt?.includes(startMarkers.name));
  console.log(
    "has MESSAGE_START:",
    systemPrompt?.includes(startMarkers.message),
  );
  console.log("GENERATION MODE========>:", generationMode);
  console.log("==========================================");

  return createStreamingResponse(stream, headers);
}
