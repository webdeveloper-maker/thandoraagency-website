"use client";

import { useEffect, useState } from "react";

/** Subscribes to a media query. Returns `fallback` during SSR / first render. */
export function useMedia(query: string, fallback = false) {
  const [matches, setMatches] = useState(fallback);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** True when the device has a fine pointer that can hover (desktop). */
export const useCanHover = () => useMedia("(hover: hover) and (pointer: fine)");
