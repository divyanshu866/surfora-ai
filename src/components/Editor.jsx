"use client";

import ComponentEditor from "@/components/ComponentEditor";
import AIEditorTabs from "@/components/AIEditorTabs";
import AIEditor from "@/components/AIEditor";
import { useEffect } from "react";
import { useEditorContext } from "@/context/EditorContext";
import { useConsole } from "@/context/ConsoleContext";

const Editor = ({ user, isMobile }) => {
  const {
    setSelectedVisualStyle,
    activeComponent,
    setActiveComponent,
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

  // Resolve the selected record by ID, never by its array position.
  // Its object reference also changes when that record is updated.
  const selectedComponent =
    activeComponentId == null
      ? null
      : (components.find(
          (component) => String(component.id) === String(activeComponentId),
        ) ?? null);

  // Hide the preview when switching editors on mobile.
  useEffect(() => {
    if (isMobile) {
      setShowPreview(false);
    }
  }, [activeEditor, isMobile, setShowPreview]);

  // Synchronize the editor and preview with the selected saved component.
  useEffect(() => {
    if (!selectedComponent) return;

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

    setActiveMessages(selectedComponent.prompts ?? []);
    setTargetTech(selectedComponent.targetTech);
    setConsoleLogs([]);

    // updatePreview is not memoized in EditorContext, so it is
    // intentionally omitted from these dependencies.
    void updatePreview(selectedComponent).catch((error) => {
      console.error("Failed to update the preview:", error);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeComponentId, selectedComponent]);

  // Cmd/Ctrl + S: update the preview and save the current component.
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

  // Cmd/Ctrl + K: start a new project.
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

      // Clear selection by ID, not by index.
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
                onChange={(value) =>
                  setActiveComponent((previous) => ({
                    ...previous,
                    jsx: value,
                  }))
                }
                language="jsx"
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
                  setActiveComponent((previous) => ({
                    ...previous,
                    html: value,
                  }))
                }
                language="html"
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
              onChange={(value) =>
                setActiveComponent((previous) => ({
                  ...previous,
                  css: value,
                }))
              }
              language="css"
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
                onChange={(value) =>
                  setActiveComponent((previous) => ({
                    ...previous,
                    js: value,
                  }))
                }
                language="javascript"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
