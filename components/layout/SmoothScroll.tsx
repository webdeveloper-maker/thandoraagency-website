"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Lenis smooth scrolling on desktop pointers only. Touch devices and users
 * who prefer reduced motion keep native scrolling.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduce) return;

    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -80 }, autoRaf: true });
    lenisRef.current = lenis;
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New page: jump to the top (or to the hash target).
  useEffect(() => {
    const lenis = lenisRef.current;
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -80, immediate: true });
        else el.scrollIntoView();
        return;
      }
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
