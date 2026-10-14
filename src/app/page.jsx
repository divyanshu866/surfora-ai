"use client";
import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import TheIdea from "../components/Landing/TheIdea";
import UseCases from "../components/Landing/UseCases";
import TheWhy from "../components/Landing/TheWhy";
import ModelsAndCredits from "../components/Landing/ModelsAndCredits";
import Pricing from "../components/Landing/Pricing";
import Start from "../components/Landing/Start";
import Footer from "../components/Landing/Footer";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent text-white selection:bg-violet-500/30 selection:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-70 [background-image:radial-gradient(rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
      />

      <Navbar />

      <Hero />
      <TheIdea />
      <UseCases />
      <TheWhy />
      <ModelsAndCredits />
      <Pricing />
      <Start />
      <Footer />
    </main>
  );
}
