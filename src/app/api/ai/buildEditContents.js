import { endMarkers, startMarkers } from "../../../ai/stream_parser";

export function buildNeutralEditContext(request) {
  const messages = request.messages;
  const component = request.component;
  const targetTech = request.targetTech;
  let currentComponentState = "";

  const contents = [];
  //remove last assistant placeholder
  const conversationMessages =
    messages.at(-1)?.role === "ASSISTANT" ? messages.slice(0, -1) : messages;
  // REBUILD CONVERSATION WITH RESPONSE MARKERS IN ASSISTANT RESPONSE SO LLM LEARNS
  conversationMessages.forEach((message) => {
    contents.push({
      role: message.role,
      text:
        message.role === "ASSISTANT"
          ? startMarkers.message + message.message + endMarkers.message
          : message.message,
    });
  });

  switch (targetTech) {
    case "HTML":
      currentComponentState = buildComponentStateBundle(component);
      break;
    case "REACT":
      currentComponentState = buildComponentStateReact(component);
      break;
    default:
      console.log("target_tech=====>", targetTech);
      throw new Error(`Unsupported targetTech: ${targetTech}`);
  }

  // The trailing assistant placeholder (yet to be generated) is removed above,
  // so the last conversation message is the current user request.
  // And 2nd last is assistants last response.
  // Attach the current interface state to the latest completed assistant
  // response so the model sees its previous output alongside the latest state.
  const latestAssistant = contents.at(-2);
  const currentUser = contents.at(-1);
  if (
    !latestAssistant ||
    latestAssistant.role !== "ASSISTANT" ||
    !currentUser ||
    currentUser.role !== "USER"
  ) {
    throw new Error(
      "Invalid edit conversation: expected latest completed assistant followed by current user request.",
    );
  }
  contents[contents.length - 2].text =
    contents[contents.length - 2].text + currentComponentState;
  return contents;
}

function buildComponentStateBundle(component) {
  const componentState = `
  Current component:

${startMarkers.name}
${component.name}
${endMarkers.name}
${startMarkers.html}
${component.html}
${endMarkers.html}
${startMarkers.css}
${component.css}
${endMarkers.css}
${startMarkers.js}
${component.js}
${endMarkers.js}`;
  return componentState;
}
function buildComponentStateReact(component) {
  const componentState = `
  Current project:

${startMarkers.name}
${component.name}
${endMarkers.name}
${startMarkers.jsx}
${component.jsx}
${endMarkers.jsx}
${startMarkers.css}
${component.css}
${endMarkers.css}`;
  return componentState;
}

export function toGeminiContext(context) {
  return context.map((message) => ({
    role: message.role === "ASSISTANT" ? "model" : "user",
    parts: [{ text: message.text }],
  }));
}
export function toOpenAIContext(context) {
  return context.map((message) => ({
    role: message.role === "ASSISTANT" ? "assistant" : "user",
    content: message.text,
  }));
}

// export function buildBundleEditGeminiContents(request) {
//   const messages = request.messages;
//   const component = request.component;
//   const contents = [];

//   //remove last assistant placeholder
//   const conversationMessages =
//     messages.at(-1)?.role === "ASSISTANT" ? messages.slice(0, -1) : messages;

//   if (conversationMessages.length > 1) {
//     for (let i = 0; i < conversationMessages.length; i++) {
//       const message = conversationMessages[i];

//       if (message.role === "USER") {
//         contents.push({
//           role: "user",
//           parts: [{ text: message.message }],
//         });
//       } else {
//         const isLatestCompletedAssistant =
//           i === conversationMessages.length - 2;

//         contents.push({
//           role: "model",
//           parts: [
//             {
//               text:
//                 message.message +
//                 (isLatestCompletedAssistant
//                   ? `

// Current component:

// ${startMarkers.name}
// ${component.name}
// ${endMarkers.name}
// ${startMarkers.html}
// ${component.html}
// ${endMarkers.html}
// ${startMarkers.css}
// ${component.css}
// ${endMarkers.css}
// ${startMarkers.js}
// ${component.js}
// ${endMarkers.js}`
//                   : ""),
//             },
//           ],
//         });
//       }
//     }
//   } else {
//     contents.push({
//       role: "user",
//       parts: [
//         {
//           text: `
//           ${startMarkers.message}
//           ${messages[0].message}
//           ${endMarkers.message}
//           Component Current State:
//           ${startMarkers.name}
//           ${component.name}
//           ${endMarkers.name}

//           ${startMarkers.html}
//           ${component.html}
//           ${endMarkers.html}

//           ${startMarkers.css}
//           ${component.css}
//           ${endMarkers.css}

//           ${startMarkers.js}
//           ${component.js}
//           ${endMarkers.js}
//               `,
//         },
//       ],
//     });
//   }

//   return contents;
// }
// export function buildReactEditGeminiContents(request) {
//   const messages = request.messages;
//   const component = request.component;
//   const contents = [];

//   //remove last assistant placeholder
//   const conversationMessages =
//     messages.at(-1)?.role === "ASSISTANT" ? messages.slice(0, -1) : messages;
//   if (conversationMessages.length > 1) {
//     for (let i = 0; i < conversationMessages.length; i++) {
//       const message = conversationMessages[i];

//       if (message.role === "USER") {
//         contents.push({
//           role: "user",
//           parts: [{ text: message.message }],
//         });
//       } else {
//         const isLatestCompletedAssistant =
//           i === conversationMessages.length - 2;

//         contents.push({
//           role: "model",
//           parts: [
//             {
//               text:
//                 message.message +
//                 (isLatestCompletedAssistant
//                   ? `

// Current component:

// ${startMarkers.name}
// ${component.name}
// ${endMarkers.name}
// ${startMarkers.jsx}
// ${component.jsx}
// ${endMarkers.jsx}
// ${startMarkers.css}
// ${component.css}
// ${endMarkers.css}`
//                   : ""),
//             },
//           ],
//         });
//       }
//     }
//   } else {
//     contents.push({
//       role: "user",
//       parts: [
//         {
//           text: `${startMarkers.message}
//           ${messages[0].message}
//           ${endMarkers.message}
//               Component Current State:
//               ${startMarkers.name}
//               ${component.name}
//               ${endMarkers.name}

//               ${startMarkers.jsx}
//               ${component.jsx}
//               ${endMarkers.jsx}

//               ${startMarkers.css}
//               ${component.css}
//               ${endMarkers.css}
//               `,
//         },
//       ],
//     });
//   }

//   return contents;
// }
