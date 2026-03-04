# nextjs-password-generator - Agent Development Guide

## Project Overview

Secure password generator: Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, Shadcn UI (Radix primitives), Web Crypto API.

## Build/Lint/Test Commands

### Development
```bash
pnpm dev          # localhost:3000
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint
```

### Unit Tests (Vitest)
```bash
pnpm test                          # All tests
pnpm test:watch                    # Watch mode
pnpm test:ui                       # UI mode
pnpm test:coverage                 # Coverage

# Single test file
npx vitest run tests/unit/hooks/use-password-generator.test.ts

# Run tests matching a pattern
npx vitest run -t "initializes and generates"
```

### E2E Tests (Playwright)
```bash
pnpm test:e2e                      # All E2E tests
pnpm test:e2e:ui                   # UI mode
pnpm test:e2e:debug                # Debug mode
pnpm test:e2e:headed               # Headed browser

# Single test file
npx playwright test tests/e2e/password-generation.spec.ts

# Run test by title pattern
npx playwright test -g "generates password on page load"
```

## Project Structure

```
app/
├── api/breach-check/              # API endpoint for breach checking
├── components/
│   ├── password-generator/       # Domain components
│   │   ├── password-display.tsx
│   │   ├── password-controls.tsx
│   │   ├── pin-controls.tsx
│   │   ├── passphrase-controls.tsx
│   │   ├── password-history.tsx
│   │   ├── history-slider.tsx
│   │   └── theme-toggle.tsx
│   └── ui/                        # Shadcn/Radix UI components
├── hooks/                         # Custom React hooks
├── lib/                           # Utils & core logic
│   ├── crypto.ts                  # Secure random generation
│   ├── strength.ts                # Strength calculation
│   ├── breach-check.ts            # Have I Been Pwned API
│   ├── theme.ts
│   └── eff-wordlist.ts
├── types/                         # TypeScript definitions
├── constants.ts
├── globals.css
├── layout.tsx
└── page.tsx
lib/utils.ts                       # cn() utility (clsx + tailwind-merge)
tests/
├── setup.ts                       # Test mocks and setup
├── unit/                           # Vitest unit tests
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── api/
└── e2e/                            # Playwright E2E tests
```

## Code Style

### Import Order
1. React/Next.js
2. Third-party libraries
3. Internal (`@/` alias)
4. Types (use `type` keyword)
5. Relative imports

```typescript
import { useState, useCallback } from 'react';
import { renderHook, act } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { generatePassword } from '@/lib/crypto';
import type { PasswordState } from '@/types/generator';
```

### TypeScript (Strict Mode)
- Explicit return types for exported functions
- Interfaces for object shapes, types for unions/primitives
- `as const` for immutable constants
- Never `any` - use `unknown` with type guards

```typescript
export interface PasswordState {
  type: 'password';
  value: string;
  length: number;
}
export type StrengthLevel = 'VERY_WEAK' | 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG';
export const LIMITS = { MIN: 8, MAX: 50 } as const;
```

### Naming Conventions
- Components: PascalCase (`PasswordDisplay`, `HistorySlider`)
- Hooks: camelCase with `use` prefix (`usePasswordGenerator`)
- Functions: camelCase (`generatePassword`, `calculateStrength`)
- Constants: SCREAMING_SNAKE_CASE (`PASSWORD_CONSTRAINTS`)
- Test files: `*.test.ts` (unit), `*.spec.ts` (E2E)
- Test IDs: kebab-case (`data-testid="password-display"`)

### React Components
```typescript
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { SomeType } from '@/types';

interface ComponentProps {
  value: string;
  onChange: () => void;
}

export function Component({ value, onChange }: ComponentProps) {
  const [state, setState] = useState<string>('');
  const handleClick = useCallback(() => { /* ... */ }, [deps]);
  return <div>{value}</div>;
}
```

### Hooks Pattern
```typescript
export function usePasswordGenerator() {
  const [state, setState] = useState<PasswordState>({ /* ... */ });

  const generate = useCallback(() => {
    // Use crypto.getRandomValues, never Math.random
  }, [deps]);

  return { state, generate, setLength, toggleDigits };
}
```

### Error Handling
```typescript
const handleAsync = async () => {
  try {
    await operation();
  } catch (error) {
    console.error('Operation failed:', error);
    toast.error('Operation failed');
  }
};
```

### Styling
- Tailwind utility classes only
- `cn()` from `@/lib/utils` for conditional class merging
- Dark mode: `dark:` variants
- Mobile-first responsive design

```typescript
<div className="bg-card border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-6">
```

## Testing Patterns

### Unit Tests (Vitest)
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePasswordGenerator } from '@/hooks/use-password-generator';
import { generatePassword } from '@/lib/crypto';

vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return { ...actual, generatePassword: vi.fn() };
});

describe('usePasswordGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(generatePassword).mockReturnValue('test-password');
  });

  it('initializes with default settings', () => {
    const { result } = renderHook(() => usePasswordGenerator());
    expect(result.current.state.length).toBe(8);
  });
});
```

### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('generates password on page load', async ({ page }) => {
  const display = page.getByTestId('password-display');
  await expect(display).toBeVisible();
  const text = await display.getByRole('paragraph').textContent();
  expect(text).toBeTruthy();
});
```

### Test Mocking (tests/setup.ts)
- Web Crypto API via `node:crypto` polyfill
- localStorage in-memory mock
- Clipboard API (`navigator.clipboard`)
- Global `fetch` mock
- Toast notifications (sonner)
- EFF wordlist minimal mock
- ResizeObserver & matchMedia mocks

## Security Guidelines

1. **Random Generation**: Always use `crypto.getRandomValues()` - NEVER `Math.random()`
2. **No Logging**: Never log generated passwords in production code
3. **Input Validation**: Validate all user inputs (lengths within bounds)
4. **Client-side Only**: All generation happens client-side, no server storage