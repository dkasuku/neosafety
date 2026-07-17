"use client";
import Link from "next/link";
import { useState } from "react";
import { megaMenu, type MenuItem, type Category } from "@/lib/data";
import { Menu, ChevronDown, ChevronRight } from "./icons";

function DesktopNode({ item, level }: { item: MenuItem; level: number }) {
  const kids = item.children;
  return (
    <li className="menu-item relative">
      <Link
        href={item.href}
        className={
          level === 0
            ? "flex items-center gap-1 py-4 text-[13px] font-display font-semibold tracking-wide text-white/85 hover:text-green"
            : "flex items-center justify-between gap-4 px-4 py-2 text-sm text-navy/80 hover:bg-slate-50 hover:text-green"
        }
      >
        <span className="whitespace-nowrap">{item.label}</span>
        {kids && (level === 0 ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-4 w-4 shrink-0" />)}
      </Link>
      {kids && (
        <ul className={`submenu absolute z-50 min-w-[230px] rounded-md border border-slate-100 bg-white py-2 shadow-float ${level === 0 ? "left-0 top-full" : "left-full top-0"}`}>
          {kids.map((ch) => <DesktopNode key={ch.label} item={ch} level={level + 1} />)}
        </ul>
      )}
    </li>
  );
}

function MobileNode({ item, level, close }: { item: MenuItem; level: number; close: () => void }) {
  const kids = item.children;
  return (
    <li>
      <Link
        href={item.href}
        onClick={close}
        className={`block py-2 ${level === 0 ? "font-display text-sm font-semibold text-white" : "text-sm text-white/70"}`}
        style={{ paddingLeft: `${level * 14}px` }}
      >
        {item.label}
      </Link>
      {kids && <ul>{kids.map((ch) => <MobileNode key={ch.label} item={ch} level={level + 1} close={close} />)}</ul>}
    </li>
  );
}

export default function NavBar({ categories = [] }: { categories?: Category[] }) {
  const [openCats, setOpenCats] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative bg-navy text-white">
      <div className="container-x flex items-stretch justify-between">
        <div className="flex items-stretch">
          {/* Shop by category (kept) */}
          <div className="relative my-2 shrink-0" onMouseEnter={() => setOpenCats(true)} onMouseLeave={() => setOpenCats(false)}>
            <Link href="/uniforms" className="flex h-full items-center gap-2 rounded-md bg-green px-4 py-3 text-[13px] font-display font-bold tracking-wide hover:bg-green-dark">
              <Menu className="h-5 w-5" />
              <span className="whitespace-nowrap"><span className="hidden xl:inline">SHOP BY </span>CATEGORY</span>
              <ChevronDown className="h-4 w-4" />
            </Link>
            {openCats && (
              <div className="absolute left-0 top-full z-50 hidden w-[420px] grid-cols-2 gap-1 rounded-md border border-slate-100 bg-white p-2 shadow-float lg:grid">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/category/${c.slug}`} className="rounded px-3 py-2 text-sm text-navy/80 hover:bg-slate-50 hover:text-green">{c.name}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Multi-level mega menu */}
          <ul className="ml-4 hidden items-center gap-4 lg:flex xl:gap-5">
            {megaMenu.map((item) => <DesktopNode key={item.label} item={item} level={0} />)}
          </ul>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen((v) => !v)} className="my-2 flex items-center gap-2 px-3 text-sm font-semibold lg:hidden" aria-label="Menu" aria-expanded={mobileOpen}>
          <Menu className="h-6 w-6" /> Menu
        </button>
      </div>

      {/* Mobile panel (fully nested) */}
      {mobileOpen && (
        <div className="max-h-[75vh] overflow-y-auto border-t border-white/10 bg-navy lg:hidden">
          <ul className="container-x py-2">
            {megaMenu.map((item) => <MobileNode key={item.label} item={item} level={0} close={() => setMobileOpen(false)} />)}
            <li className="mt-2 border-t border-white/10 pt-2">
              <span className="block py-1 text-xs uppercase tracking-wide text-white/50">Categories</span>
              {categories.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setMobileOpen(false)} className="block py-1.5 pl-3 text-sm text-white/70">{c.name}</Link>
              ))}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
