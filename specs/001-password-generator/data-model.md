# Data Model: Password Generator Web Application

**Feature**: Password Generator Web Application
**Date**: 2026-02-22
**Purpose**: Define data structures, types, and validation rules for the application

## TypeScript Type Definitions

### Generator Types

```typescript
// Credential generation modes
type CredentialType = 'password' | 'pin' | 'passphrase'

// Character sets for password generation
type CharacterSet = 'lowercase' | 'uppercase' | 'digits' | 'symbols'

// Separator options for passphrase
type Separator = 'space' | 'hyphen' | 'underscore' | 'period'

// Theme modes
type ThemeMode = 'light' | 'dark'

// Strength levels
type StrengthLevel = 'weak' | 'medium' | 'strong'

// Breach check status
type BreachCheckStatus = 'idle' | 'checking' | 'safe' | 'breached' | 'error'
```

### Password Generation State

```typescript
interface PasswordState {
  type: 'password'
  value: string
  length: number
  includeDigits: boolean
  includeSymbols: boolean
  includeUppercase: boolean
  strength: StrengthLevel
  breachCheck: BreachCheckStatus
  breachCount?: number
}
```

**Validation Rules**:
- `length` MUST be between 8 and 50 (inclusive)
- At least one character set MUST be enabled (FR-001, FR-002, FR-003, FR-004)
- `value` MUST be generated using cryptographically secure random (FR-035)
- `value` MUST contain only characters from enabled character sets

### PIN Generation State

```typescript
interface PinState {
  type: 'pin'
  value: string
  length: number
  strength: StrengthLevel
  breachCheck: BreachCheckStatus
  breachCount?: number
}
```

**Validation Rules**:
- `length` MUST be between 3 and 12 (inclusive) (FR-009, FR-010)
- `value` MUST contain only digits (0-9) (FR-007)
- `value` MUST be generated using cryptographically secure random (FR-035)

### Passphrase Generation State

```typescript
interface PassphraseState {
  type: 'passphrase'
  value: string
  wordCount: number
  separator: Separator
  strength: StrengthLevel
  breachCheck: BreachCheckStatus
  breachCount?: number
}
```

**Validation Rules**:
- `wordCount` MUST be between 4 and 10 (inclusive) (FR-013, FR-014)
- `separator` MUST be one of: 'space', 'hyphen', 'underscore', 'period' (FR-015)
- `value` MUST contain words from EFF Long Wordlist (7776 words) (FR-011)
- `value` MUST be generated using cryptographically secure random (FR-035)

### Combined Credential State

```typescript
type CredentialState = PasswordState | PinState | PassphraseState

interface GeneratorState {
  activeType: CredentialType
  password: PasswordState
  pin: PinState
  passphrase: PassphraseState
}
```

**State Transitions**:
1. **Initial Load**: Generate default credential based on active type
   - Password: 8 characters, lowercase only
   - PIN: 3 digits
   - Passphrase: 4 words, hyphen separator
2. **Tab Switch**: Switch active type, preserve state of each type
3. **Refresh**: Regenerate credential for active type
4. **Settings Change**: Update settings and regenerate credential
5. **Breach Check**: Update breach status for active credential

### Theme State

```typescript
interface ThemeState {
  mode: ThemeMode
}
```

**Validation Rules**:
- `mode` MUST be 'light' or 'dark' (FR-027, FR-028)
- Default to 'light' on initial load (FR-027)
- Persist to localStorage (FR-034)

### Toast State

```typescript
interface ToastState {
  visible: boolean
  message: string
  type: 'success' | 'error'
}
```

**Validation Rules**:
- `visible` MUST be boolean
- `message` MUST be non-empty string when visible
- `type` MUST be 'success' or 'error'
- Auto-dismiss after 3 seconds (SC-009)

## Character Sets

### Lowercase Letters
```typescript
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
```

### Uppercase Letters
```typescript
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
```

### Digits
```typescript
const DIGITS = '0123456789'
```

### Symbols
```typescript
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
```

### Character Set Mapping
```typescript
const CHARACTER_SETS: Record<CharacterSet, string> = {
  lowercase: LOWERCASE,
  uppercase: UPPERCASE,
  digits: DIGITS,
  symbols: SYMBOLS,
}
```

## Separator Mapping

```typescript
const SEPARATORS: Record<Separator, string> = {
  space: ' ',
  hyphen: '-',
  underscore: '_',
  period: '.',
}
```

## Strength Calculation

### Entropy Calculation
```typescript
function calculateEntropy(length: number, characterSetSize: number): number {
  return length * Math.log2(characterSetSize)
}
```

### Strength Classification
```typescript
function classifyStrength(entropy: number): StrengthLevel {
  if (entropy < 40) return 'weak'
  if (entropy < 60) return 'medium'
  return 'strong'
}
```

### Password Strength
```typescript
function calculatePasswordStrength(
  length: number,
  includeDigits: boolean,
  includeSymbols: boolean,
  includeUppercase: boolean
): StrengthLevel {
  let characterSetSize = 26 // lowercase
  if (includeUppercase) characterSetSize += 26
  if (includeDigits) characterSetSize += 10
  if (includeSymbols) characterSetSize += 28 // symbols count
  
  const entropy = calculateEntropy(length, characterSetSize)
  return classifyStrength(entropy)
}
```

### PIN Strength
```typescript
function calculatePinStrength(length: number): StrengthLevel {
  const characterSetSize = 10 // digits only
  const entropy = calculateEntropy(length, characterSetSize)
  return classifyStrength(entropy)
}
```

### Passphrase Strength
```typescript
function calculatePassphraseStrength(wordCount: number): StrengthLevel {
  const wordSetSize = 7776 // EFF Long Wordlist
  const entropy = calculateEntropy(wordCount, wordSetSize)
  return classifyStrength(entropy)
}
```

## Breach Check Data

### API Request
```typescript
interface BreachCheckRequest {
  hashPrefix: string // First 5 characters of SHA-1 hash
}
```

### API Response
```typescript
interface BreachCheckResponse {
  [suffix: string]: number // Number of times the full hash has been seen
}
```

### Breach Check Result
```typescript
interface BreachCheckResult {
  status: BreachCheckStatus
  count?: number
  error?: string
}
```

## Local Storage Keys

```typescript
const STORAGE_KEYS = {
  THEME: 'password-generator-theme',
} as const
```

## Constants

### Password Constraints
```typescript
const PASSWORD_CONSTRAINTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 50,
  DEFAULT_LENGTH: 8,
} as const
```

### PIN Constraints
```typescript
const PIN_CONSTRAINTS = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 12,
  DEFAULT_LENGTH: 3,
} as const
```

### Passphrase Constraints
```typescript
const PASSPHRASE_CONSTRAINTS = {
  MIN_WORDS: 4,
  MAX_WORDS: 10,
  DEFAULT_WORDS: 4,
  DEFAULT_SEPARATOR: 'hyphen' as Separator,
} as const
```

### Performance Targets
```typescript
const PERFORMANCE_TARGETS = {
  GENERATION_TIME_MS: 100,
  THEME_TOGGLE_TIME_MS: 100,
  BREACH_CHECK_TIME_MS: 3000,
  PAGE_LOAD_TIME_MS: 2000,
  TOAST_DURATION_MS: 3000,
} as const
```

### API Configuration
```typescript
const API_CONFIG = {
  HIBP_BASE_URL: 'https://api.pwnedpasswords.com/range/',
  HIBP_RATE_LIMIT: 1500, // requests per day
  HIBP_REQUEST_TIMEOUT_MS: 5000,
} as const
```

## EFF Long Wordlist Structure

```typescript
// Wordlist is bundled as a TypeScript array
// Format: string[] (7776 words)
// Example: ['correct', 'horse', 'battery', 'staple', ...]

declare const EFF_LONG_WORDLIST: string[]
```

## Component Props

### PasswordDisplay Props
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

### PasswordControls Props
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

### PinControls Props
```typescript
interface PinControlsProps {
  length: number
  onLengthChange: (length: number) => void
}
```

### PassphraseControls Props
```typescript
interface PassphraseControlsProps {
  wordCount: number
  separator: Separator
  onWordCountChange: (wordCount: number) => void
  onSeparatorChange: (separator: Separator) => void
}
```

### StrengthIndicator Props
```typescript
interface StrengthIndicatorProps {
  strength: StrengthLevel
}
```

### ThemeToggle Props
```typescript
interface ThemeToggleProps {
  mode: ThemeMode
  onToggle: () => void
}
```

## Relationships

### State Hierarchy
```
GeneratorState
├── activeType: CredentialType
├── password: PasswordState
│   ├── value: string
│   ├── length: number
│   ├── includeDigits: boolean
│   ├── includeSymbols: boolean
│   ├── includeUppercase: boolean
│   ├── strength: StrengthLevel
│   └── breachCheck: BreachCheckStatus
├── pin: PinState
│   ├── value: string
│   ├── length: number
│   ├── strength: StrengthLevel
│   └── breachCheck: BreachCheckStatus
└── passphrase: PassphraseState
    ├── value: string
    ├── wordCount: number
    ├── separator: Separator
    ├── strength: StrengthLevel
    └── breachCheck: BreachCheckStatus
```

### Component Hierarchy
```
Page (app/page.tsx)
├── Layout (components/layout.tsx)
│   ├── ThemeToggle (components/password-generator/theme-toggle.tsx)
│   └── PasswordGenerator (main component)
│       ├── Tabs (Shadcn UI)
│       │   ├── Password Tab
│       │   │   ├── PasswordDisplay
│       │   │   │   ├── Refresh Button
│       │   │   │   ├── Copy Button
│       │   │   │   ├── Breach Check Button
│       │   │   │   └── StrengthIndicator
│       │   │   └── PasswordControls
│       │   │       ├── Length Slider
│       │   │       ├── Digits Toggle
│       │   │       ├── Symbols Toggle
│       │   │       └── Uppercase Toggle
│       │   ├── PIN Tab
│       │   │   ├── PasswordDisplay (reused)
│       │   │   │   └── [same buttons]
│       │   │   └── PinControls
│       │   │       └── Length Slider
│       │   └── Passphrase Tab
│       │       ├── PasswordDisplay (reused)
│       │       │   └── [same buttons]
│       │       └── PassphraseControls
│       │           ├── Word Count Slider
│       │           └── Separator Selector
│       └── Toast (Shadcn UI)
```

## Validation Summary

All validation rules are derived from functional requirements (FR-001 through FR-034) and ensure:
- Type safety with TypeScript strict mode
- Constraint enforcement (length, character sets, word count)
- State consistency across credential types
- Proper error handling for edge cases
- Performance target compliance
