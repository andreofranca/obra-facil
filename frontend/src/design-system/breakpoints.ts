export const breakpoints = {
  mobile: "0px",
  tablet: "768px",
  desktop: "1024px",
  wide: "1280px",
} as const;

export type BreakpointToken = typeof breakpoints;
