// Editor.jsx
"use client";

import React, { useEffect, useRef } from "react";
import ComponentEditor from "@/components/ComponentEditor";
import AIEditorTabs from "@/components/AIEditorTabs";
import AIEditor from "@/components/AIEditor";
import { useEditorContext } from "@/context/EditorContext";
import { useConsole } from "@/context/ConsoleContext";

const Editor = ({ user, isMobile }) => {
  const {
    setSelectedVisualStyle,
    activeComponent,
    setActiveComponent,
    setActiveComponentFromEditor,
    externalRevision,
    updatePreview,
    components,
    setShowPreview,
    showPreview,
    saveComponent,
    activeComponentId,
    setActiveComponentId,
    activeEditor,
    setActiveEditor,
    isMaximised,
    setIsMaximised,
    reworkUI,
    setReworkUI,
    isGenerating,
    setActiveMessages,
    targetTech,
    setTargetTech,
  } = useEditorContext();

  const { setConsoleLogs } = useConsole();
  const loadedSelectionRef = useRef(null);

  const selectedComponent =
    activeComponentId == null
      ? null
      : (components.find(
          (component) => String(component.id) === String(activeComponentId),
        ) ?? null);

  useEffect(() => {
    if (isMobile) {
      setShowPreview(false);
    }
  }, [activeEditor, isMobile, setShowPreview]);

  // Only a selection change loads a saved record. Replacing that record
  // in the sidebar after Save must not replace the live draft.
  useEffect(() => {
    if (activeComponentId == null) {
      loadedSelectionRef.current = null;
      return;
    }

    if (!selectedComponent) return;

    const selectionKey = String(activeComponentId);
    if (loadedSelectionRef.current === selectionKey) return;
    loadedSelectionRef.current = selectionKey;

    // A newly created project is already the active draft when Save assigns
    // its server ID; do not reload the submitted snapshot over newer typing.
    if (String(activeComponent.id) !== selectionKey) {
      setActiveComponent({
        id: selectedComponent.id,
        messages: selectedComponent.prompts ?? [],
        name: selectedComponent.name ?? "",
        targetTech: selectedComponent.targetTech,
        jsx: selectedComponent.jsx ?? "",
        html: selectedComponent.html ?? "",
        css: selectedComponent.css ?? "",
        js: selectedComponent.js ?? "",
      });
    }

    setActiveMessages(selectedComponent.prompts ?? []);
    setTargetTech(selectedComponent.targetTech);
    setConsoleLogs([]);

    // updatePreview is not memoized in EditorContext.
    void updatePreview(selectedComponent).catch((error) => {
      console.error("Failed to update the preview:", error);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeComponentId, selectedComponent]);

  useEffect(() => {
    const handleSaveShortcut = (event) => {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "s"
      ) {
        return;
      }

      event.preventDefault();

      if (isGenerating) return;

      setShowPreview(true);
      setConsoleLogs([]);

      void updatePreview(activeComponent).catch((error) => {
        console.error("Failed to update the preview:", error);
      });

      const updatedComponent = {
        id: activeComponent.id,
        name: activeComponent.name ?? "",
        messages: [],
        html: activeComponent.html ?? "",
        css: activeComponent.css ?? "",
        js: activeComponent.js ?? "",
        jsx: activeComponent.jsx ?? "",
        targetTech,
      };

      void saveComponent(updatedComponent)
        .then(() => {
          setReworkUI(true);
        })
        .catch((error) => {
          console.error("Failed to save the component:", error);
        });
    };

    window.addEventListener("keydown", handleSaveShortcut);

    return () => {
      window.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [
    activeComponent,
    targetTech,
    isGenerating,
    setShowPreview,
    setConsoleLogs,
    saveComponent,
    setReworkUI,
    updatePreview,
  ]);

  useEffect(() => {
    const handleNewComponentShortcut = (event) => {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k"
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isGenerating) return;

      setShowPreview(false);
      setActiveMessages([]);
      setReworkUI(false);
      setActiveComponentId(null);

      setSelectedVisualStyle("Custom style");
      setActiveComponent({
        id: "",
        messages: [],
        name: "",
        targetTech,
        jsx: "",
        html: "",
        css: "",
        js: "",
      });

      setActiveEditor("AI");
      setConsoleLogs([]);

      void updatePreview().catch((error) => {
        console.error("Failed to reset the preview:", error);
      });
    };

    window.addEventListener("keydown", handleNewComponentShortcut);

    return () => {
      window.removeEventListener("keydown", handleNewComponentShortcut);
    };
  }, [
    isGenerating,
    targetTech,
    setShowPreview,
    setActiveMessages,
    setReworkUI,
    setActiveComponentId,
    setSelectedVisualStyle,
    setActiveComponent,
    setActiveEditor,
    setConsoleLogs,
    updatePreview,
  ]);

  return (
    <div
      className={`${
        isMobile
          ? "absolute inset-0 z-0 h-full w-full"
          : `relative z-0 h-full min-w-0 flex-none ${
              showPreview ? "w-[65%] left-0" : "w-full"
            }`
      } ${
        isMaximised ? "hidden" : ""
      } flex flex-col border-r-0 bg-transparent dark:border-lightBorder`}
    >
      <div className="flex h-full w-full flex-col overflow-hidden border-r border-darkBorder">
        <AIEditorTabs
          activeEditor={activeEditor}
          setActiveEditor={setActiveEditor}
          targetTech={targetTech}
          setTargetTech={setTargetTech}
          activeComponentId={activeComponentId}
          reworkUI={reworkUI}
          setShowPreview={setShowPreview}
          showPreview={showPreview}
        />

        {/* AI Editor */}
        <AIEditor user={user} isMobile={isMobile} activeEditor={activeEditor} />

        {/* JSX editor */}
        {targetTech === "REACT" && (
          <div
            className={`${
              activeEditor === "JSX" ? "" : "hidden"
            } relative flex h-full flex-1 flex-col overflow-hidden py-4`}
          >
            <div className="h-0 flex-1">
              <ComponentEditor
                code={activeComponent.jsx}
                onChange={(value) => setActiveComponentFromEditor("jsx", value)}
                language="jsx"
                externalRevision={externalRevision}
              />
            </div>
          </div>
        )}

        {/* HTML editor */}
        {targetTech === "HTML" && (
          <div
            className={`${
              activeEditor === "HTML" ? "" : "hidden"
            } relative flex h-full flex-1 flex-col overflow-hidden py-4`}
          >
            <div className="h-0 flex-1">
              <ComponentEditor
                code={activeComponent.html}
                onChange={(value) =>
                  setActiveComponentFromEditor("html", value)
                }
                language="html"
                externalRevision={externalRevision}
              />
            </div>
          </div>
        )}

        {/* CSS editor */}
        <div
          className={`${
            activeEditor === "CSS" ? "" : "hidden"
          } flex h-full flex-1 flex-col overflow-hidden py-4`}
        >
          <div className="h-0 flex-1">
            <ComponentEditor
              code={activeComponent.css}
              onChange={(value) => setActiveComponentFromEditor("css", value)}
              language="css"
              externalRevision={externalRevision}
            />
          </div>
        </div>

        {/* JavaScript editor */}
        {targetTech === "HTML" && (
          <div
            className={`${
              activeEditor === "JS" ? "" : "hidden"
            } flex h-full flex-1 flex-col overflow-hidden py-4`}
          >
            <div className="h-0 flex-1">
              <ComponentEditor
                code={activeComponent.js}
                onChange={(value) => setActiveComponentFromEditor("js", value)}
                language="javascript"
                externalRevision={externalRevision}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
