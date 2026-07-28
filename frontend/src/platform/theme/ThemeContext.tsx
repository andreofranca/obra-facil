import { createContext, useContext } from "react";
import { ThemeTokens } from "./tokens";

interface ThemeContextData {
  theme: "light" | "dark";
  tokens: ThemeTokens;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
  }
  return context;
}
