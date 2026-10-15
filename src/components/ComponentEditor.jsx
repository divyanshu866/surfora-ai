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

  const handleEditorWillMount = useCallback((monaco) => {
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      allowJs: true,
      allowNonTsExtensions: true,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    });
  }, []);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;

    emmetMonaco.emmetHTML(monaco);
    emmetMonaco.emmetCSS(monaco);

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
        theme="vs-dark"
        onChange={handleEditorChange}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: "on",
          scrollBeyondLastLine: false,
          autoClosingBrackets: true,
          formatOnPaste: true,
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
