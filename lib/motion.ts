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
