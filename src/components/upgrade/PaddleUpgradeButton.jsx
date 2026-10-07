"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { openProCheckout } from "@/lib/paddle/client";

export function PaddleUpgradeButton({ userId, yearly }) {
  const [opening, setOpening] = useState(false);

  const handleUpgrade = async () => {
    if (opening) return;

    setOpening(true);

    try {
      await openProCheckout(userId, yearly);
    } catch (error) {
      console.error("Paddle checkout failed:", error);
    } finally {
      setOpening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleUpgrade}
      disabled={opening}
      className="group mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black shadow-[0_18px_50px_rgba(255,255,255,0.07)] transition hover:bg-violet-100 active:scale-[0.995]"
    >
      <span className="flex items-center gap-2">
        {opening ? "Loading checkout…" : "Upgrade to Pro"}

        {!opening && (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        )}
      </span>
    </button>
  );
}
