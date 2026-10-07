"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { buildReactPreviewDocument } from "@/components/Preview/reactRuntime";
import { buildwebBundleDocument } from "@/components/Preview/webBundleRuntime";
import { DEFAULT_JSX, EMPTY_JSX } from "@/components/Preview/defaults";
import { useConsole } from "./ConsoleContext";
const EditorContext = createContext();

export function EditorProvider({ children }) {
  const { appendConsoleLog, setConsoleLogs } = useConsole();
  const [selectedVisualStyle, setSelectedVisualStyle] =
    useState("Custom style");
  const [activeEditor, setActiveEditor] = useState("AI");
  const [targetTech, setTargetTech] = useState("REACT");
  const [generationUsage, setGenerationUsage] = useState(null);
  const [generationLimitModalOpen, setGenerationLimitModalOpen] =
    useState(false);
  const [components, setComponents] = useState([]);
  const [reworkUI, setReworkUI] = useState(false);

  const [activeComponent, setActiveComponent] = useState({
    id: "",
    messages: [],
    name: "",
    targetTech: "HTML",
    html: "",
    css: "",
    js: "",
    jsx: EMPTY_JSX,
  });
  const [activeComponentIndex, setActiveComponentIndex] = useState(null);

  const [activeMessages, setActiveMessages] = useState([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [isMaximised, setIsMaximised] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [changeDesc, setChangeDesc] = useState("");

  //EsBuild
  const [previewKey, setPreviewKey] = useState(0);

  const [isSaving, setIsSaving] = useState(false);
  const [htmlPreviewDocument, setHtmlPreviewDocument] = useState("");

  const [reactPreviewDocument, setReactPreviewDocument] = useState("");

  const saveComponent = async (component) => {
    if (!component?.name?.trim()) {
      component.name = "New Project";
    }
    const payload = {
      id: component?.id ?? "",
      messages: Array.isArray(component?.messages) ? component.messages : [],
      name: String(component?.name ?? ""),
      html: String(component?.html ?? ""),
      css: String(component?.css ?? ""),
      js: String(component?.js ?? ""),
      jsx: String(component?.jsx ?? ""),
      targetTech: component?.targetTech ?? "REACT",
      usageMetadata: component?.usageMetadata ?? null,
      model: component?.model?.value ?? "",
      effort: component?.effort ?? "",
    };
    // Is New Component generation?
    if (!component?.id) {
      const res = await fetch("/api/components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      setActiveMessages(created?.prompts || []);
      setComponents((prev) => [created, ...prev]);
      setActiveComponentIndex(0);
      setActiveComponent({
        id: created.id,
        messages: created.prompts || [],
        name: created.name,
        targetTech: created.targetTech,
        html: created.html,
        css: created.css,
        js: created.js,
        jsx: created.jsx,
      });
    } else {
      // Update existing component
      const res = await fetch(`/api/components/${component.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setComponents((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c)),
      );

      setActiveComponent({
        id: updated.id,
        messages: updated.prompts || [],
        name: updated.name,
        html: updated.html,
        css: updated.css,
        js: updated.js,
        targetTech: updated.targetTech,
        jsx: updated.jsx,
      });
      setActiveMessages(updated?.prompts || []);
    }
  };
  const updatePreview = async (
    component = {
      id: "",
      name: "",
      html: "",
      css: "",
      js: "",
      jsx: "",
      targetTech: targetTech,
    },
  ) => {
    if (component.targetTech === "HTML") {
      //CLEAR REACT PREVIEW
      setReactPreviewDocument("");
      const document = await buildwebBundleDocument(component);
      setHtmlPreviewDocument(document);
    }

    if (component.targetTech === "REACT") {
      try {
        //CLEAR WEB BUNDLE PREVIEW
        setHtmlPreviewDocument("");
        const document = await buildReactPreviewDocument(component);
        setReactPreviewDocument(document);
      } catch (errors) {
        console.log("AGNOSTIC ERROR LIST========>");
        console.dir(errors.diagnostics, { depth: null });

        //append errors
        appendConsoleLog(errors.diagnostics);
      }
    }

    // setPreviewKey((prev) => prev + 1);
  };

  return (
    <EditorContext.Provider
      value={{
        selectedVisualStyle,
        setSelectedVisualStyle,
        activeEditor,
        activeMessages,
        setActiveMessages,
        setActiveEditor,
        activeComponent,
        setActiveComponent,
        htmlPreviewDocument,
        setHtmlPreviewDocument,
        reactPreviewDocument,
        setReactPreviewDocument,
        previewKey,
        setPreviewKey,
        updatePreview,
        sidebarCollapsed,
        setSidebarCollapsed,
        components,
        setComponents,
        activeComponentIndex,
        setActiveComponentIndex,
        changeDesc,
        setChangeDesc,
        isGenerating,
        setIsGenerating,
        isGeneratingCode,
        setIsGeneratingCode,
        showPreview,
        setShowPreview,
        saveComponent,

        isSaving,
        setIsSaving,
        isMaximised,
        setIsMaximised,
        reworkUI,
        setReworkUI,
        targetTech,
        setTargetTech,
        generationUsage,
        setGenerationUsage,
        generationLimitModalOpen,
        setGenerationLimitModalOpen,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export const useEditorContext = () => useContext(EditorContext);
