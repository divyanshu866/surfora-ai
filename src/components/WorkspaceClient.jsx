"use client";

import Editor from "@/components/Editor";
import Console from "@/components/Console";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import WebBundleIFrame from "@/components/Preview/WebBundleIFrame";
import ReactIFrame from "./Preview/ReactIFrame";

const getIsMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767px)").matches;

const WorkspaceClient = ({ user }) => {
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    function handleResize() {
      const mediaQuery = window.matchMedia("(max-width: 767px)");
      const updateIsMobile = (event) => setIsMobile(event.matches);

      setIsMobile(mediaQuery.matches);
      mediaQuery.addEventListener("change", updateIsMobile);
      return () => mediaQuery.removeEventListener("change", updateIsMobile);
    }
    handleResize();
  }, []);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 bg-transparent overflow-hidden relative">
      <Sidebar />
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-transparent">
        <div className="relative flex min-h-0 flex-1 justify-start bg-transparent">
          <Editor user={user} isMobile={isMobile} />
          <WebBundleIFrame isMobile={isMobile} />
          <ReactIFrame isMobile={isMobile} />
        </div>
        <Console />
      </div>
    </div>
  );
};

export default WorkspaceClient;
