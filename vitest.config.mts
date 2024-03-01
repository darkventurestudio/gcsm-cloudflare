import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['html', 'text', 'json-summary', 'json'],
      thresholds: {
        lines: 97,
        branches: 81,
        functions: 100,
        statements: 97
      },
      exclude: [
        ...configDefaults.exclude,
        "build",
        "src/domain/**/*.d.ts",
        "src/infrastructure/gcsm.ts",
      ]
    },
  }
});
