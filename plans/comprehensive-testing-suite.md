# Comprehensive Testing Suite Plan

**Project**: Next.js Password Generator
**Created**: 2026-02-23
**Status**: Planning Phase

## Executive Summary

This document outlines a comprehensive testing strategy for the Next.js Password Generator application, covering both unit tests (Vitest + React Testing Library) and end-to-end tests (Playwright). The goal is to achieve 100% feature coverage with zero gaps, ensuring all components, hooks, utilities, and user workflows are thoroughly tested.

## Testing Framework Stack

### Unit Tests
- **Framework**: Vitest (v4.0.18)
- **Component Testing**: React Testing Library (@testing-library/react v16.3.2)
- **Assertions**: Chai (built into Vitest)
- **Mocking**: Vitest's vi.fn(), vi.mock(), vi.spyOn()
- **Coverage**: @vitest/coverage-v8

### E2E Tests
- **Framework**: Playwright (v1.58.2)
- **Selectors**: Role-based selectors (getByRole) and data-testid
- **Mocking**: Playwright's route() and fulfill() for API mocking

### shadcn/ui Components
- **Button**: Radix UI Slot primitive
- **Slider**: Radix UI Slider (@radix-ui/react-slider)
- **Switch**: Radix UI Switch (@radix-ui/react-switch)
- **Tabs**: Radix UI Tabs (@radix-ui/react-tabs)
- **Sonner**: Toast notification library

## Project Structure Overview

```
app/
├── components/
│   ├── password-generator/
│   │   ├── password-controls.tsx      # Password length & character toggles
│   │   ├── password-display.tsx       # Display, strength, breach check
│   │   ├── pin-controls.tsx           # PIN length slider
│   │   ├── passphrase-controls.tsx    # Word count & separator
│   │   └── theme-toggle.tsx           # Light/dark mode toggle
│   └── ui/
│       ├── button.tsx                 # shadcn/ui Button
│       ├── slider.tsx                 # shadcn/ui Slider
│       ├── switch.tsx                 # shadcn/ui Switch
│       ├── tabs.tsx                   # shadcn/ui Tabs
│       └── sonner.tsx                 # Toast notifications
├── hooks/
│   ├── use-password-generator.ts      # Password generation logic
│   ├── use-pin-generator.ts           # PIN generation logic
│   ├── use-passphrase-generator.ts    # Passphrase generation logic
│   ├── use-breach-check.ts            # HIBP API integration
│   ├── use-strength-check.ts          # Strength calculation
│   └── use-theme.ts                  # Theme management
├── lib/
│   ├── crypto.ts                      # Crypto functions (generatePassword, generatePin, generatePassphrase)
│   ├── strength.ts                    # Strength calculations
│   ├── breach-check.ts                # HIBP API functions
│   ├── eff-wordlist.ts                # EFF wordlist loader
│   └── theme.ts                      # Theme utilities
├── types/
│   └── generator.ts                  # TypeScript types
└── page.tsx                           # Main page component
```

## Test Coverage Matrix

### Phase 1: Library Functions (Unit Tests)

| File | Test File | Coverage Areas | Priority |
|------|-----------|----------------|----------|
| `app/lib/crypto.ts` | `tests/unit/crypto.test.ts` | generatePassword(), generatePin(), generatePassphrase(), character sets, constraints | P0 |
| `app/lib/strength.ts` | `tests/unit/strength.test.ts` | calculatePasswordStrength(), calculatePinStrength(), calculatePassphraseStrength(), thresholds | P0 |
| `app/lib/breach-check.ts` | `tests/unit/lib/breach-check.test.ts` | sha1Hash(), checkBreach(), clearBreachCache(), error handling, caching | P0 |
| `app/lib/theme.ts` | `tests/unit/lib/theme.test.ts` | Theme utilities, localStorage persistence | P1 |
| `app/lib/eff-wordlist.ts` | `tests/unit/lib/eff-wordlist.test.ts` | Wordlist loading, word selection, separator handling | P1 |

### Phase 2: Custom Hooks (Unit Tests)

| Hook | Test File | Coverage Areas | Priority |
|------|-----------|----------------|----------|
| `use-password-generator.ts` | `tests/unit/hooks/use-password-generator.test.ts` | State management, generate(), setLength(), toggleDigits(), toggleSymbols(), toggleUppercase(), strength calculation | P0 |
| `use-pin-generator.ts` | `tests/unit/hooks/use-pin-generator.test.ts` | State management, generate(), setLength(), strength calculation | P0 |
| `use-passphrase-generator.ts` | `tests/unit/hooks/use-passphrase-generator.test.ts` | State management, generate(), setWordCount(), setSeparator(), strength calculation | P0 |
| `use-breach-check.ts` | `tests/unit/hooks/use-breach-check.test.ts` | performBreachCheck(), loading states, error handling, result caching | P0 |
| `use-strength-check.ts` | `tests/unit/hooks/use-strength-check.test.ts` | Strength calculation for all credential types | P1 |
| `use-theme.ts` | `tests/unit/hooks/use-theme.test.ts` | Theme toggle, localStorage persistence, initial load | P1 |

### Phase 3: Feature Components (Unit Tests)

| Component | Test File | Coverage Areas | Priority |
|-----------|-----------|----------------|----------|
| `password-controls.tsx` | `tests/unit/components/password-controls.test.tsx` | Rendering, length slider, digit/symbol/uppercase toggles, callbacks, props variations | P0 |
| `password-display.tsx` | `tests/unit/components/password-display.test.tsx` | Rendering, strength indicator, breach check status, refresh/copy/breach-check buttons, clipboard error handling | P0 |
| `pin-controls.tsx` | `tests/unit/components/pin-controls.test.tsx` | Rendering, length slider, callbacks, props variations | P0 |
| `passphrase-controls.tsx` | `tests/unit/components/passphrase-controls.test.tsx` | Rendering, word count slider, separator selection, callbacks, props variations | P0 |
| `theme-toggle.tsx` | `tests/unit/components/theme-toggle.test.tsx` | Rendering, toggle button, theme switching, localStorage persistence | P1 |
| `page.tsx` | `tests/unit/components/page.test.tsx` | Rendering, tab switching, integration with all generators, theme toggle | P0 |

### Phase 4: shadcn/ui Components (Unit Tests)

| Component | Test File | Coverage Areas | Priority |
|-----------|-----------|----------------|----------|
| `ui/button.tsx` | `tests/unit/components/ui/button.test.tsx` | Rendering, variants, sizes, disabled state, click handlers | P1 |
| `ui/slider.tsx` | `tests/unit/components/ui/slider.test.tsx` | Rendering, value changes, min/max constraints, step | P1 |
| `ui/switch.tsx` | `tests/unit/components/ui/switch.test.tsx` | Rendering, checked/unchecked states, aria-checked attribute | P1 |
| `ui/tabs.tsx` | `tests/unit/components/ui/tabs.test.tsx` | Rendering, tab switching, active tab state, aria attributes | P1 |
| `ui/sonner.tsx` | `tests/unit/components/ui/sonner.test.tsx` | Toast rendering, success/error types, auto-dismiss | P2 |

### Phase 5: E2E Tests - Core Workflows

| Feature | Test File | Coverage Areas | Priority |
|---------|-----------|----------------|----------|
| Password Generation | `tests/e2e/password-generation.spec.ts` | Generate on load, refresh, copy, length adjustment, character toggles, strength updates | P0 |
| PIN Generation | `tests/e2e/pin-generation.spec.ts` | Generate on load, refresh, copy, length adjustment, strength updates | P0 |
| Passphrase Generation | `tests/e2e/passphrase-generation.spec.ts` | Generate on load, refresh, copy, word count adjustment, separator selection | P0 |
| Tab Navigation | `tests/e2e/tab-navigation.spec.ts` | Switch between password/PIN/passphrase tabs, state preservation | P0 |
| Theme Switching | `tests/e2e/theme-switching.spec.ts` | Toggle light/dark mode, persistence across reloads | P1 |

### Phase 6: E2E Tests - Security & API

| Feature | Test File | Coverage Areas | Priority |
|---------|-----------|----------------|----------|
| Security Features | `tests/e2e/security-features.spec.ts` | Strength indicator display, breach check button, loading states | P0 |
| Breach Check API | `tests/e2e/breach-check-api.spec.ts` | Mock HIBP API responses (safe, breached, error), rate limit handling | P0 |
| API Error Handling | `tests/e2e/api-error-handling.spec.ts` | Network errors, timeout errors, 429 rate limit, graceful degradation | P0 |

### Phase 7: E2E Tests - UI/UX & Accessibility

| Feature | Test File | Coverage Areas | Priority |
|---------|-----------|----------------|----------|
| UI/UX Features | `tests/e2e/ui-ux.spec.ts` | Toast notifications, button states, responsive layout | P0 |
| Responsive Design | `tests/e2e/responsive-design.spec.ts` | Desktop (1280px+), tablet (768px-1279px), mobile (<768px) layouts | P1 |
| Accessibility | `tests/e2e/accessibility.spec.ts` | ARIA roles, keyboard navigation, screen reader compatibility | P1 |
| Toast Notifications | `tests/e2e/toast-notifications.spec.ts` | Copy toast, refresh toast, auto-dismiss, multiple toasts | P1 |

### Phase 8: E2E Tests - Edge Cases & Error States

| Feature | Test File | Coverage Areas | Priority |
|---------|-----------|----------------|----------|
| Edge Cases | `tests/e2e/edge-cases.spec.ts` | Boundary values (min/max length, word count), rapid refresh clicks, empty credentials | P0 |
| Error States | `tests/e2e/error-states.spec.ts` | Clipboard permission denied, API failures, invalid inputs | P0 |
| Loading States | `tests/e2e/loading-states.spec.ts` | Breach check loading, button disabled states, loading indicators | P1 |

## Detailed Test Specifications

### Unit Test Standards

All unit tests must follow these standards:

1. **Arrange-Act-Assert Pattern**: Clear separation of setup, execution, and verification
2. **Descriptive Test Names**: Should describe what is being tested and expected outcome
3. **User-Focused Testing**: Test behavior, not implementation details
4. **Proper Mocking**: Mock external dependencies (API, crypto, localStorage)
5. **Edge Case Coverage**: Test boundary conditions, error states, and edge cases
6. **Accessibility Testing**: Use role-based selectors for shadcn/ui components
7. **Cleanup**: Proper setup and teardown in beforeEach/afterEach

#### Example Unit Test Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Feature Description', () => {
    it('should do something when user interacts', async () => {
      // Arrange
      const mockCallback = vi.fn();
      render(<ComponentName onAction={mockCallback} />);

      // Act
      const button = screen.getByRole('button', { name: 'Action' });
      await userEvent.click(button);

      // Assert
      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });
});
```

### E2E Test Standards

All E2E tests must follow these standards:

1. **Role-Based Selectors**: Use `page.getByRole()` for accessibility
2. **data-testid Fallback**: Use `page.getByTestId()` when role is not available
3. **User Workflows**: Test complete user journeys, not isolated actions
4. **Mock External APIs**: Mock HIBP API for reliable testing
5. **Responsive Testing**: Test across desktop, tablet, and mobile viewports
6. **Accessibility Checks**: Verify ARIA attributes and keyboard navigation
7. **Clear Descriptions**: Test names should describe the user scenario

#### Example E2E Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should complete user workflow', async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:3000');

    // Act
    await page.getByRole('tab', { name: 'Password' }).click();
    await page.getByRole('button', { name: 'Refresh' }).click();

    // Assert
    const passwordDisplay = page.getByTestId('password-display');
    await expect(passwordDisplay).toBeVisible();
  });
});
```

## shadcn/ui Component Testing Guidelines

### Button Component
- **Role**: `button`
- **Attributes**: `disabled`, `aria-disabled`
- **Test Cases**:
  - Renders with correct text/icon
  - Calls onClick handler when clicked
  - Disabled state prevents clicks
  - Variant classes applied correctly

### Slider Component
- **Role**: `slider` (or `spinbutton`)
- **Attributes**: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- **Test Cases**:
  - Renders with correct initial value
  - Updates value when changed
  - Respects min/max constraints
  - Step value honored

### Switch Component
- **Role**: `switch`
- **Attributes**: `aria-checked` ('true' | 'false')
- **Test Cases**:
  - Renders with correct initial state
  - Toggles on click
  - Calls onCheckedChange callback
  - ARIA attributes updated correctly

### Tabs Component
- **Role**: `tablist` (container), `tab` (triggers), `tabpanel` (content)
- **Attributes**: `aria-selected`, `aria-controls`, `aria-labelledby`
- **Test Cases**:
  - Renders all tabs
  - Switches active tab on click
  - Shows correct content for active tab
  - Keyboard navigation (arrow keys)

### Sonner (Toast) Component
- **Role**: `status` or `alert`
- **Test Cases**:
  - Renders toast message
  - Auto-dismisses after timeout
  - Shows success/error styles
  - Multiple toasts stack correctly

## Testing Best Practices

### Unit Testing Best Practices

1. **Test Behavior, Not Implementation**
   - ❌ Don't test internal state or methods
   - ✅ Test what the user sees and interacts with

2. **Use Descriptive Test Names**
   - ❌ `it('should work')`
   - ✅ `it('should generate password with 16 characters when length slider is set to 16')`

3. **Mock External Dependencies**
   - Mock `crypto.getRandomValues()` for deterministic tests
   - Mock `fetch()` for API calls
   - Mock `localStorage` for persistence

4. **Test Edge Cases**
   - Minimum and maximum values
   - Empty inputs
   - Error states
   - Rapid user interactions

5. **Use Role-Based Selectors**
   - `screen.getByRole('button')` instead of `screen.getByClassName('btn')`
   - More accessible and resilient to CSS changes

### E2E Testing Best Practices

1. **Mock External APIs**
   ```typescript
   await page.route('**/api.pwnedpasswords.com/**', route => {
     route.fulfill({
       status: 200,
       body: 'ABCDEF12345:10\nGHIJKL67890:5',
     });
   });
   ```

2. **Test Real User Workflows**
   - Complete tab switching flows
   - Full password generation with all options
   - Complete breach check workflow

3. **Test Responsive Design**
   ```typescript
   test.describe('Mobile View', () => {
     test.use({ viewport: { width: 375, height: 667 } });
     // Mobile-specific tests
   });
   ```

4. **Verify Accessibility**
   ```typescript
   await expect(page.getByRole('button')).toHaveAccessibleName('Refresh');
   await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
   ```

5. **Wait for Elements Properly**
   - Use `await expect(locator).toBeVisible()` instead of `page.waitForTimeout()`
   - Use `await page.waitForLoadState()` for navigation

## Test Execution Commands

### Unit Tests
```bash
# Run all unit tests
npm test

# Run in watch mode
npm run test:watch

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test file
npm test password-controls.test.tsx
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run headed (visible browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test password-generation.spec.ts
```

## Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Overall Code Coverage | 95%+ | TBD |
| Component Coverage | 100% | TBD |
| Hook Coverage | 100% | TBD |
| Utility Coverage | 100% | TBD |
| E2E Feature Coverage | 100% | TBD |

## Success Criteria

The testing suite will be considered complete when:

1. ✅ All components have comprehensive unit tests
2. ✅ All hooks have comprehensive unit tests
3. ✅ All utility functions have comprehensive unit tests
4. ✅ All shadcn/ui components have unit tests
5. ✅ All user workflows have E2E tests
6. ✅ All edge cases and error states are covered
7. ✅ Accessibility is tested across all components
8. ✅ Responsive design is tested across breakpoints
9. ✅ API integration is tested with mocks
10. ✅ Test coverage report shows 95%+ coverage
11. ✅ All tests pass consistently
12. ✅ Documentation is complete

## Next Steps

1. **Phase 1**: Review existing tests and identify gaps
2. **Phase 2**: Create missing unit tests for library functions
3. **Phase 3**: Create missing unit tests for hooks
4. **Phase 4**: Create missing unit tests for components
5. **Phase 5**: Create missing E2E tests for workflows
6. **Phase 6**: Update test configuration and infrastructure
7. **Phase 7**: Generate coverage report
8. **Phase 8**: Document testing practices

## References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Have I Been Pwned API](https://haveibeenpwned.com/API/v3)
- [EFF Long Wordlist](https://www.eff.org/dice)
