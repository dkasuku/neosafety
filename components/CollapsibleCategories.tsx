"use client";

import { useState } from "react";
import { ChevronDown } from "./icons";

export default function CollapsibleCategories({
  title = "Categories",
  defaultOpen = true,
  children,
}: {
  title?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
        aria-expanded={open}
      >
        <h3 className="font-display text-sm font-bold uppercase tracking-wide text-navy">
          {title}
        </h3>
        <ChevronDown
          className={`h-4 w-4 text-navy transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div className={open ? "mt-3 block" : "hidden"}>{children}</div>
    </div>
  );
}
