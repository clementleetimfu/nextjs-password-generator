# Password Generator
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

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
  - Toast notifications for user actions
  - One-click copy to clipboard

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
| Testing | [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |

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
│   ├── components/               # React components
│   │   ├── password-generator/   # Domain components
│   │   └── ui/                   # Shadcn UI components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions
│   ├── types/                    # TypeScript definitions
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Shared UI components
├── lib/                          # Shared utilities
├── tests/
│   ├── unit/                     # Vitest unit tests
│   └── e2e/                      # Playwright E2E tests
└── screenshots/                  # Application screenshots
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Testing

### Unit Tests (Vitest)

```bash
npm test                      # Run all unit tests
npm run test:watch            # Run tests in watch mode
npm run test:ui               # Run tests with UI
npm run test:coverage         # Run tests with coverage report
```

### E2E Tests (Playwright)

```bash
npm run test:e2e              # Run all E2E tests
npm run test:e2e:ui           # Run E2E tests with UI
npm run test:e2e:debug        # Run E2E tests in debug mode
npm run test:e2e:headed       # Run E2E tests in headed mode
```

## Security

### Cryptographically Secure Generation

All passwords, PINs, and passphrases are generated using the Web Crypto API (`crypto.getRandomValues`), ensuring cryptographically secure random number generation that cannot be predicted or reproduced.

### Breach Checking

The breach check feature uses the [Have I Been Pwned API](https://haveibeenpwned.com/API/v3) to check if a credential has appeared in known data breaches. The API uses k-anonymity, meaning only the first 5 characters of the SHA-1 hash are sent to the server - your actual password never leaves your device.

## License

This project is licensed under the MIT License
