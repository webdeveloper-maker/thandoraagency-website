/** Figma pixels → CSS length that is exact at 1440px and scales below it. */
export const u = (px: number) => `calc(${px} * var(--u))`;
