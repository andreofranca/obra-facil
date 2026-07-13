"use client";

import type { ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";
import { lightTheme } from "./theme";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider
      value={{
        theme: lightTheme,
        themeName: lightTheme.name,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
