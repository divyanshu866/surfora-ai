import { SERIALIZE_CONSOLE_VALUE_SOURCE } from "@/components/Preview/consoleSerializer";
export async function buildwebBundleDocument(component) {
  const boilerCss = /*css*/ `
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100vh;
      font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }
    img {
      max-width: 400px;
      max-height: 400px;
      height: 100%;
      width: 100%;
    }
  `;
  const constructedBundleDocument = /*html*/ ` <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <script src="https://cdn.tailwindcss.com"></script>
        <title>SurforaAI Preview</title>
        <!-- Generated component CSS -->
        <style>
          ${component.css ? component.css : boilerCss}
        </style>
      </head>
      <body>
        <!-- Default component code -->
        ${
          !component.html && !component.css && !component.js
            ? ""
            : component.html
        }

        <!--ComponentLab Preview Runtime-->
        <script>
          ${SERIALIZE_CONSOLE_VALUE_SOURCE}
          // ERROR REPORTING HELPER
          function reportPreviewDiagnostic({
            source= "preview",
            severity,
            type,
            message,
            stack= null,
            location= null,
            metadata= {},
          }) {
            window.parent.postMessage(
              {
                type: "preview-diagnostics",
                diagnostics: [
                  {
                    source,
                    targetTech: "WEB BUNDLE",
                    severity,
                    type,
                    message,
                    stack,
                    location,
                    metadata,
                  },
            ],
              },
              "*",
            );
          }
           // CONSOLE ERROR REPORTING HELPER
          function reportConsoleMessage(method, severity, args) {
            const serializedArguments = args.map((arg) => 
              serializeConsoleValue(arg)
            );
            reportPreviewDiagnostic(
              {
              source: "console",
              severity,
              type: method,
              message: serializedArguments.map((arg) => arg.preview).join(" "),
              stack: null,
              location: {
                file: "Component.js",
                line: null,
                column: null
              },
              metadata: {
                arguments: serializedArguments
              }
            });
          }
          //REPORT UNCAUGHT RUNTIME & RESOURCE ERRORS
          window.addEventListener(
            "error",
            (event) => {
              //console.log("ERROR NAME=======>");
              //console.log(event?.type);              // "error"
              //console.log(event.error?.name);       // "SecurityError"
              //console.log(event.error?.constructor?.name); // "DOMException"
              const isResourceError =
                event.target &&
                event.target !== window &&
                event.target.tagName;
            
              if (isResourceError) {
                reportPreviewDiagnostic({
                  source: "preview",
                  severity: "error",
                  type: "resource",
                  message: \`Failed to load \${event.target.tagName.toLowerCase()} resource.\`,
                  stack: null,
                  location: {
                    file: "Component.html",
                    line: null,
                    column: null,
                  },
                  metadata: {
                    tagName: event.target.tagName,
                    source:
                      event.target.src ??
                      event.target.href ??
                      null,
                  },
                });
              
                return;
              }
            let type ="";
            if(event.error?.name == 'SyntaxError'){
              type = "syntax";
            }else if(event.error?.name == 'SecurityError'){
              type = "security";
            }else {
              type = "runtime";
            }
              reportPreviewDiagnostic({
                source: "preview",
                severity: "error",
                type: type,
                message:
                  event.message ||
                  "Unhandled runtime error.",
                stack: event.error?.stack ?? null,
                location: {
                  file: "Component.js",
                  line: event.lineno ?? null,
                  column: event.colno ?? null,
                },
                metadata: {},
              });
            },
            true,
          );
          // REPORT UNHANDLED PROMISE REJECTIONS
          window.addEventListener("unhandledrejection", (event) => {
            const reason = event.reason;
          
            reportPreviewDiagnostic({
              source: "preview",
              severity: "error",
              type: "promise",
              message:
                reason instanceof Error
                  ? reason.message
                  : String(reason),
              stack:
                reason instanceof Error
                  ? reason.stack ?? null
                  : null,
              location: {
                file: "Component.js",
                line: null,
                column: null,
              },
              metadata: {
                reason:
                  reason instanceof Error
                    ? null
                    : serializeConsoleValue(reason),
              },
            });
          });
          //STORE ORIGINAL CONSOLE FUNCTIONS
          const originalConsoleLog = console.log;
          const originalConsoleWarn = console.warn;
          const originalConsoleInfo = console.info;
          const originalConsoleError = console.error;

          //WRAP ORIGINAL LOG WITH NEW IMPLEMENTATION
          console.log = (...args)=>{
            originalConsoleLog(...args);

            reportConsoleMessage(
              "log",
              "info",
              args,
            );
          };
          //WRAP ORIGINAL WARN WITH NEW IMPLEMENTATION
          console.warn = (...args)=>{
            originalConsoleWarn(...args);

            reportConsoleMessage(
              "warn",
              "warning",
              args,
            );
          };
          //WRAP ORIGINAL INFO WITH NEW IMPLEMENTATION
          console.info = (...args)=>{
            originalConsoleInfo(...args);

            reportConsoleMessage(
              "info",
              "info",
              args,
            );
          };
          //WRAP ORIGINAL ERROR WITH NEW IMPLEMENTATION
          console.error = (...args)=>{
            originalConsoleError(...args);

            reportConsoleMessage(
              "error",
              "error",
              args,
            );
          };
        </script>

        <!-- Generated component code -->
        <script>
          ${component.js};
        </script>
      </body>
    </html>`;
  return constructedBundleDocument;
}
