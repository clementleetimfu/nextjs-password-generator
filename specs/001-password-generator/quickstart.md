# Quickstart Guide: Password Generator Web Application

**Feature**: Password Generator Web Application
**Date**: 2026-02-22
**Purpose**: Quick reference guide for developers working on this feature

## Prerequisites

- Node.js LTS version installed
- npm or yarn package manager
- Git for version control
- Code editor with TypeScript support (VS Code recommended)

## Project Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure TypeScript

Ensure `tsconfig.json` has strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 3. Configure Tailwind CSS

Ensure `tailwind.config.ts` is configured:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-space-mono)', 'monospace'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
```

### 4. Configure Prettier

Create `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 5. Configure ESLint

Ensure `eslint.config.mjs` is configured:

```javascript
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]

export default eslintConfig
```

## Development Workflow

### Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Run Tests

```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Lint and Format

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Run Prettier
npm run format

# Check Prettier
npm run format:check
```

## Project Structure

```
app/
├── components/
│   ├── ui/                    # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── switch.tsx
│   │   └── slider.tsx
│   └── password-generator/       # Feature components
│       ├── password-display.tsx
│       ├── password-controls.tsx
│       ├── pin-controls.tsx
│       ├── passphrase-controls.tsx
│       ├── strength-indicator.tsx
│       └── theme-toggle.tsx
├── hooks/
│   ├── use-password-generator.ts
│   ├── use-pin-generator.ts
│   ├── use-passphrase-generator.ts
│   ├── use-strength-check.ts
│   ├── use-breach-check.ts
│   └── use-theme.ts
├── lib/
│   ├── crypto.ts
│   ├── eff-wordlist.ts
│   ├── strength.ts
│   └── breach-check.ts
├── types/
│   └── generator.ts
└── page.tsx

tests/
├── unit/
│   ├── crypto.test.ts
│   ├── strength.test.ts
│   └── breach-check.test.ts
└── e2e/
    ├── password-generation.spec.ts
    ├── pin-generation.spec.ts
    ├── passphrase-generation.spec.ts
    ├── security-features.spec.ts
    └── ui-ux.spec.ts
```

## Key Components

### Password Display (`password-display.tsx`)

Displays the generated credential with action buttons:

```typescript
interface PasswordDisplayProps {
  value: string
  type: CredentialType
  strength: StrengthLevel
  breachCheck: BreachCheckStatus
  onRefresh: () => void
  onCopy: () => void
  onBreachCheck: () => void
}
```

### Password Controls (`password-controls.tsx`)

Controls for password generation settings:

```typescript
interface PasswordControlsProps {
  length: number
  includeDigits: boolean
  includeSymbols: boolean
  includeUppercase: boolean
  onLengthChange: (length: number) => void
  onToggleDigits: () => void
  onToggleSymbols: () => void
  onToggleUppercase: () => void
}
```

### Strength Indicator (`strength-indicator.tsx`)

Visual indicator of credential strength:

```typescript
interface StrengthIndicatorProps {
  strength: StrengthLevel
}
```

### Theme Toggle (`theme-toggle.tsx`)

Toggle for light/dark mode:

```typescript
interface ThemeToggleProps {
  mode: ThemeMode
  onToggle: () => void
}
```

## Key Hooks

### usePasswordGenerator

Manages password generation state and logic:

```typescript
function usePasswordGenerator() {
  const [state, setState] = useState<PasswordState>({
    type: 'password',
    value: '',
    length: PASSWORD_CONSTRAINTS.DEFAULT_LENGTH,
    includeDigits: false,
    includeSymbols: false,
    includeUppercase: false,
    strength: 'weak',
    breachCheck: 'idle',
  })

  const generatePassword = useCallback(() => {
    // Generate password using crypto.ts
  }, [state.length, state.includeDigits, state.includeSymbols, state.includeUppercase])

  const refresh = useCallback(() => {
    generatePassword()
  }, [generatePassword])

  const copyToClipboard = useCallback(async () => {
    // Copy to clipboard
  }, [state.value])

  const checkBreach = useCallback(async () => {
    // Check breach using breach-check.ts
  }, [state.value])

  return { state, refresh, copyToClipboard, checkBreach }
}
```

### useTheme

Manages theme state and persistence:

```typescript
function useTheme() {
  const [mode, setMode] = useState<ThemeMode>('light')

  useEffect(() => {
    // Load theme from localStorage
    const saved = localStorage.getItem(STORAGE_KEYS.THEME)
    if (saved === 'light' || saved === 'dark') {
      setMode(saved)
    }
  }, [])

  const toggle = useCallback(() => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem(STORAGE_KEYS.THEME, newMode)
  }, [mode])

  return { mode, toggle }
}
```

## Key Utilities

### Crypto Functions (`lib/crypto.ts`)

```typescript
// Generate cryptographically secure random password
function generatePassword(
  length: number,
  includeDigits: boolean,
  includeSymbols: boolean,
  includeUppercase: boolean
): string

// Generate cryptographically secure random PIN
function generatePin(length: number): string

// Generate cryptographically secure random passphrase
function generatePassphrase(wordCount: number, separator: string): string
```

### Strength Calculation (`lib/strength.ts`)

```typescript
// Calculate password strength
function calculatePasswordStrength(
  length: number,
  includeDigits: boolean,
  includeSymbols: boolean,
  includeUppercase: boolean
): StrengthLevel

// Calculate PIN strength
function calculatePinStrength(length: number): StrengthLevel

// Calculate passphrase strength
function calculatePassphraseStrength(wordCount: number): StrengthLevel
```

### Breach Check (`lib/breach-check.ts`)

```typescript
// Check if credential has been breached
async function checkBreach(credential: string): Promise<BreachCheckResult>
```

## Shadcn UI Components

### Button

```typescript
import { Button } from '@/components/ui/button'

<Button onClick={handleClick}>
  Click me
</Button>
```

### Tabs

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="password">
  <TabsList>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="pin">PIN</TabsTrigger>
    <TabsTrigger value="passphrase">Passphrase</TabsTrigger>
  </TabsList>
  <TabsContent value="password">...</TabsContent>
  <TabsContent value="pin">...</TabsContent>
  <TabsContent value="passphrase">...</TabsContent>
</Tabs>
```

### Toast

```typescript
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

toast({
  title: 'Success',
  description: 'Password copied to clipboard',
  duration: 3000,
})
```

### Switch

```typescript
import { Switch } from '@/components/ui/switch'

<Switch
  checked={includeDigits}
  onCheckedChange={setIncludeDigits}
/>
```

### Slider

```typescript
import { Slider } from '@/components/ui/slider'

<Slider
  value={[length]}
  onValueChange={([value]) => setLength(value)}
  min={8}
  max={50}
/>
```

## Testing

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { generatePassword } from '@/lib/crypto'

describe('generatePassword', () => {
  it('should generate a password of correct length', () => {
    const password = generatePassword(12, false, false, false)
    expect(password).toHaveLength(12)
  })

  it('should include digits when enabled', () => {
    const password = generatePassword(12, true, false, false)
    expect(password).toMatch(/[0-9]/)
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('password generation flow', async ({ page }) => {
  await page.goto('/')
  
  // Generate password
  await page.click('button[aria-label="Refresh password"]')
  const password = await page.locator('[data-testid="password-display"]').textContent()
  expect(password).toBeTruthy()
  
  // Copy to clipboard
  await page.click('button[aria-label="Copy to clipboard"]')
  await expect(page.locator('.toast')).toContainText('copied')
})
```

## Common Patterns

### State Management

Use React hooks for local state:

```typescript
const [value, setValue] = useState<string>('')
const [loading, setLoading] = useState<boolean>(false)
```

### Effect Hooks

Use `useEffect` for side effects:

```typescript
useEffect(() => {
  // Load theme from localStorage
  const saved = localStorage.getItem(STORAGE_KEYS.THEME)
  if (saved) {
    setMode(saved as ThemeMode)
  }
}, [])
```

### Memoization

Use `useCallback` and `useMemo` for performance:

```typescript
const generatePassword = useCallback(() => {
  // Generate password
}, [length, includeDigits, includeSymbols, includeUppercase])

const strength = useMemo(() => {
  return calculatePasswordStrength(length, includeDigits, includeSymbols, includeUppercase)
}, [length, includeDigits, includeSymbols, includeUppercase])
```

### Error Handling

Handle errors gracefully:

```typescript
try {
  const result = await checkBreach(credential)
  setBreachCheck(result.status)
} catch (error) {
  console.error('Breach check failed:', error)
  setBreachCheck('error')
}
```

## Troubleshooting

### TypeScript Errors

- Ensure all types are explicitly defined (strict mode)
- Check for `any` types and replace with specific types
- Verify imports are correct

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`
- Check for circular dependencies

### Test Failures

- Check if mocks are properly configured
- Verify test data is valid
- Ensure async tests use `await`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
