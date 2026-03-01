# nextjs-password-generator - Agent Development Guide

## Project Overview

Secure password generator: Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, Shadcn UI, Web Crypto API.

## Build/Lint/Test Commands

### Development
```bash
npm run dev          # localhost:3000
npm run build        # Production
npm run start        # Production server
npm run lint         # ESLint
```

### Unit Tests (Vitest)
```bash
npm test                          # All tests
npm run test:watch                # Watch mode
npm run test:ui                   # UI mode
npm run test:coverage             # Coverage
npx vitest run tests/unit/hooks/use-password-generator.test.ts  # Single file
npx vitest run -t "pattern"       # By pattern
```

### E2E Tests (Playwright)
```bash
npm run test:e2e                  # All E2E
npm run test:e2e:ui               # UI mode
npm run test:e2e:debug            # Debug mode
npm run test:e2e:headed           # Headed browser
npx playwright test tests/e2e/password-generation.spec.ts  # Single file
npx playwright test -g "title"    # By title
```

## Project Structure

```
├── app/
│   ├── components/password-generator/  # Domain components
│   ├── components/ui/                   # Shadcn UI
│   ├── hooks/                           # Custom hooks
│   ├── lib/                             # Utils & core logic
│   ├── types/                           # TypeScript defs
│   ├── layout.tsx
│   └── page.tsx
├── components/                          # Shared Shadcn UI
├── lib/cn.ts                           # Class merge utility
├── tests/unit/                          # Vitest
├── tests/e2e/                           # Playwright
└── tests/setup.ts                       # Test mocks
```

## Code Style

### Import Order
1. React/Next.js
2. Third-party
3. Internal (`@/`)
4. Types (`type` keyword)
5. Relative

```typescript
import { useState } from 'react';
import { renderHook } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { generatePassword } from '@/lib/crypto';
import type { PasswordState } from '@/types/generator';
```

### TypeScript (Strict Mode)
- Explicit return types for exports
- Interfaces for objects, types for unions
- `as const` for constants

```typescript
export interface PasswordState { type: 'password'; value: string; }
export type StrengthLevel = 'WEAK' | 'MODERATE' | 'STRONG';
export const LIMITS = { MIN: 8, MAX: 50 } as const;
```

### Naming
- Components: PascalCase (`PasswordDisplay`)
- Hooks: camelCase with `use` prefix (`usePasswordGenerator`)
- Functions: camelCase (`generatePassword`)
- Constants: SCREAMING_SNAKE_CASE (`PASSWORD_CONSTRAINTS`)
- Test files: `*.test.ts`, `*.spec.ts`
- Test IDs: kebab-case `data-testid="password-display"`

### React Components
```typescript
'use client';
import { useState } from 'react';
import type { PropsType } from '@/types';

interface ComponentProps { value: string; onChange: () => void; }
export function Component({ value, onChange }: ComponentProps) { /* ... */ }
```

### Hooks
```typescript
export function usePasswordGenerator() {
  const [state, setState] = useState<State>({});
  const action = useCallback(() => { /* ... */ }, [deps]);
  return { state, action };
}
```

### Error Handling
```typescript
const handleAsync = async () => {
  try {
    await operation();
  } catch (error) {
    console.error('Description:', error);
  }
};
```

### Testing
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('@/lib/crypto', async () => {
  const actual = await vi.importActual('@/lib/crypto');
  return { ...actual, generatePassword: vi.fn() };
});

describe('hook name', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it('does something', () => {
    const { result } = renderHook(() => useHook());
    expect(result.current.value).toBe('expected');
  });
});
```

### Styling
- Tailwind utility classes
- `cn()` for conditional merging
- Dark mode: `dark:` variants
- Mobile-first responsive

```typescript
<div className="bg-card border-2 border-zinc-200 dark:border-zinc-700 rounded-lg p-6">
```

### Security
- Use `crypto.getRandomValues` (Web Crypto API) — never `Math.random()`
- Never log passwords in production
- Validate all inputs

## Context7 MCP

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.
