"use client";

import { X } from "lucide-react";

export default function CheckoutModal({ open, onClose, session, billing }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-[24px] border border-white/[0.10] bg-[#0b0b0e] shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-200/55">Secure checkout</div>
            <h2 id="checkout-title" className="mt-1 text-base font-medium text-white">Upgrade to Pro</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="grid h-8 w-8 place-items-center rounded-lg text-white/35 transition hover:bg-white/[0.05] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-xl border border-violet-300/10 bg-violet-300/[0.035] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/75">Pro</span>
              <span className="text-sm font-semibold text-white">
                {billing === "yearly" ? "$192/year" : "$20/month"}
              </span>
            </div>
            <div className="mt-1 text-[10px] text-white/30">
              {billing === "yearly" ? "Billed annually · $16/month effective" : "Billed monthly"}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 text-xs text-white/35">
            Mount your existing payment checkout here. Keep payment-session creation on the server.
          </div>

          <div className="mt-4 text-[10px] text-white/22">
            Signed in as {session?.user?.email || session?.user?.name || "your account"}
          </div>
        </div>
      </div>
    </div>
  );
}
