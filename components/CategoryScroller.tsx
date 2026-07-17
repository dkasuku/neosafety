"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "./icons";

export default function CategoryScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // stagger reveal on scroll into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); io.unobserve(e.target); } }),
      { threshold: 0.08, rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };
  useEffect(() => { update(); }, []);

  const by = (dir: number) => ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={update}
        className={`stagger no-scrollbar -mx-1 flex gap-3 scroll-smooth px-1 pb-1 ${visible ? "is-visible" : ""}`}
        style={{ overflowX: "auto" }}
      >
        {children}
      </div>

      <button
        onClick={() => by(-1)}
        aria-label="Scroll left"
        className={`absolute -left-3 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-float transition hover:bg-green hover:text-white lg:flex ${atStart ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <ChevronRight className="h-5 w-5 rotate-180" />
      </button>
      <button
        onClick={() => by(1)}
        aria-label="Scroll right"
        className={`absolute -right-3 top-[38%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-float transition hover:bg-green hover:text-white lg:flex ${atEnd ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
