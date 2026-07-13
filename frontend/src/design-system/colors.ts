export const colors = {
  brand: {
    primary: "#1F4E5F",
    secondary: "#2E7D32",
    accent: "#F4B400",
  },
  neutral: {
    white: "#FFFFFF",
    background: "#F7F8FA",
    surface: "#FFFFFF",
    border: "#E5E7EB",
    muted: "#6B7280",
    text: "#1F2933",
  },
  feedback: {
    success: "#2E7D32",
    error: "#D32F2F",
    warning: "#F59E0B",
    info: "#2563EB",
  },
} as const;

export type ColorToken = typeof colors;
