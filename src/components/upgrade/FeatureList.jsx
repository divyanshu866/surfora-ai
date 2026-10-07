import { Check } from "lucide-react";

export default function FeatureList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-white/[0.045] text-white/45">
            <Check className="h-2.5 w-2.5" strokeWidth={2.4} />
          </span>
          <span className="text-sm leading-5 text-white/40">{item}</span>
        </div>
      ))}
    </div>
  );
}
