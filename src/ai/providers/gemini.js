import { GoogleGenAI } from "@google/genai";
import { toGeminiContext } from "../../app/api/ai/buildEditContents";
const genAI = new GoogleGenAI({
  vertexai: false,
  apiKey: process.env.GEMINI_API_KEY,
});

export async function* generateWithGemini(
  systemPrompt,
  context,
  modelValue,
  thinkingLevel = "low",
  webSearchEnabeled = false,
) {
  console.log("ModelValue=====>", modelValue);
  console.log("ThinkingLevel=====>", thinkingLevel);
  // console.log("WEB_SEARCH GEMINI=====>", webSearchEnabeled);
  const contents = toGeminiContext(context);
  // console.log("GEMINI CONTEXT=========>");
  // console.dir(contents, { depth: null });
  const stream = await genAI.models.generateContentStream({
    model: modelValue,
    contents,
    config: {
      systemInstruction: systemPrompt,
      tools: webSearchEnabeled ? [{ googleSearch: {} }] : [],
      thinkingConfig: {
        thinkingLevel: thinkingLevel,
      },
    },
  });

  //Normalise Stream
  for await (const chunk of stream) {
    console.log(
      "GEMINI CHUNK:",
      JSON.stringify({
        text: chunk.text,
        candidates: chunk.candidates,
        usageMetadata: chunk.usageMetadata,
        promptFeedback: chunk.promptFeedback,
      }),
    );

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
        },
      };
    }
  }
}
