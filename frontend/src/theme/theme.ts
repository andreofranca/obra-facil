import {
  breakpoints,
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "@/design-system";

export const lightTheme = {
  name: "light",
  colors,
  spacing,
  typography,
  radius,
  shadows,
  breakpoints,
} as const;

export const themes = {
  light: lightTheme,
} as const;

export type ThemeName = keyof typeof themes;
export type AppTheme = (typeof themes)[ThemeName];
