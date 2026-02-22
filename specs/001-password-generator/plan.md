# Implementation Plan: Password Generator Web Application

**Branch**: `001-password-generator` | **Date**: 2026-02-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-password-generator/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a secure password generator web application with three generation modes (password, PIN, passphrase) using Next.js App Router, TypeScript strict mode, Tailwind CSS, and Shadcn UI components. The application will feature cryptographically secure random generation, strength indicators, breach checking via Have I Been Pwned API, theme persistence, and responsive design for desktop/tablet/mobile. All features will have comprehensive unit and E2E tests using Playwright.

## Technical Context

**Language/Version**: TypeScript (strict mode) with Next.js (App Router, latest stable version)
**Primary Dependencies**: Next.js, React, Tailwind CSS, Shadcn UI (Radix UI primitives), crypto-js or Web Crypto API for secure random generation
**Storage**: Browser localStorage for theme persistence; EFF Long Wordlist (7776 words) bundled with application
**Testing**: Jest/Vitest for unit tests, Playwright for E2E tests
**Target Platform**: Web (browser) - can be deployed to Vercel or any Node.js hosting
**Project Type**: web (Next.js App Router structure)
**Performance Goals**: Password/PIN/passphrase generation under 100ms; Theme toggle under 100ms; Breach check under 3 seconds; Page load under 2 seconds
**Constraints**: Single-page application; No server-side state; All generation happens client-side; Have I Been Pwned API rate limits (1500 requests/day)
**Scale/Scope**: Single-page application with 3 generation modes; Supports desktop (>1024px), tablet (768-1024px), mobile (<768px); No user accounts or authentication required

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Per the project constitution, the following gates MUST be satisfied:

- [x] **SOLID Compliance**: Design demonstrates adherence to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles
- [x] **DRY Verification**: No code duplication identified; reusable components, utilities, and functions are properly extracted
- [x] **KISS Validation**: Solution is as simple as possible; no over-engineering or unnecessary complexity
- [x] **YAGNI Compliance**: Only features currently needed are implemented; no speculative functionality
- [x] **TypeScript Strict Mode**: All type errors resolved; explicit type annotations used for functions, components, and state
- [x] **Testing Strategy**: Unit tests and E2E tests (Playwright) planned for all features
- [x] **Code Quality**: ESLint and Prettier configured; pre-commit hooks established
- [x] **UI Standards**: Shadcn UI components used where applicable; Tailwind CSS for styling
- [x] **Font Usage**: Space Mono font configured via next/font for appropriate elements

## Project Structure

### Documentation (this feature)

```text
specs/001-password-generator/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── components/          # Reusable UI components (Shadcn UI components go here)
│   ├── ui/             # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── switch.tsx
│   ├── password-generator/  # Feature-specific components
│   │   ├── password-display.tsx
│   │   ├── password-controls.tsx
│   │   ├── pin-controls.tsx
│   │   ├── passphrase-controls.tsx
│   │   ├── strength-indicator.tsx
│   │   └── theme-toggle.tsx
│   └── layout.tsx
├── hooks/              # Custom React hooks
│   ├── use-password-generator.ts
│   ├── use-pin-generator.ts
│   ├── use-passphrase-generator.ts
│   ├── use-strength-check.ts
│   ├── use-breach-check.ts
│   └── use-theme.ts
├── lib/                # Utility functions and configurations
│   ├── crypto.ts        # Cryptographically secure random generation
│   ├── eff-wordlist.ts  # EFF Long Wordlist
│   ├── strength.ts      # Password strength calculation
│   └── breach-check.ts  # Have I Been Pwned API integration
├── types/              # TypeScript type definitions
│   └── generator.ts
└── page.tsx            # Main password generator page

tests/
├── unit/               # Unit tests for utilities, hooks, business logic
│   ├── crypto.test.ts
│   ├── strength.test.ts
│   └── breach-check.test.ts
├── e2e/                # Playwright E2E tests for user flows
│   ├── password-generation.spec.ts
│   ├── pin-generation.spec.ts
│   ├── passphrase-generation.spec.ts
│   ├── security-features.spec.ts
│   └── ui-ux.spec.ts
└── __mocks__/          # Mock data and fixtures
    └── eff-wordlist-mock.ts
```

**Structure Decision**: Using Next.js App Router structure (Option 2) with feature-based component organization. This aligns with the constitution's requirement for Next.js App Router conventions and provides clear separation of concerns between components, hooks, utilities, and types. The structure supports the SOLID principles by keeping components focused and reusable.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations identified. All gates pass without requiring justification.
