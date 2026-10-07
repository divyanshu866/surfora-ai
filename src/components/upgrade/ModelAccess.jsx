const MODEL_ACCESS = [
  { name: "GPT-6 Luna", description: "Fast & efficient", effort: "Low · Medium · High · XHigh · Max", accent: "violet" },
  { name: "GPT-6 Sol", description: "Advanced reasoning", effort: "Low · Medium · High · XHigh · Max", accent: "fuchsia" },
  { name: "Gemini 3.8 Flash", description: "Fast multimodal", effort: "Pro access", accent: "blue" },
  { name: "GLM 5.3 Flash", description: "Fast generation", effort: "Available", accent: "emerald" },
];

const ACCENT_CLASSES = {
  violet: "bg-violet-300",
  fuchsia: "bg-fuchsia-300",
  blue: "bg-blue-300",
  emerald: "bg-emerald-300",
};

export default function ModelAccess() {
  return (
    <section className="mx-auto mt-7 max-w-6xl rounded-[24px] border border-white/[0.06] bg-white/[0.012] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/24">Pro model access</div>
          <h3 className="mt-2 text-lg font-medium tracking-[-0.03em] text-white/75">Choose the model that fits the work.</h3>
        </div>
        <div className="text-[10px] text-white/24">Availability follows your plan configuration.</div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {MODEL_ACCESS.map((model) => (
          <div key={model.name} className="group rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4 transition hover:border-white/[0.11] hover:bg-white/[0.025]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-white/65">{model.name}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${ACCENT_CLASSES[model.accent]}`} />
            </div>
            <p className="mt-2 text-[10px] text-white/30">{model.description}</p>
            <div className="mt-4 rounded-lg border border-white/[0.05] bg-black/20 px-2.5 py-2 text-[9px] text-white/32">{model.effort}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
