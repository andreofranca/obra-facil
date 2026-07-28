export interface ThemeTokens {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  spacing: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// Estes tokens mapeiam a paleta atual do Tailwind para acesso via JS
// Útil para charts, canvas ou bibliotecas externas que não suportam classes Tailwind diretamente.
export const lightTokens: ThemeTokens = {
  colors: {
    primary: "#f97316", // brand-primary
    background: "#f4f4f5", // neutral-background
    surface: "#ffffff", // neutral-surface
    text: "#18181b", // neutral-text
    muted: "#71717a", // neutral-muted
    border: "#e4e4e7", // neutral-border
    error: "#ef4444", // feedback-error
    success: "#22c55e", // feedback-success
    warning: "#eab308", // feedback-warning
    info: "#3b82f6", // feedback-info
  },
  spacing: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
    full: "9999px",
  },
};

// Placeholder para o futuro Dark Mode
export const darkTokens: ThemeTokens = {
  ...lightTokens,
  colors: {
    ...lightTokens.colors,
    background: "#18181b",
    surface: "#27272a",
    text: "#f4f4f5",
    muted: "#a1a1aa",
    border: "#3f3f46",
  },
};
