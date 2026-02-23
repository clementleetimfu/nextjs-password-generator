# Test Execution Guide

**Project**: Next.js Password Generator
**Created**: 2026-02-23
**Purpose**: Comprehensive guide for running and managing tests

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Test Environment Setup](#test-environment-setup)
3. [Running Unit Tests](#running-unit-tests)
4. [Running E2E Tests](#running-e2e-tests)
5. [Running All Tests](#running-all-tests)
6. [Test Configuration](#test-configuration)
7. [Coverage Reports](#coverage-reports)
8. [Debugging Tests](#debugging-tests)
9. [CI/CD Integration](#cicd-integration)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before running tests, ensure you have the following installed:

```bash
# Node.js (v18+)
node --version

# npm (v9+)
npm --version

# Verify project dependencies
npm install
```

### Required Dependencies

All testing dependencies are already installed in the project:

- **Unit Testing**: Vitest v4.0.18
- **Component Testing**: @testing-library/react v16.3.2
- **E2E Testing**: Playwright v1.58.2
- **Coverage**: @vitest/coverage-v8

---

## Test Environment Setup

### Initial Setup

```bash
# Install dependencies (if not already done)
npm install

# Install Playwright browsers (required for E2E tests)
npx playwright install
```

### Environment Variables

Create a `.env.test` file for test-specific environment variables:

```env
# Test environment
NODE_ENV=test

# API endpoints (for mocking)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

---

## Running Unit Tests

### Run All Unit Tests

```bash
npm test
```

This runs all unit tests using Vitest with the default configuration.

### Run in Watch Mode

```bash
npm run test:watch
```

Watch mode automatically re-runs tests when files change. Useful during development.

### Run with UI

```bash
npm run test:ui
```

Opens a web-based UI for viewing and running tests interactively.

### Run with Coverage

```bash
npm run test:coverage
```

Generates a code coverage report and saves it to `coverage/` directory.

### Run Specific Test File

```bash
npm test crypto.test.ts
```

### Run Tests Matching a Pattern

```bash
# Run all password-related tests
npm test -- password

# Run all component tests
npm test -- components
```

### Run Tests in Verbose Mode

```bash
npm test -- --reporter=verbose
```

---

## Running E2E Tests

### Prerequisites for E2E Tests

1. **Start the development server**:

```bash
npm run dev
```

The server should be running on `http://localhost:3000`.

2. **Ensure Playwright browsers are installed**:

```bash
npx playwright install
```

### Run All E2E Tests

```bash
npm run test:e2e
```

### Run with UI

```bash
npm run test:e2e:ui
```

Opens Playwright's Test Runner UI for interactive testing.

### Run in Debug Mode

```bash
npm run test:e2e:debug
```

Runs tests in debug mode with step-by-step execution.

### Run Headed (Visible Browser)

```bash
npm run test:e2e:headed
```

Runs tests with a visible browser window.

### Run Specific E2E Test File

```bash
npx playwright test password-generation.spec.ts
```

### Run Tests on Specific Browser

```bash
# Chrome only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# Safari only
npx playwright test --project=webkit
```

### Run Tests on Specific Viewport

```bash
# Mobile viewport
npx playwright test --viewport-size=375,667

# Tablet viewport
npx playwright test --viewport-size=768,1024

# Desktop viewport
npx playwright test --viewport-size=1280,720
```

---

## Running All Tests

### Run Unit and E2E Tests Together

```bash
# Run unit tests first, then E2E tests
npm test && npm run test:e2e

# Or use npm-run-all if installed
npm-run-all test test:e2e
```

### Run with Full Coverage

```bash
# Run unit tests with coverage
npm run test:coverage

# Then run E2E tests
npm run test:e2e
```

---

## Test Configuration

### Vitest Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.config.*',
        'coverage/',
        'playwright-report/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
});
```

### Playwright Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Coverage Reports

### Generate Coverage Report

```bash
npm run test:coverage
```

### View Coverage Report

After running `npm run test:coverage`, open the HTML report:

```bash
# On macOS
open coverage/index.html

# On Windows
start coverage/index.html

# On Linux
xdg-open coverage/index.html
```

### Coverage Report Location

- **HTML Report**: `coverage/index.html`
- **JSON Report**: `coverage/coverage-final.json`
- **Text Summary**: Printed to console

### Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 95%+ | TBD |
| Branches | 90%+ | TBD |
| Functions | 95%+ | TBD |
| Lines | 95%+ | TBD |

---

## Debugging Tests

### Debugging Unit Tests

#### Using Vitest UI

```bash
npm run test:ui
```

1. Open the UI in your browser
2. Click on a test to see its details
3. Click "Debug" to run in debug mode

#### Using VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Vitest",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Then set breakpoints in your test files and run the debugger.

### Debugging E2E Tests

#### Using Playwright Inspector

```bash
npm run test:e2e:debug
```

1. Tests will pause at the first `await page.pause()` call
2. Use the Playwright Inspector to interact with the page
3. Step through tests using the inspector controls

#### Using Playwright UI

```bash
npm run test:e2e:ui
```

1. Select a test to run
2. Watch the test execute in real-time
3. View traces, screenshots, and videos

#### Using VS Code Debugger

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Playwright",
      "program": "${workspaceFolder}/node_modules/@playwright/test/cli.js",
      "args": ["test", "--debug"],
      "console": "integratedTerminal"
    }
  ]
}
```

---

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### GitLab CI Example

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test

unit-tests:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

e2e-tests:
  stage: test
  image: mcr.microsoft.com/playwright:v1.58.2-jammy
  script:
    - npm ci
    - npx playwright install --with-deps
    - npm run build
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - playwright-report/
```

---

## Troubleshooting

### Common Issues

#### Issue: Tests fail with "Module not found" error

**Solution**: Ensure all dependencies are installed:

```bash
npm install
```

#### Issue: E2E tests fail with "Connection refused"

**Solution**: Ensure the dev server is running:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run E2E tests
npm run test:e2e
```

Or configure Playwright to start the server automatically (see `playwright.config.ts`).

#### Issue: Playwright browsers not installed

**Solution**: Install Playwright browsers:

```bash
npx playwright install
```

#### Issue: Tests timeout

**Solution**: Increase timeout in test configuration:

```typescript
// In playwright.config.ts
use: {
  actionTimeout: 10000, // 10 seconds
  navigationTimeout: 30000, // 30 seconds
}
```

#### Issue: Coverage report is empty

**Solution**: Ensure coverage is properly configured in `vitest.config.ts`:

```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  include: ['app/**/*.{ts,tsx}'],
  exclude: [
    'node_modules/',
    'tests/',
    '**/*.test.ts',
    '**/*.test.tsx',
  ],
}
```

#### Issue: Tests pass in watch mode but fail in CI

**Solution**: Ensure tests are isolated and don't depend on test order:

```typescript
// Use beforeEach to reset state
beforeEach(() => {
  vi.clearAllMocks();
  // Reset any global state
});
```

### Getting Help

If you encounter issues not covered here:

1. Check the official documentation:
   - [Vitest Documentation](https://vitest.dev/)
   - [React Testing Library](https://testing-library.com/react)
   - [Playwright Documentation](https://playwright.dev/)

2. Search existing GitHub issues

3. Create a new issue with:
   - Error message
   - Test file that's failing
   - Steps to reproduce
   - Environment details (OS, Node version, browser)

---

## Best Practices

### Writing Tests

1. **Follow Arrange-Act-Assert pattern**
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Mock external dependencies**
5. **Test edge cases and error states**
6. **Use role-based selectors for accessibility**

### Running Tests

1. **Run tests frequently** during development
2. **Use watch mode** for faster feedback
3. **Check coverage** before committing
4. **Run full test suite** before merging
5. **Fix flaky tests** immediately

### Maintaining Tests

1. **Keep tests simple and focused**
2. **Update tests when changing features**
3. **Remove obsolete tests**
4. **Refactor test utilities**
5. **Document complex test scenarios**

---

## Quick Reference

### Unit Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all unit tests |
| `npm run test:watch` | Run in watch mode |
| `npm run test:ui` | Run with UI |
| `npm run test:coverage` | Run with coverage |

### E2E Test Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:ui` | Run with UI |
| `npm run test:e2e:debug` | Run in debug mode |
| `npm run test:e2e:headed` | Run with visible browser |

### Useful Options

```bash
# Run specific test file
npm test crypto.test.ts

# Run tests matching pattern
npm test -- password

# Run in verbose mode
npm test -- --reporter=verbose

# Run specific browser (E2E)
npx playwright test --project=chromium

# Run with custom viewport (E2E)
npx playwright test --viewport-size=1280,720
```

---

## Summary

This guide provides comprehensive instructions for running and managing tests in the Next.js Password Generator project. Key takeaways:

- ✅ Unit tests use Vitest + React Testing Library
- ✅ E2E tests use Playwright
- ✅ Coverage reports are generated with @vitest/coverage-v8
- ✅ Tests can be run individually or together
- ✅ Debugging tools are available for both unit and E2E tests
- ✅ CI/CD integration examples provided

For more information, refer to:
- [Comprehensive Testing Suite Plan](./comprehensive-testing-suite.md)
- [Test Coverage Checklist](./TEST_COVERAGE_CHECKLIST.md)
