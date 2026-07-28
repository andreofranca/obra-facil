import React, { useState, ReactNode, useCallback, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";
import { lightTokens, darkTokens } from "./tokens";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark";
}

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);

  // Aqui preparamos o terreno para o Dark Mode futuro
  // Por enquanto o sistema força o tema inicial (light)
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    // Sincroniza a classe 'dark' no html para o Tailwind (futuramente)
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const tokens = theme === "light" ? lightTokens : darkTokens;

  return (
    <ThemeContext.Provider value={{ theme, tokens, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
