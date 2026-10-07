// app/workspace/layout.tsx
"use client";
import { ConsoleProvider } from "@/context/ConsoleContext";
import { EditorProvider } from "@/context/EditorContext";
import { SaveProvider } from "@/context/SaveContext";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConsoleProvider>
      <EditorProvider>
        <SaveProvider>
          <main className="w-full h-full flex flex-col">
            {/* <AnimatedBackdrop /> */}
            {/* <div className="pointer-events-none absolute top-0 left-0 inset-0 bg-[radial-gradient(ellipse_72%_58%_at_50%_43%,rgba(124,58,237,0.15)_0%,rgba(124,58,237,0.09)_28%,rgba(124,58,237,0.035)_52%,transparent_76%),radial-gradient(ellipse_38%_32%_at_18%_78%,rgba(217,70,239,0.055)_0%,transparent_72%),radial-gradient(ellipse_38%_32%_at_84%_18%,rgba(99,102,241,0.05)_0%,transparent_72%)]" /> */}
            <div
              className="fixed inset-0 pointer-events-none bg-backgroundDark"
              style={{ zIndex: 0 }}
            >
              <div className="pointer-events-none absolute top-0 left-0 inset-0 bg-[radial-gradient(ellipse_72%_58%_at_50%_43%,rgba(124,58,237,0.15)_0%,rgba(124,58,237,0.09)_28%,rgba(124,58,237,0.035)_52%,transparent_76%),radial-gradient(ellipse_38%_32%_at_18%_78%,rgba(217,70,239,0.055)_0%,transparent_72%),radial-gradient(ellipse_38%_32%_at_84%_18%,rgba(99,102,241,0.05)_0%,transparent_72%)]" />
            </div>
            <div className="h-full w-full flex flex-col">{children}</div>
          </main>
        </SaveProvider>
      </EditorProvider>
    </ConsoleProvider>
  );
}
