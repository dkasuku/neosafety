"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setVisible(true);
    setProgress(12);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.max(1, (90 - p) * 0.12) : p));
    }, 200);
  };

  const done = () => {
    if (timer.current) clearInterval(timer.current);
    setProgress(100);
    setTimeout(() => { setVisible(false); setProgress(0); }, 400);
  };

  // Start when an internal link is clicked
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
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
      start();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Complete when the route actually changes
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!visible) return null;
  return (
    <div className="fixed left-0 top-0 z-[110] h-[3px] w-full bg-transparent">
      <div
        className="h-full bg-green shadow-[0_0_10px_rgba(27,147,60,0.8)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
