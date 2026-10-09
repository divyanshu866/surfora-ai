import { Code2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const EditorTabs = ({
  activeEditor,
  setActiveEditor,
  targetTech,
  setTargetTech,
}) => {
  const [activeEditorSpace, setActiveEditorSpace] = useState("AI");
  return (
    <div className="flex w-full bg-transparent border-b border-lightBorder p-2">
      <div className="flex ml-3 mr-auto h-full gap-2">
        <button
          onClick={() => setActiveEditorSpace("CODE")}
          className={`${
            activeEditorSpace === "CODE"
              ? "border-violet-500 text-neutral-100"
              : "border-transparent text-neutral-400"
          }  border-b flex items-center justify-center gap-2 px-5 py-3 text-sm relative  transition-all duration-100 cursor-pointer`}
        >
          <Code2 width={16} height={16} className="text-violet-400" />
          Code Editor
        </button>
        <button
          onClick={() => setActiveEditorSpace("AI")}
          className={`${
            activeEditorSpace === "AI"
              ? " border-yellow-500/50"
              : " border-lightBorder"
          } h-full text-yellow-300 flex items-center justify-center gap-2 px-6 py-2 text-sm font-medium border rounded-full dark:bg-transparent relative  transition-all duration-100 cursor-pointer`}
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          AI
        </button>
      </div>
    </div>
  );
};

export default EditorTabs;
