# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (strict mode) with Next.js (App Router)
**Primary Dependencies**: Next.js, React, Tailwind CSS, Shadcn UI (Radix UI)
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]
**Testing**: Jest/Vitest for unit tests, Playwright for E2E tests
**Target Platform**: Web (browser) - can be deployed to Vercel or any Node.js hosting
**Project Type**: web (Next.js App Router structure)
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Per the project constitution, the following gates MUST be satisfied:

- [ ] **SOLID Compliance**: Design demonstrates adherence to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion principles
- [ ] **DRY Verification**: No code duplication identified; reusable components, utilities, and functions are properly extracted
- [ ] **KISS Validation**: Solution is as simple as possible; no over-engineering or unnecessary complexity
- [ ] **YAGNI Compliance**: Only features currently needed are implemented; no speculative functionality
- [ ] **TypeScript Strict Mode**: All type errors resolved; explicit type annotations used for functions, components, and state
- [ ] **Testing Strategy**: Unit tests and E2E tests (Playwright) planned for all features
- [ ] **Code Quality**: ESLint and Prettier configured; pre-commit hooks established
- [ ] **UI Standards**: Shadcn UI components used where applicable; Tailwind CSS for styling
- [ ] **Font Usage**: Space Mono font configured via next/font for appropriate elements

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application - Next.js App Router (DEFAULT for this project)
app/
├── components/          # Reusable UI components (Shadcn UI components go here)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── [feature]/          # Feature-specific pages and components
    ├── page.tsx
    └── components/

tests/
├── unit/               # Unit tests for utilities, hooks, business logic
├── e2e/                # Playwright E2E tests for user flows
└── __mocks__/          # Mock data and fixtures

# [REMOVE IF UNUSED] Option 3: Web application - Next.js Pages Router (legacy)
pages/
├── api/
├── _app.tsx
└── index.tsx

# [REMOVE IF UNUSED] Option 4: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
