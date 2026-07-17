"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "./icons";
import { categories } from "@/lib/data";

export default function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (cat) params.set("cat", cat);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className={className}>
      <div className="flex h-12 w-full items-stretch overflow-hidden rounded-md border border-slate-300 focus-within:border-green">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          type="text"
          placeholder="Search for products..."
          className="min-w-0 flex-1 px-4 text-sm outline-none placeholder:text-slate-400"
        />
        <div className="relative hidden items-center border-l border-slate-300 sm:flex">
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="h-full appearance-none bg-transparent pl-3 pr-8 text-sm text-navy/80 outline-none"
            aria-label="Category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-navy/60" />
        </div>
        <button type="submit" aria-label="Search" className="flex items-center justify-center bg-green px-5 text-white hover:bg-green-dark">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
