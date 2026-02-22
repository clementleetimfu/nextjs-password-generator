# Research: Password Generator Web Application

**Feature**: Password Generator Web Application
**Date**: 2026-02-22
**Purpose**: Technical research and decision documentation for Phase 0

## Cryptographically Secure Random Generation

### Decision
Use Web Crypto API (`window.crypto.getRandomValues()`) for cryptographically secure random number generation.

### Rationale
- Native browser API with no external dependencies
- Provides cryptographically strong random values suitable for security-sensitive applications
- Widely supported across modern browsers (Chrome, Firefox, Safari, Edge)
- Performance is excellent for the scale needed (passwords, PINs, passphrases)
- Aligns with FR-035 requirement for cryptographically secure random generation

### Alternatives Considered
- **crypto-js**: External library that adds bundle size; provides similar functionality but not necessary
- **Math.random()**: Not cryptographically secure; predictable and unsuitable for passwords
- **Node.js crypto module**: Server-side only; not applicable for client-side generation

## Password Strength Calculation

### Decision
Implement custom strength calculation algorithm based on entropy and character variety.

### Rationale
- Allows fine-grained control over strength classification (weak/medium/strong)
- Can be tailored to match FR-018 requirements
- No external dependencies needed
- Performance is excellent for client-side calculation
- Can be tested independently with unit tests

### Algorithm
Calculate entropy based on:
1. **Character set size**: Larger sets = more entropy
   - Lowercase only: 26 characters
   - Lowercase + uppercase: 52 characters
   - Lowercase + digits: 36 characters
   - Lowercase + uppercase + digits: 62 characters
   - Lowercase + uppercase + digits + symbols: 94+ characters
2. **Length**: Longer = more entropy
3. **Variety**: More character types used = more entropy

**Strength Classification**:
- **Weak**: Entropy < 40 bits (e.g., 8-char lowercase, 3-4 digit PIN, 4-word passphrase)
- **Medium**: Entropy 40-60 bits (e.g., 12-char mixed, 6-8 digit PIN, 5-7 word passphrase)
- **Strong**: Entropy > 60 bits (e.g., 16+ char mixed, 10-12 digit PIN, 8-10 word passphrase)

### Alternatives Considered
- **zxcvbn**: Popular library but adds bundle size; overkill for this use case
- **External API**: Privacy concern; sends passwords to third-party service
- **Simple length-based**: Too simplistic; doesn't account for character variety

## Have I Been Pwned API Integration

### Decision
Use Have I Been Pwned Pwned Passwords API (k-anonymity) for breach checking.

### Rationale
- Industry-standard API for password breach checking
- Supports k-anonymity (first 5 characters of SHA-1 hash) - doesn't send full password
- Free tier supports 1500 requests/day (sufficient for typical usage)
- Well-documented with clear rate limiting
- Aligns with FR-019 and FR-020 requirements

### Implementation Details
- Send first 5 characters of SHA-1 hash of password/PIN/passphrase
- API returns list of suffixes that match
- If any suffix matches, password has been breached
- Handle rate limits (429 Too Many Requests) gracefully
- Handle network errors with user-friendly messages
- Cache results to avoid repeated API calls for same credential

### Alternatives Considered
- **Full hash submission**: Privacy concern; sends complete password hash
- **No breach checking**: Doesn't meet FR-019 requirement
- **Custom breach database**: Would require maintaining large database; not feasible

## EFF Long Wordlist Integration

### Decision
Bundle EFF Long Wordlist (7776 words) as a TypeScript array in the application.

### Rationale
- No external dependencies or API calls needed
- Instant word selection (no network latency)
- Aligns with FR-011 requirement for EFF Long Wordlist
- File size is manageable (~50KB compressed)
- Words are common and memorable for users

### Wordlist Details
- 7776 unique words
- Each word is 6-8 characters long
- Words are sorted alphabetically for easy indexing
- Use `crypto.getRandomValues()` to select random indices

### Alternatives Considered
- **API call**: Adds latency and rate limiting; unnecessary for static wordlist
- **Short wordlist (1296 words)**: Less entropy; weaker passphrases
- **Custom wordlist**: Would require curation; EFF is industry standard

## Theme Persistence

### Decision
Use `localStorage` to persist theme preference (light/dark mode) between visits.

### Rationale
- Native browser API with no external dependencies
- Persists across browser sessions
- Simple key-value storage
- Aligns with FR-034 requirement for theme persistence
- Fallback to light mode if localStorage is unavailable

### Implementation Details
- Key: `password-generator-theme`
- Values: `'light'` or `'dark'`
- Read on page load; default to `'light'` if not found
- Write on theme toggle
- Handle quota exceeded errors gracefully

### Alternatives Considered
- **sessionStorage**: Only persists for current session; doesn't meet FR-034
- **Cookies**: Overkill; adds unnecessary complexity
- **No persistence**: Doesn't meet FR-034 requirement

## Toast Notifications

### Decision
Use Shadcn UI Toast component (based on Sonner) for toast notifications.

### Rationale
- Part of Shadcn UI ecosystem (constitution requirement)
- Provides beautiful, accessible toast notifications
- Supports positioning (upper center per FR-022 and FR-024)
- Supports auto-dismiss and manual dismiss
- Excellent TypeScript support
- Aligns with constitution's UI Standards requirement

### Implementation Details
- Use `use-toast` hook from Shadcn UI
- Position: `top-center`
- Duration: 3 seconds (aligns with SC-009)
- Show on successful refresh and copy actions
- Handle rapid clicks gracefully (debounce if needed)

### Alternatives Considered
- **Custom toast implementation**: More work; may not be as accessible
- **react-hot-toast**: External library; Shadcn UI provides equivalent
- **No toast**: Doesn't meet FR-022 and FR-024 requirements

## Tab Navigation

### Decision
Use Shadcn UI Tabs component for switching between password, PIN, and passphrase modes.

### Rationale
- Part of Shadcn UI ecosystem (constitution requirement)
- Provides accessible tab navigation
- Supports keyboard navigation
- Excellent TypeScript support
- Aligns with FR-030 requirement for tab navigation
- Consistent with modern UI patterns

### Implementation Details
- Three tabs: Password, PIN, Passphrase
- Maintain separate state for each mode
- Preserve settings when switching between tabs
- Default to Password tab on initial load

### Alternatives Considered
- **Custom tab implementation**: More work; may not be as accessible
- **Segmented control**: Less standard for this use case
- **Radio buttons**: Less intuitive for mode switching

## Responsive Design

### Decision
Use Tailwind CSS responsive utilities with mobile-first approach.

### Rationale
- Tailwind CSS is part of technology stack (constitution requirement)
- Mobile-first approach ensures mobile experience is prioritized
- Breakpoints align with FR-031, FR-032, FR-033 requirements:
  - Mobile: < 768px (sm breakpoint)
  - Tablet: 768px - 1024px (md breakpoint)
  - Desktop: > 1024px (lg breakpoint)
- Utility-first approach is efficient and maintainable
- Aligns with constitution's KISS principle

### Implementation Details
- Use `flex`, `grid`, and spacing utilities for layout
- Use responsive text sizing (`text-sm`, `text-base`, `text-lg`)
- Use responsive spacing (`p-4`, `p-6`, `p-8`)
- Test on actual devices (desktop, tablet, mobile) with Playwright
- Ensure touch targets are at least 44x44px on mobile

### Alternatives Considered
- **CSS Grid/Flexbox with custom media queries**: More verbose; Tailwind is cleaner
- **CSS-in-JS libraries**: Adds complexity; Tailwind is sufficient
- **Fixed layouts**: Doesn't meet responsive requirements

## Font Configuration

### Decision
Use Space Mono font via `next/font` for all text elements.

### Rationale
- Space Mono is specified in constitution as primary font
- `next/font` provides optimized font loading (constitution requirement)
- Monospace font is appropriate for passwords/PINs/passphrases
- Ensures character alignment for better readability
- Supports bold (700) weight for emphasis

### Implementation Details
```typescript
import { Space_Mono } from 'next/font/google'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export { spaceMono }
```

Apply to root layout:
```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceMono.className}>
      <body>{children}</body>
    </html>
  )
}
```

### Alternatives Considered
- **System fonts**: Inconsistent across devices; doesn't meet constitution requirement
- **Other monospace fonts**: Space Mono is specified in constitution
- **Variable fonts**: Overkill for this use case

## Testing Strategy

### Decision
Use Vitest for unit tests and Playwright for E2E tests.

### Rationale
- Vitest is fast and has excellent TypeScript support
- Playwright is specified in constitution for E2E testing
- Both integrate well with Next.js
- Aligns with constitution's Testing Requirements
- Supports TDD approach (constitution preference)

### Unit Testing (Vitest)
- Test password generation logic (crypto.ts)
- Test PIN generation logic (crypto.ts)
- Test passphrase generation logic (crypto.ts)
- Test strength calculation (strength.ts)
- Test breach check API integration (breach-check.ts)
- Mock Web Crypto API and fetch for unit tests

### E2E Testing (Playwright)
- Test password generation flow (US1)
- Test PIN generation flow (US2)
- Test passphrase generation flow (US3)
- Test security features (US4)
- Test UI/UX features (US5)
- Test responsive design on different viewports
- Test theme persistence across page reloads

### Alternatives Considered
- **Jest**: Slower than Vitest; Vitest is more modern
- **Cypress**: Heavier than Playwright; Playwright is specified in constitution
- **No E2E tests**: Doesn't meet constitution requirement

## Code Quality Tools

### Decision
Use ESLint with TypeScript and Next.js configurations, and Prettier for formatting.

### Rationale
- Both are specified in constitution as code quality tools
- ESLint provides type checking and linting
- Prettier ensures consistent formatting
- Both integrate well with Next.js
- Aligns with constitution's Code Quality & Standards

### Configuration
- ESLint: `@typescript-eslint/recommended`, `next/core-web-vitals`
- Prettier: Default config with trailing commas, single quotes, 2-space indentation
- Pre-commit hooks: Run ESLint and Prettier before commits (constitution requirement)

### Alternatives Considered
- **No linting/formatting**: Doesn't meet constitution requirement
- **Biome**: Newer but less mature; ESLint/Prettier are constitution-specified

## Summary

All technical decisions align with:
- Feature specification requirements
- Project constitution principles (SOLID, DRY, KISS, YAGNI)
- Technology stack (Next.js, TypeScript, Tailwind CSS, Shadcn UI)
- Testing requirements (unit tests + Playwright E2E tests)

No NEEDS CLARIFICATION items remain. All technical decisions are documented and justified.
