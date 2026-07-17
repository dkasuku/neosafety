"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_VISIBLE = 600; // minimum time the splash stays (ms)
const FADE = 300;

export default function RouteLoader() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [hiding, setHiding] = useState(false);
  const startRef = useRef(0);
  const loadingRef = useRef(false);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  const show = () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    startRef.current = Date.now();
    setHiding(false);
    setActive(true);
    if (safety.current) clearTimeout(safety.current);
    safety.current = setTimeout(() => finish(), 4000); // never get stuck
  };

  const finish = () => {
    if (!loadingRef.current) return;
    const wait = Math.max(0, MIN_VISIBLE - (Date.now() - startRef.current));
    setTimeout(() => {
      setHiding(true);
      setTimeout(() => {
        loadingRef.current = false;
        setActive(false);
        setHiding(false);
      }, FADE);
    }, wait);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      const target = a.getAttribute("target");
      if (!href || href.startsWith("#") || target === "_blank" || a.hasAttribute("download")) return;
      if (/^https?:\/\//.test(href) && !href.includes(location.host)) return;
      try {
        const url = new URL(href, location.href);
        if (url.pathname === location.pathname && url.search === location.search) return;
      } catch { return; }
      show();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (loadingRef.current) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!active) return null;

  return (
    <div className={`fixed inset-0 z-[105] flex items-center justify-center bg-navy transition-opacity ${hiding ? "opacity-0" : "opacity-100"}`} style={{ transitionDuration: `${FADE}ms` }}>
      <div className="relative flex h-32 w-32 items-center justify-center md:h-40 md:w-40">
        <span className="absolute inset-0 animate-spin rounded-full border-[5px] border-white/10 border-t-green [animation-duration:0.9s]" />
        <span className="absolute inset-2 rounded-full border border-white/5" />
        <Image src="/logo.png" alt="Loading" width={260} height={130} priority className="h-10 w-auto px-4 brightness-0 invert md:h-12" />
      </div>
    </div>
  );
}
