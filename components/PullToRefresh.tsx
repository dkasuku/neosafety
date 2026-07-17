"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [pulling, setPulling] = useState(false);
  const [distance, setDistance] = useState(0);
  const pullingRef = useRef(false);
  const distanceRef = useRef(0);
  const startY = useRef(0);
  const startX = useRef(0);
  const threshold = 80;

  useEffect(() => {
    pullingRef.current = pulling;
    distanceRef.current = distance;
  }, [pulling, distance]);

  useEffect(() => {
    gsap.registerPlugin(ScrollSmoother);

    const isScrollableTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return target.closest(".category-scroll-area") !== null;
    };

    const atTop = () => {
      const smoother = ScrollSmoother.get();
      return (smoother ? smoother.scrollTop() : window.scrollY) <= 0;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!atTop()) return;
      if (isScrollableTarget(e.target)) return;
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!atTop()) return;
      if (isScrollableTarget(e.target)) return;
      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;
      // Ignore horizontal-dominant gestures (e.g. category scrolling).
      if (Math.abs(dx) > Math.abs(dy)) return;
      const d = Math.max(0, dy);
      if (d > 0) {
        setPulling(true);
        setDistance(Math.min(d, threshold * 1.5));
      }
    };

    const onTouchEnd = () => {
      if (!pullingRef.current) return;
      if (distanceRef.current > threshold) {
        window.location.reload();
      } else {
        setPulling(false);
        setDistance(0);
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <>
      {pulling && (
        <div className="fixed left-0 right-0 top-0 z-[100] flex h-14 items-center justify-center bg-white/80 text-sm font-semibold text-slate-brand backdrop-blur-sm">
          {distance > threshold ? "Release to refresh" : "Pull to refresh"}
        </div>
      )}
      <div
        style={{
          transform: pulling ? `translateY(${distance}px)` : undefined,
          transition: pulling ? "none" : "transform 0.25s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
