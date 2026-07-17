"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Respect users who prefer reduced motion — leave native scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const ctx = gsap.context(() => {
      ScrollSmoother.create({
        wrapper: wrapper.current!,
        content: content.current!,
        smooth: 1.5, // higher = more glide/lag
        effects: true, // enables data-speed / data-lag parallax
        normalizeScroll: true, // smoother behaviour on touch devices
      });
    });

    // Re-measure once images/fonts have settled.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);

    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(t);
      ctx.revert(); // kills the smoother + triggers
    };
  }, []);

  // Reset to top and re-measure on route change.
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, false);
      ScrollTrigger.refresh();
    }
  }, [pathname]);

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  );
}
