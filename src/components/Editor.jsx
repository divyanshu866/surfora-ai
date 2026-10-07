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
    activeComponentIndex,
    activeEditor,
    setActiveEditor,
    isMaximised,
    setIsMaximised,
    reworkUI,
    setReworkUI,
    isGenerating,
    setActiveMessages,
    setActiveComponentIndex,
    targetTech,
    setTargetTech,
  } = useEditorContext();

  useEffect(() => {
    if (isMobile) {
      setShowPreview(false);
    }
  }, [activeEditor]);

  const { consoleLogs, setConsoleLogs } = useConsole();

  useEffect(() => {
    if (activeComponentIndex != null && components[activeComponentIndex]) {
      console.log("compIndex", activeComponentIndex);
      const c = components[activeComponentIndex];

      setActiveComponent({
        id: c.id,
        messages: c.prompts ?? [],
        name: c.name ?? "",
        targetTech: c.targetTech,
        jsx: c.jsx ?? "",
        html: c.html ?? "",
        css: c.css ?? "",
        js: c.js ?? "",
      });
      setTargetTech(c.targetTech);
      setConsoleLogs([]);

      updatePreview(c);
    }
  }, [activeComponentIndex]);

  // Add keyboard shortcut for Cmd/Ctrl + S
  useEffect(() => {
    const updatedComponent = {
      id: activeComponent.id,
      name: activeComponent.name ?? "",
      messages: [],
      html: activeComponent.html ?? "",
      css: activeComponent.css ?? "",
      js: activeComponent.js ?? "",
      jsx: activeComponent.jsx ?? "",
      targetTech: targetTech,
    };
    const handleSaveShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        setShowPreview(true);

        e.preventDefault(); // Prevent default browser "Save page"
        console.log("Preview updated via Cmd/Ctrl + S");
        setConsoleLogs([]);
        updatePreview(activeComponent);
        //Previously msessages:[]
        saveComponent(updatedComponent);
        setReworkUI(true);
      }
    };

    window.addEventListener("keydown", handleSaveShortcut);
    return () => window.removeEventListener("keydown", handleSaveShortcut);
  }, [activeComponent]); // Re-bind when component changes

  // Add keyboard shortcut for Cmd/Ctrl + K
  useEffect(() => {
    const handleNewComponentShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();

        if (isGenerating) return;

        setShowPreview(false);
        setActiveMessages([]);
        setReworkUI(false);
        setActiveComponentIndex(null);
        setSelectedVisualStyle("Custom style");
        setActiveComponent({
          id: "",
          messages: [],
          name: "",
          targetTech: targetTech,
          jsx: "",
          html: "",
          css: "",
          js: "",
        });
        setActiveEditor("AI");
        setConsoleLogs([]);
        updatePreview();

        console.log("New Project");
      }
    };

    window.addEventListener("keydown", handleNewComponentShortcut);

    return () => {
      window.removeEventListener("keydown", handleNewComponentShortcut);
    };
  }, [isGenerating, activeComponent]);

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
          activeComponentIndex={activeComponentIndex}
          reworkUI={reworkUI}
          setShowPreview={setShowPreview}
          showPreview={showPreview}
        />
        {/* AI Editor */}
        <AIEditor user={user} isMobile={isMobile} activeEditor={activeEditor} />
        {/* Editors */}
        {targetTech === "REACT" && (
          <div
            className={`${
              activeEditor == "JSX" ? "" : "hidden"
            } relative flex h-full flex-1 flex-col overflow-hidden py-4`}
          >
            <div className="h-0 flex-1">
              <ComponentEditor
                code={activeComponent.jsx}
                onChange={(val) =>
                  setActiveComponent((prev) => ({ ...prev, jsx: val }))
                }
                language="jsx"
              />
            </div>
          </div>
        )}
        {targetTech === "HTML" && (
          <div
            className={`${
              activeEditor == "HTML" ? "" : "hidden"
            } relative flex h-full flex-1 flex-col overflow-hidden py-4`}
          >
            <div className="h-0 flex-1">
              <ComponentEditor
                code={activeComponent.html}
                onChange={(val) =>
                  setActiveComponent((prev) => ({ ...prev, html: val }))
                }
                language="html"
              />
            </div>
          </div>
        )}
        <div
          className={`${
            activeEditor == "CSS" ? "" : "hidden"
          } flex h-full flex-1 flex-col overflow-hidden py-4`}
        >
          <div className="h-0 flex-1">
            <ComponentEditor
              code={activeComponent.css}
              onChange={(val) =>
                setActiveComponent((prev) => ({ ...prev, css: val }))
              }
              language="css"
            />
          </div>
        </div>
        {targetTech === "HTML" && (
          <div
            className={`${
              activeEditor == "JS" ? "" : "hidden"
            } flex h-full flex-1 flex-col overflow-hidden py-4`}
          >
            <div className="h-0 flex-1">
              <ComponentEditor
                code={activeComponent.js}
                onChange={(val) =>
                  setActiveComponent((prev) => ({ ...prev, js: val }))
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
