# nextjs-password-generator - Agent Development Guide

## Project Overview

A secure password generator built with Next.js 16 (App Router), React 19, TypeScript (strict mode), Tailwind CSS, and Shadcn UI (Radix UI primitives). Uses Web Crypto API for cryptographically secure random generation.

## Build/Lint/Test Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint on entire codebase
```

### Unit Testing (Vitest)
```bash
npm test                          # Run all unit tests
npm run test:watch                # Run tests in watch mode
npm run test:ui                   # Run tests with UI
npm run test:coverage             # Run tests with coverage report

# Run a single test file
npx vitest run tests/unit/hooks/use-password-generator.test.ts

# Run tests matching a pattern
npx vitest run -t "initializes and generates"
```

### E2E Testing (Playwright)
```bash
npm run test:e2e                  # Run all E2E tests
npm run test:e2e:ui               # Run E2E tests with UI
npm run test:e2e:debug            # Run E2E tests in debug mode
npm run test:e2e:headed           # Run E2E tests in headed mode

# Run a single E2E test file
npx playwright test tests/e2e/password-generation.spec.ts

# Run a specific test by title
npx playwright test -g "should generate password on page load"
```

## Project Structure

```
├── app/                           # Next.js App Router
│   ├── components/                # React components
│   │   ├── password-generator/    # Domain components
│   │   └── ui/                    # Shadcn UI components
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility functions and core logic
│   ├── types/                     # TypeScript type definitions
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── components/                    # Shared UI components (Shadcn)
├── lib/                           # Shared utilities (cn function)
├── tests/
│   ├── unit/                      # Vitest unit tests
│   ├── e2e/                       # Playwright E2E tests
│   ├── setup.ts                   # Test setup and mocks
│   └── test-helpers.ts            # Test utilities
└── specs/                         # Feature specifications
```

## Code Style Guidelines

### Imports

Order imports as follows (separated by blank lines):
1. React/Next.js imports
2. Third-party libraries
3. Internal aliases (`@/`)
4. Types (with `type` keyword)
5. Relative imports

```typescript
import { useState, useCallback, useEffect } from 'react';
import { renderHook, act } from '@testing-library/react';

import { Button } from '@/components/ui/button';
import { generatePassword } from '@/lib/crypto';
import type { PasswordState } from '@/types/generator';
```

Use path aliases consistently:
- `@/components/` for UI components
- `@/lib/` for utilities
- `@/hooks/` for hooks
- `@/types/` for types

### TypeScript

- Strict mode is enabled - all code must be type-safe
- Use explicit return types for exported functions
- Prefer interfaces for object types, types for unions/primitives
- Use `as const` for literal constants and readonly arrays

```typescript
// Preferred
export interface PasswordState {
  type: 'password';
  value: string;
  length: number;
}

export type StrengthLevel = 'VERY_WEAK' | 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG';

export const PASSWORD_CONSTRAINTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 50,
  DEFAULT_LENGTH: 8,
} as const;
```

### Naming Conventions

- **Components**: PascalCase (e.g., `PasswordDisplay`, `ThemeToggle`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePasswordGenerator`)
- **Functions**: camelCase (e.g., `generatePassword`, `calculateStrength`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `PASSWORD_CONSTRAINTS`, `CHARACTER_SETS`)
- **Types/Interfaces**: PascalCase (e.g., `PasswordState`, `StrengthLevel`)
- **Test files**: Match source file with `.test.ts` or `.spec.ts` suffix
- **Test IDs**: kebab-case with `data-testid` (e.g., `data-testid="password-display"`)

### React Components

- Use function declarations with named exports
- Define interfaces for props at the top of the file
- Use `'use client'` directive for client components
- Prefer destructured props

```typescript
'use client';

import { useState } from 'react';
import type { CredentialType } from '@/types/generator';

interface PasswordDisplayProps {
  value: string;
  type: CredentialType;
  onRefresh: () => void;
}

export function PasswordDisplay({ value, type, onRefresh }: PasswordDisplayProps) {
  // Component logic
}
```

### Hooks

- Return an object with state and actions
- Use `useCallback` for functions returned from hooks
- Handle side effects with `useEffect`

```typescript
export function usePasswordGenerator() {
  const [state, setState] = useState<PasswordState>({ /* ... */ });

  const generate = useCallback(() => {
    // ...
  }, [dependencies]);

  return { state, generate, setLength, toggleDigits };
}
```

### Error Handling

- Use try/catch for async operations
- Log errors to console.error with descriptive messages
- Provide user-friendly error states

```typescript
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(value);
    onCopy();
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
  }
};
```

### Testing

- Unit tests use Vitest with `describe`/`it`/`expect`
- Mock external dependencies at the top of test files
- Use `vi.mock` with `vi.importActual` for partial mocks
- E2E tests use Playwright with `test`/`expect`
- Use `data-testid` attributes for E2E selectors

```typescript
// Unit test pattern
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual<typeof import('@/lib/crypto')>('@/lib/crypto');
  return { ...actual, generatePassword: vi.fn() };
});

describe('usePasswordGenerator hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes and generates a value', () => {
    const { result } = renderHook(() => usePasswordGenerator());
    expect(result.current.state.value).toBeTruthy();
  });
});
```

### Styling

- Use Tailwind CSS utility classes
- Use `cn()` utility for conditional class merging
- Support dark mode with `dark:` variants
- Follow mobile-first responsive design

```typescript
<div className="bg-card border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-6">
```

### Security

- Use Web Crypto API (`crypto.getRandomValues`) for secure random generation
- Never log or expose generated passwords in production
- Validate all inputs before use

## Context7 MCP

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.