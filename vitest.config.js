import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['html', 'text', 'json-summary', 'json'],
      lines: 60,
      branches: 60,
      functions: 60,
      statements: 60
    }
  }
});
