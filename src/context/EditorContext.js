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
  //Sidebar
  const [components, setComponents] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [activeMessages, setActiveMessages] = useState([]);
  const [reworkUI, setReworkUI] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [changeDesc, setChangeDesc] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  //EsBuild
  const [htmlPreviewDocument, setHtmlPreviewDocument] = useState("");
  const [reactPreviewDocument, setReactPreviewDocument] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isMaximised, setIsMaximised] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const [activeComponentId, setActiveComponentId] = useState(null);

  function sortComponents(items) {
    return [...items].sort((a, b) => {
      const aTime = Date.parse(a.updatedAt ?? "") || 0;
      const bTime = Date.parse(b.updatedAt ?? "") || 0;

      return bTime - aTime || Number(b.id) - Number(a.id);
    });
  }

  function upsertComponent(savedComponent) {
    if (savedComponent?.id == null) {
      throw new Error("Cannot update the list without a component ID.");
    }

    setComponents((previous) =>
      sortComponents([
        ...previous.filter(
          (component) => String(component.id) !== String(savedComponent.id),
        ),
        savedComponent,
      ]),
    );
  }
  const saveComponent = async (component) => {
    const isNew = component?.id == null || component.id === "";

    const payload = {
      id: component?.id ?? "",
      messages: Array.isArray(component?.messages) ? component.messages : [],
      name: String(component?.name ?? "").trim() || "New Project",
      html: String(component?.html ?? ""),
      css: String(component?.css ?? ""),
      js: String(component?.js ?? ""),
      jsx: String(component?.jsx ?? ""),
      targetTech: component?.targetTech ?? "REACT",
      usageMetadata: component?.usageMetadata ?? null,
      model: component?.model?.value ?? "",
      effort: component?.effort ?? "",
    };

    setIsSaving(true);

    try {
      const res = await fetch(
        isNew ? "/api/components" : `/api/components/${component.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const saved = await res.json();

      if (!res.ok) {
        throw new Error(
          saved?.error || `Failed to save component (${res.status}).`,
        );
      }

      if (saved?.id == null || !saved.updatedAt) {
        throw new Error(
          "The server response is missing the component ID or updatedAt.",
        );
      }

      // Store the COMPLETE API response in the sidebar list.
      upsertComponent(saved);

      // Update the editor using its expected state shape.
      const editorComponent = {
        id: saved.id,
        messages: saved.prompts || [],
        name: saved.name,
        targetTech: saved.targetTech,
        html: saved.html,
        css: saved.css,
        js: saved.js,
        jsx: saved.jsx,
      };

      setActiveComponent(editorComponent);
      setActiveMessages(saved.prompts || []);

      // Selection will be made ID-based below.
      setActiveComponentId(saved.id);

      return saved;
    } finally {
      setIsSaving(false);
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
        activeComponentId,
        setActiveComponentId,
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
