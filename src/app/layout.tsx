import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SurforaAI",
  description: "The AI-first frontend development platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full dark" lang="en">
      <body
        className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {/* Background ─ drifting radial orbs */}
        {/* <AnimatedBackdrop /> */}
        <div
          className="fixed inset-0 pointer-events-none bg-black/70"
          style={{ zIndex: 0 }}
        ></div>

        {children}
      </body>
    </html>
  );
}
