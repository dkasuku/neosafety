"use client";

import { useEffect, useRef, useState } from "react";

export default function PullToRefresh({ children }: { children: React.ReactNode }) {
  const [pulling, setPulling] = useState(false);
  const [distance, setDistance] = useState(0);
  const pullingRef = useRef(false);
  const distanceRef = useRef(0);
  const startY = useRef(0);
  const threshold = 80;

  useEffect(() => {
    pullingRef.current = pulling;
    distanceRef.current = distance;
  }, [pulling, distance]);

  useEffect(() => {
    const isScrollableTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return target.closest(".category-scroll-area") !== null;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0) return;
      if (isScrollableTarget(e.target)) return;
      startY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (window.scrollY > 0) return;
      if (isScrollableTarget(e.target)) return;
      const y = e.touches[0].clientY;
      const d = Math.max(0, y - startY.current);
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
        <div className="fixed left-0 right-0 top-0 z-[100] flex h-14 items-center justify-center text-sm font-semibold text-slate-brand">
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
