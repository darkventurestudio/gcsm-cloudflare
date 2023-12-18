import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            reporter: ['json-summary'],
            thresholds: {
                lines: 63,
                branches: 81,
                functions: 61,
                statements: 63
            },
            exclude: [
                ...configDefaults.exclude,
                "build",
                "src/domain/**/*.d.ts",
            ]
        }
    }
});
