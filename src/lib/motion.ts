/** Shared motion constants. One easing for the whole site, nothing bouncy. */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

export const DURATION = {
  fast: 0.4,
  base: 0.6,
  slow: 0.8,
} as const;

/** Distance (px) elements rise while revealing. */
export const RISE = 12;
