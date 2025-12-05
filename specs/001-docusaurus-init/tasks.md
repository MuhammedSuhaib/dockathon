---

description: "Task list for Docusaurus Initialization feature implementation"
---

# Tasks: Project Initialization: Setup foundational publishing platform

**Input**: Design documents from `/specs/001-docusaurus-init/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not explicitly requested in the feature specification, so no dedicated test tasks will be generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic environment setup for Docusaurus.

- [ ] T001 Initialize Docusaurus project with TypeScript in the current directory (`npx create-docusaurus@latest . classic --typescript`).
- [ ] T002 Install project dependencies (e.g., `npm install`).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 Create `scripts/` directory.
- [ ] T004 Create `scripts/speak.sh` with `espeak` command (`scripts/speak.sh`).
- [ ] T005 Make `scripts/speak.sh` executable (`scripts/speak.sh`).

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Publishing Platform Initialization (Priority: P1) 🎯 MVP

**Goal**: Set up a new web-based publishing platform.

**Independent Test**: Verify basic site structure and configuration after initialization.

### Implementation for User Story 1

- [ ] T006 [US1] Verify Docusaurus initialization (check for `package.json`, `docusaurus.config.ts`, `src/pages/index.tsx`, etc.).

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Configure Publishing Platform (Priority: P1)

**Goal**: Configure the publishing platform with the correct title, tagline, organization name, and project name.

**Independent Test**: Verify `docusaurus.config.ts` contains the specified values after initialization.

### Implementation for User Story 2

- [ ] T007 [P] [US2] Update `docusaurus.config.ts` with "Embodied Intelligence" as the `title` (`docusaurus.config.ts`).
- [ ] T008 [P] [US2] Update `docusaurus.config.ts` with "Physical AI & Humanoid Robotics" as the `tagline` (`docusaurus.config.ts`).
- [ ] T009 [P] [US2] Update `docusaurus.config.ts` to reflect "Panaversity" as the organization name (e.g., in `package.json` if applicable, or document if not directly configurable in `docusaurus.config.ts`).
- [ ] T010 [P] [US2] Update `docusaurus.config.ts` to reflect "embodied-intelligence-book" as the project name (e.g., in `package.json` if applicable, or document if not directly configurable in `docusaurus.config.ts`).

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Clean Up Default Platform Content (Priority: P1)

**Goal**: Remove default content folders and their associated navigation links.

**Independent Test**: Confirm the removal of specified default content and their links in the platform's configuration.

### Implementation for User Story 3

- [ ] T011 [P] [US3] Disable default blog plugin in `docusaurus.config.ts` by setting `blog: false` in `@docusaurus/preset-classic` options (`docusaurus.config.ts`).
- [ ] T012 [P] [US3] Delete default `blog/` directory and `docs/intro.md` file (if they exist after initialization).
- [ ] T013 [P] [US3] Remove default navigation items related to blog and docs from `themeConfig.navbar.items` in `docusaurus.config.ts` (`docusaurus.config.ts`).

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: User Story 4 - Establish Textbook Content Structure (Priority: P1)

**Goal**: Create the main content organization structure for the four parts of the textbook, and add a placeholder file in each.

**Independent Test**: Verify the existence of the new content organization structure and a placeholder file in each, and confirming that the publishing platform builds without errors.

### Implementation for User Story 4

- [ ] T014 [P] [US4] Create `docs/01-foundations/` directory.
- [ ] T015 [P] [US4] Create `docs/01-foundations/_index.md` placeholder file (`docs/01-foundations/_index.md`).
- [ ] T016 [P] [US4] Create `docs/02-simulation/` directory.
- [ ] T017 [P] [US4] Create `docs/02-simulation/_index.md` placeholder file (`docs/02-simulation/_index.md`).
- [ ] T018 [P] [US4] Create `docs/03-perception/` directory.
- [ ] T019 [P] [US4] Create `docs/03-perception/_index.md` placeholder file (`docs/03-perception/_index.md`).
- [ ] T020 [P] [US4] Create `docs/04-vla/` directory.
- [ ] T021 [P] [US4] Create `docs/04-vla/_index.md` placeholder file (`docs/04-vla/_index.md`).

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 7: User Story 5 - Audible Notification for Progress (Priority: P2)

**Goal**: Provide an audible notification mechanism that can announce steps.

**Independent Test**: Run the notification mechanism (`scripts/speak.sh`) with a message and verify that it produces audible output.

### Implementation for User Story 5

- [ ] T022 [US5] Test `scripts/speak.sh` with a sample message to ensure it produces audible output.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete setup and overall project health.

- [ ] T023 Run Docusaurus build (`npm run build`) to verify the complete setup and ensure no errors.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion.
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrates with US1.
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Integrates with US1.
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - Integrates with US1.
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Independent.

### Within Each User Story

- Models before services (if applicable).
- Services before endpoints (if applicable).
- Core implementation before integration.
- Story complete before moving to next priority.

### Parallel Opportunities

- All tasks marked [P] can run in parallel within their respective phases/user stories.
- Once Foundational phase completes, User Story 5 (Audible Notification for Progress) can be worked on in parallel with other P1 User Stories since it's an independent utility.
- Other P1 User Stories (1, 2, 3, 4) have some interdependencies but can be distributed. For example, updating `docusaurus.config.ts` (US2, US3) can be parallelized for different sections.
- Creating content directories and placeholder files (US4) can be highly parallelized.

---

## Parallel Example: User Story 2 (P1) - Configure Publishing Platform

```bash
# Update configuration for branding in parallel:
Task: "Update docusaurus.config.ts with \"Embodied Intelligence\" as the title"
Task: "Update docusaurus.config.ts with \"Physical AI & Humanoid Robotics\" as the tagline"
Task: "Update docusaurus.config.ts to reflect \"Panaversity\" as the organization name"
Task: "Update docusaurus.config.ts to reflect \"embodied-intelligence-book\" as the project name"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1.  Complete Phase 1: Setup
2.  Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3.  Complete Phase 3: User Story 1
4.  **STOP and VALIDATE**: Test User Story 1 independently.
5.  Deploy/demo if ready.

### Incremental Delivery

1.  Complete Setup + Foundational → Foundation ready.
2.  Add User Story 1 → Test independently → Deploy/Demo (MVP!).
3.  Add User Story 2 → Test independently → Deploy/Demo.
4.  Add User Story 3 → Test independently → Deploy/Demo.
5.  Add User Story 4 → Test independently → Deploy/Demo.
6.  Add User Story 5 → Test independently → Deploy/Demo.
7.  Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1.  Team completes Setup + Foundational together.
2.  Once Foundational is done:
    - Developer A: User Story 1, then User Story 2 (or a part of it).
    - Developer B: User Story 3, then User Story 4 (or a part of it).
    - Developer C: User Story 5 (since it's relatively independent).
3.  Stories complete and integrate independently.

---

## Notes

-   [P] tasks = different files, no dependencies.
-   [Story] label maps task to specific user story for traceability.
-   Each user story should be independently completable and testable.
-   Verify tests fail before implementing (if applicable).
-   Commit after each task or logical group.
-   Stop at any checkpoint to validate story independently.
-   Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence.
