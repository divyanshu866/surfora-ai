import { GoogleGenAI } from "@google/genai";
import { toGeminiContext } from "../../app/api/ai/buildEditContents";

const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION || "global";
const vertexai = process.env.GOOGLE_GENAI_USE_VERTEXAI == "true";
if (!project) {
  throw new Error("Missing GOOGLE_CLOUD_PROJECT");
}

const genAI = new GoogleGenAI({
  vertexai,
  project,
  location,
});

export async function* generateWithGeminiAP(
  systemPrompt,
  context,
  modelValue,
  thinkingLevel = "low",
  webSearchEnabeled = false,
) {
  // console.log("Gemini model:", modelValue);
  // console.log("Thinking level:", thinkingLevel);
  // console.log("Google Cloud project:", project);
  // console.log("Google Cloud location:", location);

  const contents = toGeminiContext(context);

  const stream = await genAI.models.generateContentStream({
    model: modelValue,
    contents,
    config: {
      systemInstruction: systemPrompt,

      tools: webSearchEnabeled ? [{ googleSearch: {} }] : [],

      thinkingConfig: {
        thinkingLevel,
      },
    },
  });

  for await (const chunk of stream) {
    if (chunk.text) {
      yield {
        type: "text",
        text: chunk.text,
      };
    }

    if (chunk.usageMetadata) {
      yield {
        type: "usage",
        usage: {
          inputTokens: chunk.usageMetadata.promptTokenCount ?? 0,
          outputTokens: chunk.usageMetadata.candidatesTokenCount ?? 0,
          reasoningTokens: chunk.usageMetadata.thoughtsTokenCount ?? 0,
          totalTokens: chunk.usageMetadata.totalTokenCount ?? 0,
          cachedInputTokens: chunk.usageMetadata.cachedContentTokenCount ?? 0,
        },
      };
    }
  }
}
