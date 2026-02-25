# Password Generator
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

A secure, modern password generator built with Next.js 16, featuring password, PIN, and passphrase generation with cryptographically secure random number generation and breach checking via Have I Been Pwned API.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Security](#security)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Learn More](#learn-more)
- [License](#license)

## Features

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

## Screenshots

### Desktop

| Light Mode | Dark Mode |
|------------|-----------|
| ![Desktop Light](./screenshots/desktop_light.png) | ![Desktop Dark](./screenshots/desktop_dark.png) |

### Tablet

| Light Mode | Dark Mode |
|------------|-----------|
| ![Tablet Light](./screenshots/tablet_light.png) | ![Tablet Dark](./screenshots/tablet_dark.png) |

### Mobile

| Light Mode | Dark Mode |
|------------|-----------|
| ![Mobile Light](./screenshots/mobile_light.png) | ![Mobile Dark](./screenshots/mobile_dark.png) |

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://reactjs.org/), [Tailwind CSS 4](https://tailwindcss.com/) |
| Components | [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| Security | [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) |
| Testing | [Vitest 4](https://vitest.dev/), [Playwright](https://playwright.dev/) |

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nextjs-password-generator.git
   cd nextjs-password-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Password Generation

- Default: lowercase letters (a-z)
- Toggle options: digits (0-9), symbols, uppercase (A-Z)
- Adjustable length: 8-50 characters

### PIN Generation

- Numeric-only codes
- Adjustable length: 3-12 digits

### Passphrase Generation

- Words from EFF Long Wordlist (7776 words)
- Adjustable word count: 4-10 words
- Separator options: space, hyphen, underscore, period

### Security Features

- **Strength Indicator**: Visual feedback on credential strength
- **Breach Check**: Manual check against Have I Been Pwned database

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
│   │   └── ui/                   # Shadcn UI components
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
├── lib/                          # Shared utilities (cn function)
├── tests/
│   ├── setup.ts                  # Test setup and mocks
│   ├── test-helpers.ts           # Test utilities
│   ├── unit/                     # Vitest unit tests
│   │   ├── components/           # Component tests
│   │   │   └── ui/               # UI component tests
│   │   ├── hooks/                # Hook tests
│   │   ├── lib/                  # Lib unit tests
│   │   └── api/                  # API route tests
│   └── e2e/                      # Playwright E2E tests
├── specs/                        # Feature specifications
├── screenshots/                  # Application screenshots
└── components/                   # Shared UI components (Shadcn)
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run all unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run all E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |
| `npm run test:e2e:debug` | Run E2E tests in debug mode |
| `npm run test:e2e:headed` | Run E2E tests in headed (visible browser) mode |

## Testing

This project uses a comprehensive testing strategy with both unit tests and E2E tests.

### Unit Tests (Vitest)

Unit tests are located in `tests/unit/` and cover:
- **Components**: UI component rendering and interactions
- **Hooks**: Custom React hook logic
- **Lib**: Utility functions (crypto, strength calculation, breach check)
- **API**: API route handlers

```bash
npm test                      # Run all unit tests
npm run test:watch            # Run tests in watch mode
npm run test:ui               # Run tests with Vitest UI
npm run test:coverage         # Run tests with coverage report

# Run a specific test file
npx vitest run tests/unit/hooks/use-password-generator.test.ts

# Run tests matching a pattern
npx vitest run -t "initializes and generates"
```

### E2E Tests (Playwright)

E2E tests are located in `tests/e2e/` and cover:
- Password, PIN, and passphrase generation flows
- UI interactions and accessibility
- Cross-browser compatibility

```bash
npm run test:e2e              # Run all E2E tests
npm run test:e2e:ui           # Run E2E tests with Playwright UI
npm run test:e2e:debug        # Run E2E tests in debug mode
npm run test:e2e:headed       # Run E2E tests in headed (visible browser) mode

# Run a specific test file
npx playwright test tests/e2e/password-generation.spec.ts

# Run a specific test by title
npx playwright test -g "should generate password on page load"
```

## Security

### Cryptographically Secure Generation

All passwords, PINs, and passphrases are generated using the Web Crypto API (`crypto.getRandomValues`), ensuring cryptographically secure random number generation that cannot be predicted or reproduced. This is significantly more secure than `Math.random()` which is not suitable for security-sensitive applications.

### Breach Checking

The breach check feature uses the [Have I Been Pwned API](https://haveibeenpwned.com/API/v3) to check if a credential has appeared in known data breaches. The API uses **k-anonymity**, meaning only the first 5 characters of the SHA-1 hash are sent to the server - your actual password never leaves your device.

### Security Best Practices

- **Use long passwords**: Aim for at least 16 characters for important accounts
- **Include all character types**: Mix lowercase, uppercase, digits, and symbols
- **Never reuse passwords**: Each account should have a unique password
- **Use a password manager**: Store generated passwords securely
- **Enable 2FA**: Two-factor authentication adds an extra layer of security
- **Check for breaches**: Regularly verify your passwords haven't been compromised

### Privacy

- No generated passwords are stored on any server
- All generation happens client-side in your browser
- Theme preference is stored locally in localStorage
- Credential history is stored locally and limited to the last 10 items

## Environment Variables

This project does not require any environment variables for local development or production use. The breach check feature communicates directly with the Have I Been Pwned API from the client side.