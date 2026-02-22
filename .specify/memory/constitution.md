<!--
SYNC IMPACT REPORT
==================
Version Change: N/A → 1.0.0 (initial constitution)
Modified Principles: N/A (initial creation)
Added Sections:
  - Core Principles (SOLID, DRY, KISS, YAGNI)
  - Technology Stack
  - Code Quality & Standards
  - Testing Requirements
Removed Sections: N/A
Templates Requiring Updates:
  - ✅ .specify/templates/plan-template.md (Constitution Check section aligned)
  - ✅ .specify/templates/spec-template.md (requirements section aligned)
  - ✅ .specify/templates/tasks-template.md (testing discipline aligned)
Follow-up TODOs: None
-->

# Next.js Password Generator Constitution

## Core Principles

### I. SOLID Principles
All code MUST adhere to the five SOLID principles:
- **Single Responsibility Principle**: Each class, function, or component MUST have one reason to change
- **Open/Closed Principle**: Software entities MUST be open for extension but closed for modification
- **Liskov Substitution Principle**: Derived classes MUST be substitutable for their base classes
- **Interface Segregation Principle**: Clients MUST not be forced to depend on interfaces they don't use
- **Dependency Inversion Principle**: High-level modules MUST not depend on low-level modules; both MUST depend on abstractions

**Rationale**: SOLID principles ensure maintainable, testable, and scalable code that can evolve without breaking existing functionality.

### II. DRY (Don't Repeat Yourself)
Code duplication MUST be eliminated. Any logic, configuration, or data structure appearing more than once MUST be extracted into reusable functions, components, constants, or modules.

**Rationale**: DRY reduces maintenance burden, minimizes bugs from inconsistent updates, and improves code readability.

### III. KISS (Keep It Simple, Stupid)
Solutions MUST be as simple as possible. Avoid over-engineering, unnecessary abstractions, and complex patterns when straightforward approaches suffice. Code MUST be readable and understandable by any developer on the team.

**Rationale**: Simplicity reduces cognitive load, accelerates onboarding, and decreases the likelihood of bugs.

### IV. YAGNI (You Aren't Gonna Need It)
Implement ONLY features and functionality that are currently needed. Do NOT build for hypothetical future requirements. Avoid speculative generality and premature optimization.

**Rationale**: YAGNI prevents wasted effort, reduces code complexity, and keeps the codebase focused on actual user needs.

## Technology Stack

### Framework & Language
- **Framework**: Next.js (latest stable version with App Router)
- **Language**: TypeScript in strict mode (strict: true in tsconfig.json)
- **Runtime**: Node.js (LTS version)

### Styling & UI
- **CSS Framework**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI primitives + Tailwind styling)
- **Styling Approach**: Utility-first CSS with Tailwind, component composition with Shadcn

### Code Quality Tools
- **Linting**: ESLint with TypeScript and Next.js configurations
- **Formatting**: Prettier with consistent configuration across the project
- **Pre-commit Hooks**: ESLint and Prettier MUST run before commits

### Typography
- **Primary Font**: Space Mono (monospace font for code, technical content, and UI elements requiring character alignment)
- **Font Loading**: Use next/font for optimized font loading

## Code Quality & Standards

### TypeScript Strict Mode
TypeScript MUST be configured with strict mode enabled. All type errors MUST be resolved before code is considered complete. Explicit type annotations are REQUIRED for:
- Function parameters and return types
- Component props
- State variables
- API responses

### Code Style
- Use ESLint for code quality and consistency
- Use Prettier for automatic formatting
- Configure both tools with project-specific rules
- All code MUST pass linting before merging

### Component Architecture
- Components MUST be small, focused, and reusable
- Use composition over inheritance
- Separate concerns: presentation logic, business logic, and data fetching
- Components MUST be tested independently

### File Organization
- Follow Next.js App Router conventions
- Group related files in feature-based directories
- Use barrel exports (index.ts) for cleaner imports
- Maintain clear separation between components, hooks, utilities, and types

## Testing Requirements

### Unit Testing
- ALL features MUST have corresponding unit tests
- Test coverage MUST target critical business logic and utility functions
- Tests MUST be written following AAA pattern (Arrange, Act, Assert)
- Mock external dependencies (APIs, databases, etc.)

### End-to-End Testing
- ALL features MUST have page-level E2E tests using Playwright
- E2E tests MUST cover critical user journeys
- Tests MUST be deterministic and idempotent
- Use Playwright's built-in selectors and best practices

### Testing Discipline
- Tests MUST be written BEFORE implementation (Test-Driven Development approach preferred)
- All tests MUST pass before code is merged
- Flaky tests MUST be fixed or removed immediately
- Test execution time MUST be kept reasonable (< 5 minutes for full suite)

### Test Organization
```
tests/
├── unit/           # Unit tests for utilities, hooks, business logic
├── e2e/            # Playwright E2E tests for user flows
└── __mocks__/      # Mock data and fixtures
```

## Governance

### Amendment Procedure
1. Any proposed amendment MUST be documented with rationale
2. Amendments MUST be reviewed and approved by the project team
3. Amendments MUST include version bump following semantic versioning
4. Changes MUST be propagated across all dependent templates and documentation
5. Historical versions MUST be preserved for reference

### Versioning Policy
Constitution follows semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Backward-incompatible changes, principle removals, or fundamental governance changes
- **MINOR**: New principles or sections added, material guidance expansion
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic refinements

### Compliance Review
- All pull requests MUST verify compliance with current constitution
- Code reviews MUST check adherence to SOLID, DRY, KISS, and YAGNI principles
- TypeScript strict mode violations MUST be addressed before merging
- Missing tests (unit or E2E) MUST block feature completion
- Complexity MUST be justified and documented in implementation plans

### Quality Gates
- ESLint MUST pass with zero errors
- Prettier formatting MUST be applied
- TypeScript MUST compile with no errors
- Unit tests MUST pass
- E2E tests MUST pass for affected features

**Version**: 1.0.0 | **Ratified**: 2026-02-22 | **Last Amended**: 2026-02-22
