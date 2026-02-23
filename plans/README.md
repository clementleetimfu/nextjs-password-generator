# Testing Suite Implementation Plan

**Project**: Next.js Password Generator
**Created**: 2026-02-23
**Status**: Planning Complete - Ready for Implementation

---

## Overview

This document provides a comprehensive testing suite plan for the Next.js Password Generator application. The plan covers both unit tests (Vitest + React Testing Library) and end-to-end tests (Playwright), ensuring complete coverage of all components, hooks, utilities, and user workflows.

---

## Quick Start

### What's Been Created

1. **[Comprehensive Testing Suite Plan](./comprehensive-testing-suite.md)** - Complete testing strategy with detailed specifications
2. **[Test Coverage Checklist](./TEST_COVERAGE_CHECKLIST.md)** - Detailed mapping of all features to tests
3. **[Test Execution Guide](./TEST_EXECUTION_GUIDE.md)** - Instructions for running and managing tests

### Current Status

| Category | Total Tests | Complete | Missing | Coverage |
|-----------|-------------|----------|---------|----------|
| Unit Tests - Libraries | 5 | 2 | 3 | 40% |
| Unit Tests - Hooks | 6 | 6 | 0 | 100% |
| Unit Tests - Components | 6 | 6 | 0 | 100% |
| Unit Tests - shadcn/ui | 5 | 0 | 5 | 0% |
| Unit Tests - Main Page | 1 | 0 | 1 | 0% |
| E2E Tests - Core Workflows | 5 | 3 | 2 | 60% |
| E2E Tests - Security & API | 3 | 1 | 2 | 33% |
| E2E Tests - UI/UX & A11y | 4 | 1 | 3 | 25% |
| E2E Tests - Edge Cases | 3 | 0 | 3 | 0% |
| **TOTAL** | **38** | **19** | **19** | **50%** |

---

## Project Structure

```
app/
├── components/
│   ├── password-generator/
│   │   ├── password-controls.tsx      ✅ Has tests
│   │   ├── password-display.tsx       ✅ Has tests
│   │   ├── pin-controls.tsx           ✅ Has tests
│   │   ├── passphrase-controls.tsx    ✅ Has tests
│   │   └── theme-toggle.tsx           ✅ Has tests
│   └── ui/
│       ├── button.tsx                 ❌ Needs tests
│       ├── slider.tsx                 ❌ Needs tests
│       ├── switch.tsx                 ❌ Needs tests
│       ├── tabs.tsx                   ❌ Needs tests
│       └── sonner.tsx                 ❌ Needs tests
├── hooks/
│   ├── use-password-generator.ts      ✅ Has tests
│   ├── use-pin-generator.ts           ✅ Has tests
│   ├── use-passphrase-generator.ts    ✅ Has tests
│   ├── use-breach-check.ts            ✅ Has tests
│   ├── use-strength-check.ts          ✅ Has tests
│   └── use-theme.ts                  ✅ Has tests
├── lib/
│   ├── crypto.ts                      ⚠️ Needs enhancement
│   ├── strength.ts                    ⚠️ Needs enhancement
│   ├── breach-check.ts                ⚠️ Needs enhancement
│   ├── eff-wordlist.ts                ❌ Needs tests
│   └── theme.ts                      ❌ Needs tests
└── page.tsx                           ❌ Needs tests
```

---

## Implementation Roadmap

### Phase 1: Planning ✅ (COMPLETED)

- [x] Review existing tests and identify gaps
- [x] Document all components, hooks, and utilities
- [x] Create test coverage matrix
- [x] Create comprehensive testing plan
- [x] Create test coverage checklist
- [x] Create test execution guide

### Phase 2: Infrastructure Setup (PENDING)

- [ ] Update `vitest.config.ts` with optimal configuration
- [ ] Update `playwright.config.ts` with optimal configuration
- [ ] Create `tests/setup.ts` with shared utilities and mocks
- [ ] Create test helpers for common operations
- [ ] Configure test coverage reporting

### Phase 3: Unit Tests - Library Functions (PENDING)

- [ ] Enhance `tests/unit/crypto.test.ts` with edge cases
- [ ] Enhance `tests/unit/strength.test.ts` with comprehensive tests
- [ ] Create `tests/unit/lib/theme.test.ts`
- [ ] Create `tests/unit/lib/eff-wordlist.test.ts`
- [ ] Enhance `tests/unit/lib/breach-check.test.ts`

### Phase 4: Unit Tests - Main Page (PENDING)

- [ ] Create `tests/unit/components/page.test.tsx`

### Phase 5: Unit Tests - shadcn/ui Components (PENDING)

- [ ] Create `tests/unit/components/ui/button.test.tsx`
- [ ] Create `tests/unit/components/ui/slider.test.tsx`
- [ ] Create `tests/unit/components/ui/switch.test.tsx`
- [ ] Create `tests/unit/components/ui/tabs.test.tsx`
- [ ] Create `tests/unit/components/ui/sonner.test.tsx`

### Phase 6: E2E Tests - Core Workflows (PENDING)

- [ ] Enhance `tests/e2e/password-generation.spec.ts`
- [ ] Enhance `tests/e2e/pin-generation.spec.ts`
- [ ] Enhance `tests/e2e/passphrase-generation.spec.ts`
- [ ] Create `tests/e2e/tab-navigation.spec.ts`
- [ ] Create `tests/e2e/theme-switching.spec.ts`

### Phase 7: E2E Tests - Security & API (PENDING)

- [ ] Enhance `tests/e2e/security-features.spec.ts`
- [ ] Create `tests/e2e/breach-check-api.spec.ts`
- [ ] Create `tests/e2e/api-error-handling.spec.ts`

### Phase 8: E2E Tests - UI/UX & Accessibility (PENDING)

- [ ] Enhance `tests/e2e/ui-ux.spec.ts`
- [ ] Create `tests/e2e/responsive-design.spec.ts`
- [ ] Create `tests/e2e/accessibility.spec.ts`
- [ ] Create `tests/e2e/toast-notifications.spec.ts`

### Phase 9: E2E Tests - Edge Cases (PENDING)

- [ ] Create `tests/e2e/edge-cases.spec.ts`
- [ ] Create `tests/e2e/error-states.spec.ts`
- [ ] Create `tests/e2e/loading-states.spec.ts`

### Phase 10: Review & Reporting (PENDING)

- [ ] Generate test coverage report
- [ ] Review all tests for quality
- [ ] Document any remaining gaps
- [ ] Create final summary

---

## Testing Standards

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
7. **Clear Descriptions**: Test names should describe user scenario

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

---

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

All shadcn/ui components are based on Radix UI primitives:

- **Button**: Radix UI Slot primitive
- **Slider**: Radix UI Slider (@radix-ui/react-slider)
- **Switch**: Radix UI Switch (@radix-ui/react-switch)
- **Tabs**: Radix UI Tabs (@radix-ui/react-tabs)
- **Sonner**: Toast notification library

---

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
```

---

## Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Overall Code Coverage | 95%+ | TBD |
| Component Coverage | 100% | TBD |
| Hook Coverage | 100% | TBD |
| Utility Coverage | 100% | TBD |
| E2E Feature Coverage | 100% | TBD |

---

## Key Features to Test

### 1. Password Generation
- Generate password with lowercase letters (default)
- Toggle digits, symbols, and uppercase
- Adjust length (8-50 characters)
- Refresh and copy functionality
- Strength calculation
- Breach check integration

### 2. PIN Generation
- Generate PIN with digits only
- Adjust length (3-12 digits)
- Refresh and copy functionality
- Strength calculation
- Breach check integration

### 3. Passphrase Generation
- Generate passphrase from EFF wordlist
- Adjust word count (4-10 words)
- Select separator (space, hyphen, underscore, period)
- Refresh and copy functionality
- Strength calculation
- Breach check integration

### 4. Security Features
- Strength indicator display
- Breach check via HIBP API
- Error handling for API failures
- Loading states

### 5. UI/UX Features
- Tab navigation between modes
- Theme toggle (light/dark)
- Toast notifications
- Responsive design (desktop, tablet, mobile)
- Accessibility (ARIA roles, keyboard navigation)

---

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

---

## Next Steps

### Immediate Actions

1. **Review the plan documents**:
   - Read [`comprehensive-testing-suite.md`](./comprehensive-testing-suite.md)
   - Review [`TEST_COVERAGE_CHECKLIST.md`](./TEST_COVERAGE_CHECKLIST.md)
   - Check [`TEST_EXECUTION_GUIDE.md`](./TEST_EXECUTION_GUIDE.md)

2. **Approve the plan**:
   - Confirm the testing strategy meets requirements
   - Identify any gaps or modifications needed
   - Provide feedback on priorities

3. **Switch to implementation mode**:
   - Use Code mode to create and enhance tests
   - Follow the implementation roadmap
   - Update the checklist as tests are completed

### Implementation Order

Recommended order for implementing tests:

1. **Infrastructure** (Phase 2) - Setup test configuration and utilities
2. **Library Functions** (Phase 3) - Core utilities first
3. **Main Page** (Phase 4) - Integration component
4. **shadcn/ui Components** (Phase 5) - UI components
5. **Core E2E Workflows** (Phase 6) - Main user journeys
6. **Security & API** (Phase 7) - API integration
7. **UI/UX & Accessibility** (Phase 8) - User experience
8. **Edge Cases** (Phase 9) - Error handling
9. **Review & Reporting** (Phase 10) - Final validation

---

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

---

## References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Have I Been Pwned API](https://haveibeenpwned.com/API/v3)
- [EFF Long Wordlist](https://www.eff.org/dice)

---

## Questions & Feedback

If you have any questions or feedback about this testing plan:

1. Review the detailed documents in the `plans/` directory
2. Check the test coverage checklist for specific requirements
3. Refer to the execution guide for running tests
4. Provide feedback on priorities or approach

---

## Summary

This comprehensive testing suite plan provides:

- ✅ **Complete analysis** of existing tests and gaps
- ✅ **Detailed specifications** for all required tests
- ✅ **Clear roadmap** for implementation
- ✅ **Testing standards** and best practices
- ✅ **Execution guide** for running tests
- ✅ **Coverage checklist** to track progress
- ✅ **Success criteria** to validate completion

The plan is ready for implementation. Switch to **Code mode** to begin creating and enhancing the tests according to the roadmap.
