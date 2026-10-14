import * as esbuild from "esbuild-wasm/esm/browser.js";
import { SERIALIZE_CONSOLE_VALUE_SOURCE } from "@/components/Preview/consoleSerializer";
import { DEFAULT_JSX } from "@/components/Preview/defaults";

const SUPPORTED_REACT_DEPENDENCIES = {
  prefixes: {
    // Icons
    "@heroicons/react/": "https://esm.sh/@heroicons/react/",
    // Carousels
    "swiper/": "https://esm.sh/swiper/",
    "@daypicker/": "https://esm.sh/@daypicker/",

    //Animation
    three: "https://esm.sh/three/",
    motion: "https://esm.sh/motion/",
    next: "https://esm.sh/next/",
    "@shippedkit": "https://esm.sh/@shippedkit/",

    // React
    react: "https://esm.sh/react@19/",

    // Icons
    "lucide-react": "https://esm.sh/lucide-react/",

    // Animation
    "framer-motion": "https://esm.sh/framer-motion/",
    motion: "https://esm.sh/motion/",
    "canvas-confetti": "https://esm.sh/canvas-confetti/",

    // Charts / data visualization
    recharts: "https://esm.sh/recharts/",
    "react-chartjs-2": "https://esm.sh/react-chartjs-2/",
    "chart.js": "https://esm.sh/chart.js/",

    // Dates
    "date-fns": "https://esm.sh/date-fns/",
    dayjs: "https://esm.sh/dayjs/",

    // Forms / validation
    "react-hook-form": "https://esm.sh/react-hook-form/",
    zod: "https://esm.sh/zod/",

    // HTTP / data
    axios: "https://esm.sh/axios/",

    // Markdown
    "react-markdown": "https://esm.sh/react-markdown/",

    // Utilities
    clsx: "https://esm.sh/clsx/",
    "tailwind-merge": "https://esm.sh/tailwind-merge/",

    // UI primitives
    "@radix-ui/react-dialog":
      "https://esm.sh/@radix-ui/react-dialog?external=react/",
    "@radix-ui/react-dropdown-menu":
      "https://esm.sh/@radix-ui/react-dropdown-menu?external=react/",
    "@radix-ui/react-tabs":
      "https://esm.sh/@radix-ui/react-tabs?external=react/",
    "@radix-ui/react-tooltip":
      "https://esm.sh/@radix-ui/react-tooltip?external=react/",
    "@radix-ui/react-popover":
      "https://esm.sh/@radix-ui/react-popover?external=react/",
    "@radix-ui/react-select":
      "https://esm.sh/@radix-ui/react-select?external=react/",
    "@radix-ui/react-checkbox":
      "https://esm.sh/@radix-ui/react-checkbox?external=react/",
    "@radix-ui/react-switch":
      "https://esm.sh/@radix-ui/react-switch?external=react/",
    "@headlessui/react": "https://esm.sh/@headlessui/react?external=react/",

    // Positioning / interaction
    "@floating-ui/react": "https://esm.sh/@floating-ui/react/",

    // Notifications
    sonner: "https://esm.sh/sonner?external=react/",

    // Drag & drop
    "@dnd-kit/core": "https://esm.sh/@dnd-kit/core/",
    "@dnd-kit/sortable": "https://esm.sh/@dnd-kit/sortable/",

    //TIER 2

    // Data / server state
    "@tanstack/react-query": "https://esm.sh/@tanstack/react-query/",
    "@tanstack/react-table": "https://esm.sh/@tanstack/react-table@8.21.3/",
    "@tanstack/react-virtual": "https://esm.sh/@tanstack/react-virtual/",
    "react-aria-components":
      "https://esm.sh/react-aria-components@1.20.0?external=react/",

    // Routing
    "react-router": "https://esm.sh/react-router/",

    // Layout / interaction
    "react-resizable-panels": "https://esm.sh/react-resizable-panels/",
    "react-intersection-observer":
      "https://esm.sh/react-intersection-observer/",
    "react-use": "https://esm.sh/react-use/",
    "embla-carousel-react":
      "https://esm.sh/embla-carousel-react?external=react/",
    "react-dropzone": "https://esm.sh/react-dropzone/",

    "react-colorful": "https://esm.sh/react-colorful/",
    "react-hotkeys-hook": "https://esm.sh/react-hotkeys-hook/",
    cmdk: "https://esm.sh/cmdk?external=react/",
    vaul: "https://esm.sh/vaul?external=react/",
    "input-otp": "https://esm.sh/input-otp?external=react/",
  },
};
const RUNTIME_DEPENDENCIES = {
  // React
  react: "https://esm.sh/react@19/",
  "react-dom/client": "https://esm.sh/react-dom@19/client/",
  "react/jsx-runtime": "https://esm.sh/react@19/jsx-runtime/",
};

// Import map shape
// const IMPORT_MAP = {
//   imports: {
//     react: "https://esm.sh/react@19",
//     "react-dom/client": "https://esm.sh/react-dom@19/client",
//     "lucide-react": "https://esm.sh/lucide-react",
//     "framer-motion": "https://esm.sh/framer-motion",
//   },
// };
let esbuildInitPromise = null;

const initializeEsbuild = async () => {
  try {
    if (!esbuildInitPromise) {
      esbuildInitPromise = esbuild.initialize({
        wasmURL: "/esbuild.wasm",
      });
    }
    await esbuildInitPromise;
  } catch (error) {
    esbuildInitPromise = null;
    const agnosticErrorList = [];
    //console.log("ESBUILD INITIALIZATION ERROR======>");
    //console.dir(error, { depth: null });

    //append all errors to list
    agnosticErrorList.push({
      source: "compiler",
      targetTech: "REACT",
      severity: "error",
      type: "infrastructure",
      message: error?.message ?? "Failed to initialize esbuild.",
      stack: error?.stack ?? null,
      location: {
        file: null,
        line: null,
        column: null,
      },
      metadata: {},
    });

    //console.log("ESBUILD INITIALIZATION AGNOSTIC_ERRORS======>");
    //console.dir(agnosticErrorList, { depth: null });
    throw new EsBuildError(agnosticErrorList);
  }
};
function isBarePackageSpecifier(specifier) {
  return !(
    specifier.startsWith(".") ||
    specifier.startsWith("/") ||
    specifier.startsWith("http://") ||
    specifier.startsWith("https://")
  );
}

const IMPORT_MAP_KINDS = new Set(["import-statement", "dynamic-import"]);

function buildImportMap(importEntries) {
  const imports = { ...RUNTIME_DEPENDENCIES };
  const agnosticErrorList = [];

  // Only include actual static and dynamic JavaScript imports.
  // Deduplicate dependencies before resolving them.
  const packageImports = [
    ...new Set(
      importEntries
        .filter(({ kind }) => IMPORT_MAP_KINDS.has(kind))
        .map(({ specifier }) => specifier)
        .filter(isBarePackageSpecifier),
    ),
  ];

  for (const specifier of packageImports) {
    const url = resolveDependency(specifier);

    if (!url) {
      agnosticErrorList.push({
        source: "dependency",
        targetTech: "REACT",
        severity: "error",
        type: "unsupported",
        message: `Unsupported ComponentLab preview dependency "${specifier}"`,
        stack: null,
        location: {
          file: "transformed component.jsx",
          line: null,
          column: null,
        },
        metadata: {
          specifier,
        },
      });
    } else {
      imports[specifier] = url;
    }
  }

  if (agnosticErrorList.length > 0) {
    throw new DependencyError(agnosticErrorList);
  }

  return { imports };
}

function resolveDependency(specifier) {
  const runtimeDependency = RUNTIME_DEPENDENCIES[specifier];

  if (runtimeDependency) {
    return runtimeDependency;
  }

  for (const [key, baseUrl] of Object.entries(
    SUPPORTED_REACT_DEPENDENCIES.prefixes,
  )) {
    // Explicit subpath mapping, e.g. @heroicons/react/24/solid
    if (key.endsWith("/") && specifier.startsWith(key)) {
      return `${baseUrl}${specifier.slice(key.length)}`;
    }

    // Exact package mapping; do not match similarly named packages.
    if (specifier === key) {
      return baseUrl.replace(/\/$/, "");
    }
  }

  // Automatically attempt other npm package imports.
  if (isBarePackageSpecifier(specifier)) {
    return `https://esm.sh/${specifier}?external=react`;
  }

  return null;
}

//Custom error
class EsBuildError extends Error {
  constructor(diagnostics) {
    super("Preview initialization failed.");
    this.name = "EsBuildError";
    this.diagnostics = diagnostics;
  }
} //Custom error
class DependencyError extends Error {
  constructor(diagnostics) {
    super("Unsupported dependency.");
    this.name = "DependencyError";
    this.diagnostics = diagnostics;
  }
}
//Custom error
class ReactCompileError extends Error {
  constructor(diagnostics) {
    super("React component compilation failed.");
    this.name = "ReactCompileError";
    this.diagnostics = diagnostics;
  }
}
export async function compileReact(jsx) {
  await initializeEsbuild();

  try {
    const result = await esbuild.build({
      stdin: {
        contents: jsx,
        sourcefile: "transformed component.jsx",
        loader: "jsx",
      },

      // Analyze imports, but preserve all imports in the output.
      bundle: true,
      external: ["*"],
      write: false,

      // Return dependency metadata alongside the compiled output.
      metafile: true,

      target: "es2020",
      format: "esm",
    });

    const outputFile = result.outputFiles?.[0];

    if (!outputFile) {
      throw new Error("esbuild did not produce compiled JavaScript.");
    }

    // With a single stdin source, there should be one input entry.
    const inputInfo = Object.values(result.metafile?.inputs ?? {})[0];

    if (!inputInfo) {
      throw new Error("esbuild did not return input import metadata.");
    }

    const imports = (inputInfo.imports ?? []).map(({ path, kind }) => ({
      specifier: path,
      kind,
    }));

    return {
      code: outputFile.text,
      imports,
    };
  } catch (error) {
    if (error instanceof ReactCompileError) {
      throw error;
    }

    const errors = Array.isArray(error?.errors) ? error.errors : [];

    const diagnostics = errors.map((item) => ({
      source: "compiler",
      targetTech: "REACT",
      severity: "error",
      type: "syntax",
      message: item.text ?? "React component compilation failed.",
      stack: null,
      location: {
        file: item.location?.file ?? "transformed component.jsx",
        line: item.location?.line ?? null,
        column: item.location?.column ?? null,
      },
      metadata: {},
    }));

    // Preserve a useful diagnostic for unexpected build failures too.
    if (diagnostics.length === 0) {
      diagnostics.push({
        source: "compiler",
        targetTech: "REACT",
        severity: "error",
        type: "compile",
        message: error?.message ?? "React component compilation failed.",
        stack: error?.stack ?? null,
        location: {
          file: "transformed component.jsx",
          line: null,
          column: null,
        },
        metadata: {},
      });
    }

    throw new ReactCompileError(diagnostics);
  }
}

export async function buildReactPreviewDocument(component) {
  const source = component.jsx === "" ? DEFAULT_JSX : component.jsx;

  const { code: compiledJsx, imports } = await compileReact(source);

  const importMap = buildImportMap(imports);
  const document = /*html*/ ` <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          html,
          body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          *,
          *::before,
          *::after {
            box-sizing: inherit;
          }

          #root {
            width: 100%;
            height: 100%;
          }
          ${component.css}
        </style>
        <script type="importmap">
          ${JSON.stringify(importMap)}
        </script>
      </head>
      <body>
        <div id="root"></div>
        <script type="module">
          // ERROR REPORTING HELPER
          function reportPreviewDiagnostic({
            source ="preview",
            severity,
            type,
            message,
            stack = null,
            location = null,
            metadata = {},
          }) {
            window.parent.postMessage(
              {
                type: "preview-diagnostics",
                diagnostics: [
                  {
                    source,
                    targetTech: "REACT",
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

          

          ${SERIALIZE_CONSOLE_VALUE_SOURCE}
          function reportConsoleMessage(method, severity, args) {
            const serializedArguments = args.map(
            (arg) => serializeConsoleValue(arg)
            
            );
          
            reportPreviewDiagnostic({
              source: "console",
              severity,
              type: method,
              message: serializedArguments
                .map((arg) => arg.preview)
                .join(" "),
              stack: null,
              location: {
                file: "Component.jsx",
                line: null,
                column: null,
              },
              metadata: {
                arguments: serializedArguments,
              },
            });
          }
          
          //Preserve original implementation
          const originalConsoleLog = console.log;
          const originalConsoleWarn = console.warn;
          const originalConsoleInfo = console.info;
          const originalConsoleError = console.error;

          //WRAP ORIGINAL LOG WITH NEW IMPLEMENTATION
          console.log = (...args) => {
            originalConsoleLog(...args);

            reportConsoleMessage(
              "log",
              "info",
              args,
            );
          };
           //WRAP ORIGINAL WARN WITH NEW IMPLEMENTATION
          console.warn = (...args) => {
            originalConsoleWarn(...args);
            
            reportConsoleMessage(
              "warn",
              "warning",
              args,
            );
          };
          //WRAP ORIGINAL INFO WITH NEW IMPLEMENTATION
          console.info = (...args) => {
            originalConsoleInfo(...args);
            
            reportConsoleMessage(
              "info",
              "info",
              args,
            );
          };
          // Declare before the console overrides
          const boundaryHandledErrors = new WeakSet();
          
          //WRAP ORIGINAL ERROR WITH NEW IMPLEMENTATION RENDER
          console.error = (...args) => {
            originalConsoleError(...args); // always log to real console immediately
          
            queueMicrotask(() => {
              // componentDidCatch runs synchronously during React's commit phase,
              // before any microtask. By the time this runs, the WeakSet is populated.
              if (args[0] instanceof Error && boundaryHandledErrors.has(args[0])) {
                return; // render error — already reported with richer context from componentDidCatch
              }
              reportConsoleMessage("error", "error", args);
            });
          };

          function extractStackLocation(stack) {
            if (!stack) {
              return {
                file: "transformed Component.jsx",
                line: null,
                column: null,
              };
            }

            const frame = stack
              .split("\\n")
              .find((line) => line.includes("(blob:"));

            if (!frame) {
              return {
                file: "transformed Component.jsx",
                line: null,
                column: null,
              };
            }

            const match = frame.match(/:(\\d+):(\\d+)\\)$/);

            if (!match) {
              return {
                file: "transformed Component.jsx",
                line: null,
                column: null,
              };
            }

            return {
              file: "transformed Component.jsx",
              line: Number(match[1]),
              column: Number(match[2]),
            };
          }
          //HANDLE UNHANELED RUNTIME ERRORS
          window.addEventListener("error", (event) => {
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
                    file: "Component.jsx",
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
              message: event.message || "Unhandled runtime error.",
              stack: event.error?.stack ?? null,
              location: extractStackLocation(event.error?.stack),
            });
          },true);

          //HANDLE UNHANELED PROMISE REJECTION ERRORS
          window.addEventListener("unhandledrejection", (event) => {
          const reason = event.reason;
          //console.log("Promise rejection event=======>", event);
          reportPreviewDiagnostic(
            {
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
            location:
              reason instanceof Error
                ? extractStackLocation(reason.stack)
                : {
                    file: "transformed Component.jsx",
                    line: null,
                    column: null,
                  },
            metadata: {
              reason: reason instanceof Error
                ? null
                : reason,
            },
          });
          });

          import { Component, createElement } from "react";
          import { createRoot } from "react-dom/client";

          //REACT RENDER ERROR BOUNDARY
          class PreviewErrorBoundry extends Component {
            constructor(props) {
              super(props);

              this.state = {
                hasError: false,
              };
            }

            static getDerivedStateFromError() {
              return {
                hasError: true,
              };
            }

            componentDidCatch(error, errorInfo) {
               boundaryHandledErrors.add(error); // mark before anything else
              //console.log("componentDidCatch ERROR=======>", error);
              //console.log("componentDidCatch ERROR_INFO=======>", errorInfo);
              try{
              reportPreviewDiagnostic({
                source: "preview",
                severity: "error",
                type: "render",
                message: error?.message || "Unhandled runtime error.",
                stack: error?.stack ?? null,
                location: extractStackLocation(errorInfo.componentStack),
                metadata: {
                  componentStack: errorInfo.componentStack ?? null,
                },
              });
            }catch(e){}
          }

            render() {
              if (this.state.hasError) {
                return null;
              }

              return this.props.children;
            }
          }

          const componentCode = ${JSON.stringify(compiledJsx)};
          const blob = new Blob([componentCode], { type: "text/javascript" });

          const componentUrl = URL.createObjectURL(blob);

          try {
            const componentModule = await import(componentUrl);
            const Component = componentModule.default;
            if (!Component) {
              throw new Error("React component must have default export.");
            }

            const root = createRoot(document.getElementById("root"));
            root.render(
              createElement(
                PreviewErrorBoundry,
                null,
                createElement(Component),
              ),
            );
          } 
          catch(error){
          //HANDLE BOOTSTRAP ERROR
          //console.log("BOOTSTRAP ERROR ==================>", error);
          reportPreviewDiagnostic({
            source: "preview",
            severity: "error",
            type: "bootstrap",
            message: error?.message ?? "Failed to initialize React preview.",
            stack: error?.stack ?? null,
            location: {
              file: null,
              line: null,
              column: null,
            },
            metadata: {},
            });
          }
           finally {
            URL.revokeObjectURL(componentUrl);
          }
        </script>
      </body>
    </html>`;
  return document;
}
