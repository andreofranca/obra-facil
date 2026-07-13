export const radius = {
  none: "0",
  sm: "4px",
  md: "6px",
  lg: "8px",
  full: "999px",
} as const;

export type RadiusToken = typeof radius;
