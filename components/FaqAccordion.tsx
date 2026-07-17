"use client";
import { useState } from "react";

export type Faq = { q: string; a: string };

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-4">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="overflow-hidden rounded-xl border border-slate-100 shadow-card">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors ${isOpen ? "bg-navy text-white" : "bg-white text-navy hover:bg-slate-50"}`}
            >
              <span className="font-display text-base font-bold sm:text-lg">{it.q}</span>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl leading-none transition-colors ${isOpen ? "bg-green text-white" : "bg-green/10 text-green"}`}>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="bg-white px-6 py-5 leading-relaxed text-slate-brand">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
