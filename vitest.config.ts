import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx', 'tests/unit/**/*.spec.ts'],
    exclude: [
      'tests/e2e/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'coverage/**',
      'playwright-report/**',
      'plans/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.config.*',
        'coverage/',
        'playwright-report/',
        'dist/',
        'build/',
        '.next/',
        'plans/',
        'app/lib/eff-wordlist-content.ts',
        'app/lib/eff-wordlist-data.txt',
      ],
    },
  },
})
