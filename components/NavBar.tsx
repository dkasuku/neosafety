"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { megaMenu, type MenuItem, type Category } from "@/lib/data";
import { Menu, ChevronDown, ChevronRight, X } from "./icons";

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

function MobileNode({ item, close }: { item: MenuItem; close: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const kids = item.children;
  return (
    <li>
      <div className="flex items-center justify-between">
        <Link href={item.href} onClick={close} className="block flex-1 py-2 font-display text-sm font-semibold text-white">
          {item.label}
        </Link>
        {kids && (
          <button onClick={() => setExpanded((v) => !v)} aria-label="Toggle submenu" className="p-2 text-white/70">
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
      {kids && expanded && (
        <ul className="ml-3 border-l border-white/10 pl-3">
          {kids.map((ch) => <MobileNode key={ch.label} item={ch} close={close} />)}
        </ul>
      )}
    </li>
  );
}

export default function NavBar({ categories = [] }: { categories?: Category[] }) {
  const [openCats, setOpenCats] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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
              <div className="absolute left-0 top-full z-50 hidden w-[min(420px,calc(100vw-2rem))] grid-cols-1 rounded-md border border-slate-100 bg-white p-2 shadow-float md:grid md:grid-cols-2">
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

      {/* Mobile panel (portal to body so it isn't trapped by SmoothScroll transforms) */}
      {mounted && mobileOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col bg-navy text-white">
          <div className="container-x flex items-center justify-between py-4">
            <span className="font-display text-lg font-bold">Menu</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-8">
            <ul className="space-y-1">
              {megaMenu.map((item) => <MobileNode key={item.label} item={item} close={() => setMobileOpen(false)} />)}
            </ul>
            <div className="mt-4 border-t border-white/10 pt-4">
              <button
                onClick={() => setCatsOpen((v) => !v)}
                className="flex w-full items-center justify-between py-2 text-xs uppercase tracking-wide text-white/50"
                aria-expanded={catsOpen}
              >
                <span>Categories</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${catsOpen ? "rotate-180" : ""}`} />
              </button>
              {catsOpen && (
                <ul className="mt-1 space-y-1">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/category/${c.slug}`} onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10">{c.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
}
