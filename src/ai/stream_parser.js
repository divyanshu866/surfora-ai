// Helper function to create streaming response

export const startMarkers = {
  name: "@@SURFORA_NAME_START@@",
  message: "@@SURFORA_MESSAGE_START@@",
  html: "@@SURFORA_HTML_START@@",
  jsx: "@@SURFORA_JSX_START@@",
  css: "@@SURFORA_CSS_START@@",
  js: "@@SURFORA_JS_START@@",
};

export const endMarkers = {
  name: "@@SURFORA_NAME_END@@",
  message: "@@SURFORA_MESSAGE_END@@",
  html: "@@SURFORA_HTML_END@@",
  jsx: "@@SURFORA_JSX_END@@",
  css: "@@SURFORA_CSS_END@@",
  js: "@@SURFORA_JS_END@@",
};
const allMarkers = [
  ...Object.values(startMarkers),
  ...Object.values(endMarkers),
];
export const prohibitedMarkerString = allMarkers.join(", ");

// We retain this many characters between provider chunks so a marker
// split across two chunks can still be detected.
//
// Example:
// "@@MESSAGE_E" + "ND@@"
//
// The first chunk retains "@@MESSAGE_E", then the second chunk completes it.
const maxMarkerLength = Math.max(...allMarkers.map((marker) => marker.length));

const markerBufferLength = maxMarkerLength - 1;

/**
 * Find the earliest marker occurrence in a string.
 *
 * Object iteration order should not determine which marker wins.
 * The marker that actually appears first in the text should win.
 */
function findEarliestMarker(text, markers) {
  let earliest = null;

  for (const [section, marker] of Object.entries(markers)) {
    const index = text.indexOf(marker);

    if (index === -1) {
      continue;
    }

    if (!earliest || index < earliest.index) {
      earliest = {
        section,
        marker,
        index,
      };
    }
  }

  return earliest;
}

/**
 * Send one SSE event.
 */
function enqueueSSE(controller, encoder, payload) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
}

/**
 * Find how many characters at the end of `text` could be the beginning
 * of `marker`.
 *
 * This lets us avoid emitting a partial protocol marker if the provider
 * closes unexpectedly.
 */
function getPartialMarkerSuffixLength(text, marker) {
  const maxLength = Math.min(text.length, marker.length - 1);

  for (let length = maxLength; length > 0; length--) {
    if (text.endsWith(marker.slice(0, length))) {
      return length;
    }
  }

  return 0;
}

export async function createStreamingResponse(stream, headers = {}) {
  const encoder = new TextEncoder();
  let usageMetadata = null;

  const readable = new ReadableStream({
    async start(controller) {
      try {
        let accumulator = "";
        let inSection = false;
        let currSection = null;

        console.log("LLM Stream=======>");

        for await (const chunk of stream) {
          // Capture usage metadata from the provider.
          if (chunk.type === "usage") {
            usageMetadata = chunk.usage;
          }

          const chunkText = chunk.text || "";

          if (!chunkText) {
            continue;
          }

          console.log(chunkText);

          accumulator += chunkText;

          let remaining = accumulator;

          while (true) {
            // ============================================================
            // OUTSIDE A SECTION
            // ============================================================
            if (!inSection) {
              const foundStart = findEarliestMarker(remaining, startMarkers);

              // No complete start marker yet.
              if (!foundStart) {
                // Keep only the tail that could potentially become
                // a marker when the next provider chunk arrives.
                if (remaining.length <= markerBufferLength) {
                  break;
                }

                remaining = remaining.slice(-markerBufferLength);
                break;
              }

              // Remove everything before + including the start marker.
              remaining = remaining.slice(
                foundStart.index + foundStart.marker.length,
              );

              inSection = true;
              currSection = foundStart.section;

              enqueueSSE(controller, encoder, {
                type: "section_start",
                section: currSection,
              });

              // Continue immediately. There may already be section
              // content or even the end marker in `remaining`.
              continue;
            }

            // ============================================================
            // INSIDE A SECTION
            // ============================================================

            // IMPORTANT:
            // Only the end marker belonging to the active section
            // is allowed to terminate it.
            const expectedEndMarker = endMarkers[currSection];

            const endIndex = remaining.indexOf(expectedEndMarker);

            // ------------------------------------------------------------
            // END MARKER FOUND
            // ------------------------------------------------------------
            if (endIndex !== -1) {
              const emitContent = remaining.slice(0, endIndex);

              if (emitContent) {
                enqueueSSE(controller, encoder, {
                  type: currSection,
                  content: emitContent,
                });
              }

              enqueueSSE(controller, encoder, {
                type: "section_end",
                section: currSection,
              });

              // Remove content + end marker.
              remaining = remaining.slice(endIndex + expectedEndMarker.length);

              inSection = false;
              currSection = null;

              // There may be another section immediately after this one.
              continue;
            }

            // ------------------------------------------------------------
            // NO END MARKER YET
            // ------------------------------------------------------------

            // We don't know whether the final characters are normal
            // content or the beginning of a marker split across chunks.
            //
            // Keep the final markerBufferLength characters and emit
            // everything before them.
            if (remaining.length <= markerBufferLength) {
              break;
            }

            const emitLength = remaining.length - markerBufferLength;

            const emitContent = remaining.slice(0, emitLength);

            if (emitContent) {
              enqueueSSE(controller, encoder, {
                type: currSection,
                content: emitContent,
              });
            }

            remaining = remaining.slice(-markerBufferLength);

            break;
          }

          accumulator = remaining;
        }

        // ================================================================
        // FINAL STREAM FLUSH
        // ================================================================
        //
        // The parser intentionally holds the final markerBufferLength
        // characters because they might become a protocol marker when
        // another provider chunk arrives.
        //
        // But the provider stream has now ended, so another chunk can
        // never arrive. Flush that remaining content.
        //
        // This is what fixes the previous truncation bug where endings
        // such as:
        //
        //   "right at the top in massive text."
        //
        // were left inside `accumulator` and never emitted.
        // ================================================================

        if (inSection && currSection && accumulator.length > 0) {
          const expectedEndMarker = endMarkers[currSection];

          // If the stream ended with a partial end marker, don't expose
          // that incomplete protocol syntax as user-facing content.
          const partialMarkerLength = getPartialMarkerSuffixLength(
            accumulator,
            expectedEndMarker,
          );

          const finalContent =
            partialMarkerLength > 0
              ? accumulator.slice(0, -partialMarkerLength)
              : accumulator;

          if (finalContent) {
            enqueueSSE(controller, encoder, {
              type: currSection,
              content: finalContent,
            });
          }

          // Do NOT emit section_end here because the actual end marker
          // was never received.
          //
          // The response is therefore treated as an incomplete protocol
          // response rather than pretending the section ended correctly.
        }

        console.log("Streaming completed.");

        enqueueSSE(controller, encoder, {
          type: "usage_metadata",
          content: usageMetadata,
        });

        controller.enqueue(encoder.encode("event: end\ndata: {}\n\n"));

        controller.close();
      } catch (error) {
        console.error("Streaming error:", error);

        controller.enqueue(
          encoder.encode(
            `event: error\ndata: ${JSON.stringify({
              error: error.message,
            })}\n\n`,
          ),
        );

        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      ...headers,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
