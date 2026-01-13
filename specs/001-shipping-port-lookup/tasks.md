# Tasks: 001-shipping-port-lookup

**Input**: Design documents from `/specs/001-shipping-port-lookup/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base structure

- [X] T001 Create project structure per implementation plan (src/components, src/composables, src/assets, src/models, tests)
- [X] T002 Initialize Vue 3 project with Vite, TypeScript, and Tailwind CSS dependencies
- [X] T003 [P] Configure Vitest and Vue Test Utils in vite.config.ts and vitest.config.ts
- [X] T004 [P] Update `.specify/memory/glossary.md` with "UN/LOCODE", "模糊查询", "IANA Timezone"

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and data types

- [X] T005 [P] Define `Port` interface in `src/models/port.ts` based on data-model.md
- [X] T006 Initialize sample port data (Shanghai, Singapore, Rotterdam) in `src/assets/ports.json`
- [X] T007 [P] Configure Tailwind CSS base styles and themes in `tailwind.config.js` and `src/style.css`

## Phase 3: User Story 2 - 初始数据加载与健壮性 (Priority: P2)

**Goal**: Load data from JSON and handle potential load errors.

**Independent Test**: Verify that ports data is loaded into memory on app startup or error message is shown if JSON is missing.

### Implementation for User Story 2

- [X] T008 [P] [US2] Create Vitest unit test for data loading in `tests/unit/usePorts.test.ts`
- [X] T009 [US2] Implement `usePorts` composable in `src/composables/usePorts.ts` with data fetching from `src/assets/ports.json`
- [X] T010 [US2] Implement error handling in `usePorts.ts` for fetch failures (as per FR-005)
- [X] T011 [US2] Create basic error UI component or state in `src/App.vue` to show loading status and errors

**Checkpoint**: App can successfully load data or show an error.

## Phase 4: User Story 1 - 港口搜索与展示 (Priority: P1) 🎯 MVP

**Goal**: Implement the core search functionality with auto-detection, and display results with pagination.

**Independent Test**: Search for "CNSHA" should return Shanghai; searching for "Shang" should return list of ports with pagination.

### Implementation for User Story 1

- [X] T012 [P] [US1] Create Vitest unit tests for search logic in `tests/unit/usePorts.test.ts` (Exact vs Fuzzy)
- [X] T013 [US1] Implement search and filtering logic in `src/composables/usePorts.ts` (FR-001, FR-002, FR-004)
- [X] T014 [P] [US1] Create `SearchBar.vue` component in `src/components/SearchBar.vue` (Single input, Enter/Button trigger)
- [X] T015 [P] [US1] Create `PortList.vue` component in `src/components/PortList.vue` to display port details (FR-003)
- [X] T016 [P] [US1] Create `Pagination.vue` component in `src/components/Pagination.vue` (FR-004)
- [X] T017 [US1] Integrate components in `src/App.vue` and link to `usePorts.ts`
- [X] T018 [P] [US1] Add Tailwind CSS styling to match "modern and clean" UI requirements
- [X] T019 [US1] Implement sorting logic (Code A-Z) in `usePorts.ts`

**Checkpoint**: Core search and display functionality is complete and testable.

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T020 [P] Ensure all text labels and messages are in Chinese (as per Constitution)
- [X] T021 Final manual verification against Success Criteria (SC-001, SC-002, SC-003)
- [X] T022 Optimize Tailwind build for production

## Dependency Graph

- US1 Implementation (Phase 4) depends on Foundational (Phase 2) and US2 (Phase 3).
- US2 (Data Loading) depends on Phase 2 (Data Model & JSON).

## Parallel Execution

- T003, T004 can run in parallel with project setup.
- T014, T015, T016 (UI Components) can be developed in parallel while search logic in T013 is being refined.
