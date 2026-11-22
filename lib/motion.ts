/** Motion tokens shared by every animated component. */
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const dur = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
};

export const stagger = 0.06;

/** Shared viewport settings for "reveal once" animations. */
export const inViewOnce = { once: true, amount: 0.3 } as const;

/**
 * Maps scroll progress `v` from [a, b] onto [from, to], clamped.
 * Use it as `useTransform(progress, (v) => scrollRange(v, a, b, from, to))`
 * for scroll-linked opacity: the function form keeps Motion from handing the
 * value to the browser's native ScrollTimeline, whose progress does not match
 * our pinned sections (cards were left stuck at ~37% opacity).
 */
export function scrollRange(v: number, a: number, b: number, from: number, to: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return from + (to - from) * t;
}
