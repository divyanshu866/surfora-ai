// ComponentEditor.tsx
"use client";

import React, { useCallback, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as emmetMonaco from "emmet-monaco-es";
import { useEditorContext } from "@/context/EditorContext";

import "@/styles/editor.css";

export default function ComponentEditor({
  code,
  onChange,
  language,
  externalRevision,
}) {
  const { isGenerating } = useEditorContext();
  const editorRef = useRef(null);
  const latestCodeRef = useRef(code ?? "");
  const lastAppliedRevisionRef = useRef(externalRevision);
  const [isEmpty, setIsEmpty] = React.useState(!(code ?? ""));

  // latestCodeRef.current = code ?? "";

  const editorLanguage = language === "jsx" ? "javascript" : language;
  function registerReactSnippets(monaco) {
    const languages = ["javascript", "typescript"];

    const snippets = [
      {
        label: "rafce",
        detail: "React arrow function component with default export",
        insertText: [
          "import React from 'react';",
          "",
          "const ${1:ComponentName} = () => {",
          "  return (",
          "    <div>",
          "      $0",
          "    </div>",
          "  );",
          "};",
          "",
          "export default ${1:ComponentName};",
        ].join("\n"),
      },
      {
        label: "rfce",
        detail: "React function component with default export",
        insertText: [
          "import React from 'react';",
          "",
          "function ${1:ComponentName}() {",
          "  return (",
          "    <div>",
          "      $0",
          "    </div>",
          "  );",
          "}",
          "",
          "export default ${1:ComponentName};",
        ].join("\n"),
      },
      {
        label: "rfc",
        detail: "React function component",
        insertText: [
          "function ${1:ComponentName}() {",
          "  return (",
          "    <div>",
          "      $0",
          "    </div>",
          "  );",
          "}",
        ].join("\n"),
      },
      {
        label: "clg",
        detail: "Console log",
        insertText: "console.log(${1:value});$0",
      },
    ];

    return languages.map((language) =>
      monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems(model, position) {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          return {
            suggestions: snippets.map((snippet) => ({
              label: snippet.label,
              detail: snippet.detail,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: snippet.insertText,
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              range,
            })),
          };
        },
      }),
    );
  }
  const handleEditorWillMount = useCallback((monaco) => {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      allowJs: true,
      allowNonTsExtensions: true,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    });
    monaco.editor.defineTheme("surfora-dark", {
      base: "vs-dark",
      inherit: true,

      rules: [
        // Identifiers and variables
        { token: "identifier.js", foreground: "9CDCFE" },
        { token: "identifier.ts", foreground: "9CDCFE" },
        { token: "identifier", foreground: "9CDCFE" },

        // Functions, where the tokenizer identifies them
        { token: "function", foreground: "DCDCAA" },
        { token: "identifier.function", foreground: "DCDCAA" },

        // Types and predefined identifiers
        { token: "type.identifier", foreground: "4EC9B0" },
        { token: "predefined", foreground: "4EC9B0" },
      ],
      colors: {
        "editor.background": "#09090B",
        "editor.foreground": "#D4D4D4",
        "editorCursor.foreground": "#AEAFAD",
        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#C6C6C6",
        "editor.selectionBackground": "#264F78",
      },
    });

    emmetMonaco.emmetHTML(monaco, ["html"]);
    emmetMonaco.emmetCSS(monaco, ["css"]);
    emmetMonaco.emmetJSX(monaco, ["javascript", "typescript"]);
    emmetMonaco.emmetHTML(monaco, ["html"]);
    emmetMonaco.emmetCSS(monaco, ["css"]);
    emmetMonaco.emmetJSX(monaco, ["javascript", "typescript"]);
  }, []);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    registerReactSnippets(monaco);
    // A project may have changed while Monaco was still mounting.
    const incomingCode = latestCodeRef.current;
    if (editor.getValue() !== incomingCode) {
      editor.setValue(incomingCode);
    }
    setIsEmpty(!incomingCode);
  }, []);

  const handleEditorChange = useCallback(
    (value) => {
      const nextValue = value ?? "";
      setIsEmpty(!nextValue);
      onChange(nextValue);
    },
    [onChange],
  );

  useEffect(() => {
    if (lastAppliedRevisionRef.current === externalRevision) return;
    lastAppliedRevisionRef.current = externalRevision;

    const editor = editorRef.current;
    if (!editor) return;

    const incomingCode = code ?? "";

    // Never replace Monaco's model with identical text. In particular,
    // ordinary keystrokes do not enter this external-update path.
    if (editor.getValue() !== incomingCode) {
      editor.setValue(incomingCode);
    }
    setIsEmpty(!incomingCode);
  }, [code, externalRevision]);

  return (
    <div className="relative flex h-full items-center justify-center bg-[#070708]">
      <Editor
        height="100%"
        defaultLanguage={editorLanguage}
        defaultValue={code ?? ""}
        theme="surfora-dark"
        onChange={handleEditorChange}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 16,
          fontFamily: "'Cascadia Code', Consolas, monospace",
          lineHeight: 22,
          fontLigatures: true,

          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: "on",
          scrollBeyondLastLine: false,

          lineNumbers: "on",
          lineNumbersMinChars: 3,
          renderLineHighlight: "all",
          renderWhitespace: "selection",

          cursorStyle: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,

          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true,
            highlightActiveIndentation: true,
          },

          padding: { top: 14, bottom: 14 },
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            useShadows: false,
          },

          autoClosingBrackets: true,
          formatOnPaste: true,
          suggestOnTriggerCharacters: true,
          tabCompletion: "on",
        }}
      />
      {isEmpty && (
        <img
          src={`${language}.svg`}
          alt=""
          className="absolute max-h-45 max-w-45 h-full w-full p-5 opacity-30"
        />
      )}
    </div>
  );
}
