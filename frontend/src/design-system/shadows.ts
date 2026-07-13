export const shadows = {
  none: "none",
  sm: "0 1px 2px rgba(31, 41, 51, 0.08)",
  md: "0 8px 24px rgba(31, 41, 51, 0.10)",
  focus: "0 0 0 3px rgba(31, 78, 95, 0.18)",
} as const;

export type ShadowToken = typeof shadows;
