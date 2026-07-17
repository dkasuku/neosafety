"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "./icons";

export default function CategoryScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const by = (dir: number) => ref.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  // drag-to-scroll for desktop + touch
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      setIsDragging(true);
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.style.scrollSnapType = "none";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      el.scrollLeft = startScrollLeft - dx;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      setIsDragging(false);
      el.releasePointerCapture(e.pointerId);
      el.style.scrollSnapType = "";
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
        className={`stagger no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 pb-2 pt-1 ${visible ? "is-visible" : ""} ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
        style={{ touchAction: "pan-x" }}
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
        className={`absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-float transition hover:bg-green hover:text-white lg:flex ${atStart ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <ChevronRight className="h-5 w-5 rotate-180" />
      </button>
      <button
        onClick={() => by(1)}
        aria-label="Scroll right"
        className={`absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-float transition hover:bg-green hover:text-white lg:flex ${atEnd ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
