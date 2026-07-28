import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/app/layout.tsx", // Next.js entry point usually skipped in unit tests
        "src/**/*.d.ts",
        "src/types/**/*"
      ],
      // Thresholds futuros podem ser habilitados aqui
    },
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    exclude: ["node_modules", ".next", "tests/e2e", "tests/integration"], // Ignorar testes E2E e de integração BD
  },
});
