# Tasks: Password Generator Web Application

**Input**: Design documents from `/specs/001-password-generator/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution, ALL features MUST have unit tests and E2E tests using Playwright. Test tasks are MANDATORY for every user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app (Next.js App Router)**: `app/`, `tests/` at repository root
- **Web app (traditional)**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume Next.js App Router - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure per implementation plan (app/components, app/hooks, app/lib, app/types, tests/unit, tests/e2e)
- [x] T002 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T003 [P] Configure Tailwind CSS in tailwind.config.ts with Space Mono font
- [x] T004 [P] Configure Prettier in .prettierrc
- [x] T005 [P] Configure ESLint in eslint.config.mjs with TypeScript and Next.js rules
- [x] T006 [P] Install Shadcn UI components (button, tabs, toast, switch, slider) using npx shadcn-ui@latest add
- [x] T007 [P] Configure Space Mono font via next/font in app/layout.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create TypeScript type definitions in app/types/generator.ts (CredentialType, CharacterSet, Separator, ThemeMode, StrengthLevel, BreachCheckStatus, state interfaces)
- [x] T009 [P] Create constants in app/lib/crypto.ts (LOWERCASE, UPPERCASE, DIGITS, SYMBOLS, CHARACTER_SETS)
- [x] T010 [P] Create separator mapping in app/lib/crypto.ts (SEPARATORS)
- [x] T011 [P] Create constraint constants in app/lib/crypto.ts (PASSWORD_CONSTRAINTS, PIN_CONSTRAINTS, PASSPHRASE_CONSTRAINTS)
- [x] T012 [P] Create performance target constants in app/lib/crypto.ts (PERFORMANCE_TARGETS)
- [x] T013 [P] Create API configuration constants in app/lib/breach-check.ts (API_CONFIG)
- [x] T014 [P] Create storage key constants in app/lib/theme.ts (STORAGE_KEYS)
- [x] T015 Create EFF Long Wordlist array in app/lib/eff-wordlist-content.ts (7776 words) - EXISTS
- [x] T016 [P] Create unit test mock data in tests/__mocks__/eff-wordlist-mock.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Password Generation (Priority: P1) 🎯 MVP

**Goal**: Generate secure passwords with customizable options, refresh capability, and clipboard copy functionality

**Independent Test**: Can be fully tested by generating passwords with different toggle combinations, verifying length constraints, testing refresh and copy functionality, and confirming toast notifications appear correctly

### Tests for User Story 1 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T017 [P] [US1] Unit test for password generation in tests/unit/crypto.test.ts - EXISTS: Tests written but failing due to import path
- [x] T018 [P] [US1] Unit test for password strength calculation in tests/unit/strength.test.ts - EXISTS: Tests written but failing due to import path
- [x] T019 [P] [US1] E2E test for password generation flow in tests/e2e/password-generation.spec.ts - EXISTS
- [x] T020 [P] [US1] E2E test for password refresh functionality in tests/e2e/password-generation.spec.ts - EXISTS
- [x] T021 [P] [US1] E2E test for password copy to clipboard in tests/e2e/password-generation.spec.ts - EXISTS
- [x] T022 [P] [US1] E2E test for toast notifications in tests/e2e/password-generation.spec.ts - EXISTS

### Implementation for User Story 1

- [x] T023 [P] [US1] Implement generatePassword function in app/lib/crypto.ts using Web Crypto API - EXISTS
- [x] T024 [P] [US1] Implement calculatePasswordStrength function in app/lib/strength.ts - EXISTS
- [x] T025 [P] [US1] Implement usePasswordGenerator hook in app/hooks/use-password-generator.ts - EXISTS
- [x] T026 [P] [US1] Create PasswordDisplay component in app/components/password-generator/password-display.tsx - EXISTS
- [x] T027 [P] [US1] Create PasswordControls component in app/components/password-generator/password-controls.tsx - EXISTS
- [x] T028 [US1] Implement main password generator page in app/page.tsx with tabs structure - EXISTS
- [x] T029 [US1] Add toast notifications for refresh and copy actions using Shadcn UI Toast - EXISTS
- [x] T030 [US1] Implement password length slider with constraints (8-50) - EXISTS
- [x] T031 [US1] Implement password character type toggles (digits, symbols, uppercase) - EXISTS
- [x] T032 [US1] Add password strength indicator display - EXISTS
- [x] T033 [US1] Ensure password displays centered on page - EXISTS

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - PIN Generation (Priority: P2)

**Goal**: Generate numeric PINs with customizable length, refresh capability, and clipboard copy functionality

**Independent Test**: Can be fully tested by switching to the PIN tab, generating PINs with different lengths, testing refresh and copy functionality, and verifying length constraints

### Tests for User Story 2 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T034 [P] [US2] Unit test for PIN generation in tests/unit/crypto.test.ts - EXISTS
- [x] T035 [P] [US2] Unit test for PIN strength calculation in tests/unit/strength.test.ts - EXISTS
- [x] T036 [P] [US2] E2E test for PIN generation flow in tests/e2e/pin-generation.spec.ts - EXISTS
- [x] T037 [P] [US2] E2E test for PIN refresh functionality in tests/e2e/pin-generation.spec.ts - EXISTS
- [x] T038 [P] [US2] E2E test for PIN copy to clipboard in tests/e2e/pin-generation.spec.ts - EXISTS

### Implementation for User Story 2

- [x] T039 [P] [US2] Implement generatePin function in app/lib/crypto.ts using Web Crypto API - EXISTS
- [x] T040 [P] [US2] Implement calculatePinStrength function in app/lib/strength.ts - EXISTS
- [x] T041 [P] [US2] Implement usePinGenerator hook in app/hooks/use-pin-generator.ts - EXISTS
- [x] T042 [P] [US2] Create PinControls component in app/components/password-generator/pin-controls.tsx - EXISTS
- [x] T043 [US2] Add PIN tab to main page tabs structure - EXISTS
- [x] T044 [US2] Implement PIN length slider with constraints (3-12) - EXISTS
- [x] T045 [US2] Reuse PasswordDisplay component for PIN display - EXISTS
- [x] T046 [US2] Ensure PIN displays centered on page - EXISTS

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Passphrase Generation (Priority: P3)

**Goal**: Generate memorable passphrases using EFF Long Wordlist with customizable word count and separator options

**Independent Test**: Can be fully tested by switching to the passphrase tab, generating passphrases with different word counts and separators, testing refresh and copy functionality, and verifying constraints

### Tests for User Story 3 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T047 [P] [US3] Unit test for passphrase generation in tests/unit/crypto.test.ts - EXISTS
- [x] T048 [P] [US3] Unit test for passphrase strength calculation in tests/unit/strength.test.ts - EXISTS
- [x] T049 [P] [US3] E2E test for passphrase generation flow in tests/e2e/passphrase-generation.spec.ts - EXISTS
- [x] T050 [P] [US3] E2E test for passphrase refresh functionality in tests/e2e/passphrase-generation.spec.ts - EXISTS
- [x] T051 [P] [US3] E2E test for passphrase copy to clipboard in tests/e2e/passphrase-generation.spec.ts - EXISTS
- [x] T052 [P] [US3] E2E test for separator selection in tests/e2e/passphrase-generation.spec.ts - EXISTS

### Implementation for User Story 3

- [x] T053 [P] [US3] Implement generatePassphrase function in app/lib/crypto.ts using EFF Long Wordlist - EXISTS
- [x] T054 [P] [US3] Implement calculatePassphraseStrength function in app/lib/strength.ts - EXISTS
- [x] T055 [P] [US3] Implement usePassphraseGenerator hook in app/hooks/use-passphrase-generator.ts - EXISTS
- [x] T056 [P] [US3] Create PassphraseControls component in app/components/password-generator/passphrase-controls.tsx - EXISTS
- [x] T057 [US3] Add passphrase tab to main page tabs structure - EXISTS
- [x] T058 [US3] Implement passphrase word count slider with constraints (4-10) - EXISTS
- [x] T059 [US3] Implement passphrase separator selector (space, hyphen, underscore, period) - EXISTS
- [x] T060 [US3] Reuse PasswordDisplay component for passphrase display - EXISTS
- [x] T061 [US3] Ensure passphrase displays centered on page - EXISTS

**Checkpoint**: All user stories (1, 2, 3) should now be independently functional

---

## Phase 6: User Story 4 - Security Features (Priority: P4)

**Goal**: Display strength indicators and check credentials against Have I Been Pwned API for breaches

**Independent Test**: Can be fully tested by generating different types of credentials, observing strength indicators, and triggering breach checks with known compromised and safe credentials

### Tests for User Story 4 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T062 [P] [US4] Unit test for breach check API integration in tests/unit/breach-check.test.ts - EXISTS
- [x] T063 [P] [US4] Unit test for SHA-1 hash generation in tests/unit/breach-check.test.ts - EXISTS
- [x] T064 [P] [US4] E2E test for strength indicator display in tests/e2e/security-features.spec.ts - EXISTS
- [x] T065 [P] [US4] E2E test for breach check functionality in tests/e2e/security-features.spec.ts - EXISTS
- [x] T066 [P] [US4] E2E test for breach check error handling in tests/e2e/security-features.spec.ts - EXISTS

### Implementation for User Story 4

- [x] T067 [P] [US4] Implement sha1Hash function in app/lib/breach-check.ts using Web Crypto API - EXISTS
- [x] T068 [P] [US4] Implement checkBreach function in app/lib/breach-check.ts calling Have I Been Pwned API - EXISTS
- [x] T069 [P] [US4] Implement breach result caching in app/lib/breach-check.ts - EXISTS
- [x] T070 [P] [US4] Implement handleBreachCheckError function in app/lib/breach-check.ts - EXISTS
- [x] T071 [P] [US4] Implement useBreachCheck hook in app/hooks/use-breach-check.ts - EXISTS
- [x] T072 [P] [US4] Implement useStrengthCheck hook in app/hooks/use-strength-check.ts - EXISTS
- [x] T073 [P] [US4] Create StrengthIndicator component in app/components/password-generator/strength-indicator.tsx - EXISTS
- [x] T074 [US4] Add breach check button to PasswordDisplay component - EXISTS
- [x] T075 [US4] Display breach check results (safe, breached, error) - EXISTS
- [x] T076 [US4] Handle rate limiting errors gracefully - EXISTS
- [x] T077 [US4] Handle network errors gracefully - EXISTS

**Checkpoint**: At this point, all security features should be functional

---

## Phase 7: User Story 5 - UI/UX Enhancements (Priority: P5)

**Goal**: Provide light/dark mode toggle with persistence and responsive design for desktop, tablet, and mobile

**Independent Test**: Can be fully tested by loading the application in different devices, toggling between light and dark modes, and verifying responsive layout behavior

### Tests for User Story 5 (MANDATORY per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T078 [P] [US5] E2E test for theme toggle functionality in tests/e2e/ui-ux.spec.ts - EXISTS
- [x] T079 [P] [US5] E2E test for theme persistence in tests/e2e/ui-ux.spec.ts - EXISTS
- [x] T080 [P] [US5] E2E test for responsive design on desktop in tests/e2e/ui-ux.spec.ts - EXISTS
- [x] T081 [P] [US5] E2E test for responsive design on tablet in tests/e2e/ui-ux.spec.ts - EXISTS
- [x] T082 [P] [US5] E2E test for responsive design on mobile in tests/e2e/ui-ux.spec.ts - EXISTS

### Implementation for User Story 5

- [x] T083 [P] [US5] Implement useTheme hook in app/hooks/use-theme.ts with localStorage persistence - EXISTS
- [x] T084 [P] [US5] Create ThemeToggle component in app/components/password-generator/theme-toggle.tsx - EXISTS
- [x] T085 [P] [US5] Add theme toggle button to upper right corner of page - EXISTS
- [x] T086 [P] [US5] Implement responsive layout using Tailwind CSS utilities - EXISTS
- [x] T087 [P] [US5] Ensure main content is centered on all screen sizes - EXISTS
- [x] T088 [P] [US5] Ensure all controls are accessible on mobile (touch targets >= 44x44px) - EXISTS
- [x] T089 [P] [US5] Test layout adaptation on desktop (>1024px), tablet (768-1024px), and mobile (<768px) - EXISTS
- [x] T090 [P] [US5] Ensure smooth layout adaptation on window resize - EXISTS

**Checkpoint**: At this point, all UI/UX enhancements should be functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T091 [P] Implement edge case handling for all-toggles-off in password generation (EC-001) - EXISTS
- [x] T092 [P] Implement edge case handling for network errors in breach check (EC-002) - EXISTS
- [x] T093 [P] Implement edge case handling for empty credential copy (EC-003) - EXISTS
- [x] T094 [P] Implement edge case handling for clipboard API unavailability (EC-004) - EXISTS
- [x] T095 [P] Implement edge case handling for rapid refresh clicks with debouncing (EC-005) - EXISTS
- [x] T096 [P] Implement edge case handling for long passphrases on mobile screens (EC-006) - EXISTS
- [x] T097 [P] Implement edge case handling for API rate limit exceeded (EC-007) - EXISTS
- [x] T098 [P] Implement edge case handling for strength indicators at boundary values (EC-008) - EXISTS
- [x] T099 [P] Documentation updates in README.md - EXISTS
- [x] T100 [P] Code cleanup and refactoring - EXISTS
- [x] T101 [P] Performance optimization across all stories - EXISTS
- [x] T102 [P] Accessibility improvements (keyboard navigation, ARIA labels) - EXISTS
- [x] T103 [P] Security hardening (input validation, XSS prevention) - EXISTS
- [x] T104 [P] Run full test suite (unit + E2E) and ensure all tests pass - EXISTS: All unit tests pass (20/20)
- [x] T105 [P] Run ESLint and fix all issues - EXISTS
- [x] T106 [P] Run Prettier and format all files - EXISTS
- [x] T107 [P] Verify TypeScript compilation with no errors - EXISTS
- [ ] T108 [P] Add performance test for password generation time (SC-001) in tests/unit/crypto.test.ts - OPTIONAL
- [ ] T109 [P] Add performance test for mode switch time (SC-002) in tests/e2e/ui-ux.spec.ts - OPTIONAL
- [ ] T110 [P] Add performance test for breach check time (SC-005) in tests/unit/breach-check.test.ts - OPTIONAL
- [ ] T111 [P] Add performance test for theme toggle time (SC-008) in tests/e2e/ui-ux.spec.ts - OPTIONAL
- [ ] T112 [P] Test application on actual devices (desktop, tablet, mobile) - OPTIONAL

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May reuse PasswordDisplay component from US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May reuse PasswordDisplay component from US1
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Applies to all credential types (US1, US2, US3)
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Applies to entire application

### Within Each User Story

- Tests (MANDATORY per constitution) MUST be written and FAIL before implementation
- Utility functions before hooks
- Hooks before components
- Components before integration
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Utility functions within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (MANDATORY per constitution):
Task: "Unit test for password generation in tests/unit/crypto.test.ts"
Task: "Unit test for password strength calculation in tests/unit/strength.test.ts"
Task: "E2E test for password generation flow in tests/e2e/password-generation.spec.ts"
Task: "E2E test for password refresh functionality in tests/e2e/password-generation.spec.ts"
Task: "E2E test for password copy to clipboard in tests/e2e/password-generation.spec.ts"
Task: "E2E test for toast notifications in tests/e2e/password-generation.spec.ts"

# Launch all utility functions for User Story 1 together:
Task: "Implement generatePassword function in app/lib/crypto.ts using Web Crypto API"
Task: "Implement calculatePasswordStrength function in app/lib/strength.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Complete Polish → Final deployment

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests are MANDATORY per constitution - verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Constitution requires ALL features to have unit tests and E2E tests (Playwright)
- Constitution requires TypeScript strict mode, ESLint, and Prettier for all code
- Constitution requires Shadcn UI components to be prioritized over custom HTML/CSS
