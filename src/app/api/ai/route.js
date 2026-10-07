import { generate } from "@/ai/providers/generate";
import { createStreamingResponse } from "@/ai/stream_parser";
import { mockStream, mockReactText, mockText } from "./mockStreamGenerator";
import { buildNeutralEditContext } from "./buildEditContents";
import { buildNeutralGenerateContext } from "./buildGenerateContents";
import { resolveMode } from "./modeClassifier";
import { getSession } from "@/lib/get-session";
import { AI_MODELS } from "../../../ai/models";
import { getUserEntitlement } from "../../../lib/billing/entitlements";
import { hasPlanAccess } from "../../../lib/billing/plans";
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
import { consumeGeneration } from "../../../lib/billing/generation-usage";
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
async function authorizeModel(userId, model) {
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

  return {
    model: modelDefinition,
    entitlement,
  };
}
async function authorizeAndConsumeGeneration(userId, model) {
  const authorization = await authorizeModel(userId, model);

  if (authorization instanceof Response) {
    return authorization;
  }

  const { entitlement } = authorization;
  const generationUsage = await consumeGeneration(userId, entitlement);

  if (!generationUsage.allowed) {
    return Response.json(
      {
        error: "GENERATION_LIMIT_REACHED",
        plan: entitlement.plan,
        limit: generationUsage.limit,
        remaining: 0,
      },
      { status: 429 },
    );
  }

  return {
    model: authorization.model,
    entitlement,
    generationUsage,
  };
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
  const userId = session.user.id;
  // Authorize the requested model before doing any AI work.
  const authorization = await authorizeAndConsumeGeneration(userId, model);

  if (authorization instanceof Response) {
    return authorization;
  }
  const { entitlement, generationUsage } = authorization;

  //Build neutral Contents
  const contents = buildNeutralGenerateContext(messages);

  if (mockResponse) {
    const stream = mockStream(
      targetTech === "REACT" ? mockReactText : mockText,
      chunkSize,
      delay,
    );
    const headers = {
      "X-Resolved-Generation-Mode": "REWORK",
      "X-Generations-Remaining": String(generationUsage.remaining),
    };
    return createStreamingResponse(stream, headers);
  } else {
    console.log("GENERATION MODE========>:", generationMode);
    const resolvedMode = await resolveMode(generationMode, contents);
    console.log("RESOLVED GENERATION MODE========>:", resolvedMode);

    const stream = await generate(
      SYSTEM_PROMPTS[targetTech][resolvedMode],
      contents,
      model,
      effort,
      webSearchEnabeled,
    );
    const headers = {
      "X-Resolved-Generation-Mode": resolvedMode,
      "X-Generations-Remaining": String(generationUsage.remaining),
    };

    return createStreamingResponse(stream, headers);
  }
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
  const userId = session.user.id;
  // Authorize the requested model before doing any AI work.
  const authorization = await authorizeAndConsumeGeneration(userId, model);

  if (authorization instanceof Response) {
    return authorization;
  }

  const { entitlement, generationUsage } = authorization;

  console.log("TARGET TECH BEF BUILD CONTENTS===>", request.targetTech);
  //Build contents
  const contents = buildNeutralEditContext(request);

  if (mockResponse) {
    const stream = mockStream(
      targetTech === "REACT" ? mockReactText : mockText,
      chunkSize,
      delay,
    );
    const headers = {
      "X-Resolved-Generation-Mode": "REWORK",
      "X-Generations-Remaining": String(generationUsage.remaining),
    };

    return createStreamingResponse(stream, headers);
  } else {
    console.log("GENERATION MODE========>:", generationMode);
    const resolvedMode = await resolveMode(generationMode, contents);

    const systemPrompt = SYSTEM_PROMPTS[targetTech][resolvedMode];
    console.log("========== FINAL SYSTEM PROMPT ==========");
    console.log("targetTech:", targetTech);
    console.log("resolvedMode:", resolvedMode);
    console.log("prompt length:", systemPrompt?.length);
    console.log("has NAME_START:", systemPrompt?.includes(startMarkers.name));
    console.log(
      "has MESSAGE_START:",
      systemPrompt?.includes(startMarkers.message),
    );
    console.log("==========================================");
    const stream = await generate(
      EDIT_SYSTEM_PROMPT[targetTech][resolvedMode],
      contents,
      model,
      effort,
      webSearchEnabeled,
    );
    const headers = {
      "X-Resolved-Generation-Mode": resolvedMode,
      "X-Generations-Remaining": String(generationUsage.remaining),
    };

    return createStreamingResponse(stream, headers);
  }
}
