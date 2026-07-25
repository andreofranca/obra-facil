import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/integration/setup/globalSetup.ts'],
    include: ['./tests/integration/**/*.test.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
