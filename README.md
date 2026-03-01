# Password Generator
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-View-10b981)](https://nextjs-password-generator-clement.vercel.app/)

A secure, modern password generator built with Next.js 16, featuring password, PIN, and passphrase generation with cryptographically secure random number generation and breach checking via Have I Been Pwned API.

## Table of Contents

- [Demo & Screenshots](#demo--screenshots)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Security Implementation](#security-implementation)
- [Testing](#testing)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [License](#license)

## Demo & Screenshots
**Live Demo:** [Website](https://nextjs-password-generator-clement.vercel.app/)

**Video Demo**

https://github.com/user-attachments/assets/a65e6ba8-7700-4e33-b66f-6a55145bf327

### Screenshots

#### Desktop

| Light Mode | Dark Mode |
|------------|-----------|
| ![Desktop Light](./screenshots/desktop_light.png) | ![Desktop Dark](./screenshots/desktop_dark.png) |

#### Tablet

| Light Mode | Dark Mode |
|------------|-----------|
| ![Tablet Light](./screenshots/tablet_light.png) | ![Tablet Dark](./screenshots/tablet_dark.png) |

#### Mobile

| Light Mode | Dark Mode |
|------------|-----------|
| ![Mobile Light](./screenshots/mobile_light.png) | ![Mobile Dark](./screenshots/mobile_dark.png) |

## Key Features

- **Multiple Credential Types**
  - Password: 8-50 characters with customizable character sets
  - PIN: 3-12 digit numeric codes
  - Passphrase: 4-10 words from EFF Long Wordlist (7776 words)
- **Security Features**
  - Cryptographically secure random generation using Web Crypto API
  - Strength indicator for all credential types
  - Breach check integration with Have I Been Pwned API
- **User Experience**
  - Light/dark mode toggle with persisted preference
  - Responsive design (desktop, tablet, mobile)
  - Toast notifications centered at top for better visibility
  - One-click copy to clipboard
  - Credential history with slider navigation (last 10 generated)
  - Consistent muted background theme across all components

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16.1.6](https://nextjs.org/) (App Router) |
| UI | [React 19.2.3](https://reactjs.org/), [Tailwind CSS 4.2.1](https://tailwindcss.com/) |
| Components | [Radix UI primitives](https://www.radix-ui.com/) styled with Tailwind CSS (@radix-ui/react-slider, @radix-ui/react-slot, @radix-ui/react-switch, @radix-ui/react-tabs) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| Utilities | [clsx 2.1.1](https://github.com/lukeed/clsx), [tailwind-merge 3.5.0](https://github.com/dcastilho/tailwind-merge), [class-variance-authority 0.7.1](https://cva.style/) |
| Notifications | [sonner 2.0.7](https://sonner.emilkowal.ski/) |
| Security | [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) |
| Testing | [Vitest 4.0.18](https://vitest.dev/), [Playwright 1.58.2](https://playwright.dev/), [@testing-library/react 16.3.2](https://testing-library.com/react), [@testing-library/jest-dom 6.9.1](https://testing-library.com/jest-dom) |
## Security Implementation

### Cryptographically Secure Generation

All passwords, PINs, and passphrases are generated using the Web Crypto API (`crypto.getRandomValues`), ensuring cryptographically secure random number generation that cannot be predicted or reproduced. This is significantly more secure than `Math.random()` which is not suitable for security-sensitive applications.

### Breach Checking

The breach check feature uses the [Have I Been Pwned API](https://haveibeenpwned.com/API/v3) to check if a credential has appeared in known data breaches. The API uses **k-anonymity**, meaning only the first 5 characters of the SHA-1 hash are sent to the server - your actual password never leaves your device.

### Privacy

- No generated passwords are stored on any server
- All generation happens client-side in your browser
- Theme preference is stored locally in localStorage
- Credential history is stored locally and limited to the last 10 items

## Testing

This project uses a comprehensive testing strategy with both unit tests and E2E tests, leveraging Vitest for unit testing and Playwright for end-to-end testing.

### Unit Tests (Vitest)

Unit tests are located in `tests/unit/` and cover:
- **Components**: UI component rendering and interactions (tests/unit/components/)
  - UI components: button, slider, switch, tabs, sonner, icons (Radix UI primitives styled with Tailwind CSS)
  - Domain components: password-controls, pin-controls, passphrase-controls, password-display, password-history, history-slider, theme-toggle, page
- **Hooks**: Custom React hook logic (tests/unit/hooks/)
  - use-password-generator, use-pin-generator, use-passphrase-generator, use-credential-history, use-breach-check, use-breach-check-handler, use-theme, use-desktop
- **Lib**: Utility functions and API clients
  - crypto.ts (secure random generation), strength.ts (strength calculation), breach-check.ts (Have I Been Pwned API client), theme.ts, eff-wordlist.ts
- **API**: API route handlers (tests/unit/api/)
  - breach-check API route
- **Integration Tests**: Security tests, performance tests, and simple unit tests

```bash
pnpm test                      # Run all unit tests
pnpm test:watch                # Run tests in watch mode
pnpm test:ui                   # Run tests with Vitest UI
pnpm test:coverage             # Run tests with coverage report

# Run a specific test file
pnpm exec vitest run tests/unit/hooks/use-password-generator.test.ts

# Run tests matching a pattern
pnpm exec vitest run -t "initializes and generates"
```

### E2E Tests (Playwright)

E2E tests are located in `tests/e2e/` and cover:
- password-generation.spec.ts - Password generation flow, strength indicator, breach check, copy to clipboard
- pin-generation.spec.ts - PIN generation flow, length adjustment, strength indicator
- passphrase-generation.spec.ts - Passphrase generation flow, word count adjustment, separator selection
- tab-switching.spec.ts - Tab navigation between Password, PIN, and Passphrase
- history.spec.ts - Credential history, restore from history, clear history
- theme.spec.ts - Theme toggle, light/dark mode persistence

```bash
pnpm test:e2e                  # Run all E2E tests
pnpm test:e2e:ui               # Run E2E tests with Playwright UI
pnpm test:e2e:debug            # Run E2E tests in debug mode
pnpm test:e2e:headed           # Run E2E tests in headed (visible browser) mode

# Run a specific test file
pnpm exec playwright test tests/e2e/password-generation.spec.ts

# Run a specific test by title
pnpm exec playwright test -g "should generate password on page load"
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/nextjs-password-generator.git
cd nextjs-password-generator

# Install dependencies
pnpm install

# Run development server
pnpm dev
# Open http://localhost:3000

# Build for production
pnpm build

# Start production server
pnpm start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (localhost:3000) |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run all unit tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:ui` | Run tests with Vitest UI |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm test:e2e` | Run all E2E tests |
| `pnpm test:e2e:ui` | Run E2E tests with Playwright UI |
| `pnpm test:e2e:debug` | Run E2E tests in debug mode |
| `pnpm test:e2e:headed` | Run E2E tests in headed (visible browser) mode |

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── breach-check/         # Breach check API endpoint
│   ├── components/               # React components
│   │   ├── password-generator/   # Domain components
│   │   │   ├── password-display.tsx
│   │   │   ├── password-controls.tsx
│   │   │   ├── pin-controls.tsx
│   │   │   ├── passphrase-controls.tsx
│   │   │   ├── password-history.tsx
│   │   │   ├── history-slider.tsx
│   │   │   └── theme-toggle.tsx
│   │   └── ui/                   # UI components (button, slider, switch, tabs, sonner, icons - Radix UI primitives styled with Tailwind CSS)
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-password-generator.ts
│   │   ├── use-pin-generator.ts
│   │   ├── use-passphrase-generator.ts
│   │   ├── use-credential-history.ts
│   │   ├── use-breach-check.ts
│   │   ├── use-breach-check-handler.ts
│   │   ├── use-theme.ts
│   │   └── use-desktop.ts
│   ├── lib/                      # Utility functions and core logic
│   │   ├── crypto.ts             # Secure random generation
│   │   ├── strength.ts           # Strength calculation
│   │   ├── breach-check.ts       # Have I Been Pwned API client
│   │   ├── theme.ts              # Theme utilities
│   │   ├── eff-wordlist.ts       # EFF wordlist loader
│   │   └── eff-wordlist-content.ts
│   ├── types/                    # TypeScript definitions
│   ├── constants.ts              # App constants (history storage)
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── lib/                          # Shared utilities (cn function - clsx + tailwind-merge)
├── tests/
│   ├── setup.ts                  # Test setup and mocks
│   ├── test-helpers.ts           # Test utilities
│   ├── unit/                     # Vitest unit tests
│   │   ├── components/           # Component tests (UI components and domain components)
│   │   ├── hooks/                # Hook tests
│   │   ├── lib/                  # Lib unit tests (crypto, strength, breach-check, theme, eff-wordlist)
│   │   ├── api/                  # API route tests
│   │   ├── crypto.test.ts        # Secure generation tests
│   │   ├── strength.test.ts      # Strength calculation tests
│   │   ├── security.test.ts      # Security-focused tests
│   │   ├── performance.test.ts   # Performance tests
│   │   └── simple.test.ts        # Simple unit tests
│   └── e2e/                      # Playwright E2E tests (password-generation, pin-generation, passphrase-generation, tab-switching, history, theme)
├── specs/                        # Feature specifications
└── screenshots/                  # Application screenshots
```

## License

MIT License - see [LICENSE](LICENSE) for details.
