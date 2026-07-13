"use client";

import { createContext, useContext } from "react";
import type { AppTheme, ThemeName } from "./theme";

export type ThemeContextValue = {
  theme: AppTheme;
  themeName: ThemeName;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }

  return context;
}
