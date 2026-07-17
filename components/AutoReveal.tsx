"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Use layout effect on the client (runs before paint -> no flicker), useEffect on server.
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function AutoReveal() {
  const pathname = usePathname();
  const ioRef = useRef<IntersectionObserver | null>(null);

  useIso(() => {
    const main = document.querySelector("main");
    if (!main) return;

    // Animate the direct content blocks of the page, skipping any that already
    // manage their own reveal (e.g. the homepage's <Reveal> wrappers).
    const blocks = Array.from(main.children).filter(
      (el) => el instanceof HTMLElement && !el.classList.contains("reveal")
    ) as HTMLElement[];
    if (blocks.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );

    const vh = window.innerHeight || 800;
    blocks.forEach((el) => {
      el.classList.add("reveal");
      // Anything already on-screen: reveal it immediately (never leave it hidden).
      if (el.getBoundingClientRect().top < vh * 0.95) {
        el.classList.add("is-visible");
      } else {
        io.observe(el);
      }
    });
    ioRef.current = io;

    // Safety net: if anything is still hidden shortly after mount, reveal it.
    const t = setTimeout(() => {
      blocks.forEach((el) => el.classList.add("is-visible"));
    }, 1200);

    return () => { clearTimeout(t); io.disconnect(); };
  }, [pathname]);

  return null;
}
