"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "./icons";

export default function CategoryScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => { update(); }, []);

  const by = (dir: number) => ref.current?.scrollBy({ left: dir * 450, behavior: "smooth" });

  // Drag-to-scroll for desktop + touch, while keeping card clicks working.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let didDrag = false;
    let captured = false;

    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      didDrag = false;
      captured = false;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (!didDrag && Math.abs(dx) > 4) {
        didDrag = true;
        setIsDragging(true);
        el.setPointerCapture(e.pointerId);
        captured = true;
      }
      if (didDrag) {
        e.preventDefault();
        el.scrollLeft = startScrollLeft - dx;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDown = false;
      if (captured) {
        try { el.releasePointerCapture(e.pointerId); } catch {}
      }
      setIsDragging(false);
      update();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointerleave", onPointerUp);
    el.addEventListener("scroll", update, { passive: true });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointerleave", onPointerUp);
      el.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`category-scroll-area no-scrollbar flex gap-3 overflow-x-auto px-1 pb-2 pt-1 ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
        style={{ touchAction: "pan-x pan-y", willChange: "scroll-position" }}
      >
        {children}
      </div>

      {/* Left fade */}
      <div
        className={`pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent transition-opacity duration-300 ${atStart ? "opacity-0" : "opacity-100"}`}
        aria-hidden
      />
      {/* Right fade */}
      <div
        className={`pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent transition-opacity duration-300 ${atEnd ? "opacity-0" : "opacity-100"}`}
        aria-hidden
      />

      <button
        onClick={() => by(-1)}
        aria-label="Scroll left"
        className={`absolute -left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-float transition hover:bg-green hover:text-white sm:flex ${atStart ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
      </button>
      <button
        onClick={() => by(1)}
        aria-label="Scroll right"
        className={`absolute -right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-float transition hover:bg-green hover:text-white sm:flex ${atEnd ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
