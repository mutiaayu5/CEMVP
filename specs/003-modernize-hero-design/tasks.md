# Tasks: Modernize Hero Section Design

**Input**: Design documents from `/specs/003-modernize-hero-design/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md  
**Tests**: Not requested in specification - manual visual testing and Lighthouse audits only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Next.js App Router structure
- **Component location**: `app/components/Hero.tsx`
- **Configuration**: `next.config.js` at repository root
- **Styles**: `app/globals.css` (if needed)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project configuration and prerequisites

- [x] T001 Verify Next.js 16.1.1 App Router setup and dependencies in package.json
- [x] T002 [P] Verify Tailwind CSS 3.4.19 configuration in tailwind.config.ts
- [x] T003 [P] Verify TypeScript strict mode enabled in tsconfig.json
- [x] T004 [P] Verify dark mode implementation exists in codebase
- [x] T005 [P] Verify existing Hero component structure in app/components/Hero.tsx

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core configuration that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Configure Next.js for external images by adding remotePatterns to next.config.js for illustrations.popsy.co domain

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - First-Time Visitor Experiences Modern Hero Section (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor lands on the homepage and immediately sees a visually appealing, modern hero section with clear messaging on the left and an engaging illustration on the right that helps them understand the product's purpose.

**Independent Test**: Load the homepage on desktop and mobile devices, verify the hero section displays with proper layout (horizontal on desktop ≥1024px, vertical on mobile <1024px), readable typography, and visual appeal.

### Implementation for User Story 1

- [x] T007 [US1] Update Hero component structure in app/components/Hero.tsx to use flexbox layout with flex-col for mobile and lg:flex-row for desktop (1024px breakpoint)
- [x] T008 [US1] Add Next.js Image import to app/components/Hero.tsx
- [x] T009 [US1] Implement left-side content container in app/components/Hero.tsx with text content (badge, headline, subtitle, waitlist form, supporting text)
- [x] T010 [US1] Implement right-side illustration container in app/components/Hero.tsx with Next.js Image component pointing to https://illustrations.popsy.co/amber/artificial-intelligence.svg
- [x] T011 [US1] Set container max-width to max-w-7xl (1280px) in app/components/Hero.tsx per FR-016
- [x] T012 [US1] Configure responsive breakpoint at lg: (1024px) for horizontal layout transition in app/components/Hero.tsx per FR-001 and FR-002
- [x] T013 [US1] Add descriptive alt text "AI Workflow Illustration" to Image component in app/components/Hero.tsx per FR-014

**Checkpoint**: At this point, User Story 1 should be fully functional with basic layout and illustration. Test independently on desktop (≥1024px) and mobile (<1024px).

---

## Phase 4: User Story 2 - Visitor Appreciates Visual Design Quality (Priority: P2)

**Goal**: A visitor views the hero section and perceives the site as modern, professional, and trustworthy due to the clean design, subtle color gradients, and cohesive visual style.

**Independent Test**: Have users rate the visual appeal and professionalism of the hero section, measure whether the design meets modern web standards for spacing, color usage, and visual hierarchy.

### Implementation for User Story 2

- [x] T014 [US2] Replace amber gradient background with blue/indigo/slate gradient (from-slate-50 via-blue-50/30 to-indigo-50/40) in app/components/Hero.tsx per FR-005
- [x] T015 [US2] Add dark mode gradient variants (dark:from-gray-950 dark:via-slate-900 dark:to-gray-900) in app/components/Hero.tsx per FR-007
- [x] T016 [US2] Add radial gradient overlays (top-right and bottom-left) for depth in app/components/Hero.tsx per research.md gradient patterns
- [x] T017 [US2] Update badge styling with blue/indigo gradient theme (from-blue-50 to-indigo-50) in app/components/Hero.tsx
- [x] T018 [US2] Add gradient text effect to headline "AI Workflow" (gray gradient) in app/components/Hero.tsx per FR-006
- [x] T019 [US2] Add gradient text effect to headline "Marketplace" (blue-600 via-indigo-600 to-purple-600) in app/components/Hero.tsx per FR-006
- [x] T020 [US2] Refine typography spacing with leading-[1.1] tracking-tight for headline in app/components/Hero.tsx per FR-006
- [x] T021 [US2] Update badge border and text colors to blue theme (border-blue-200/50 text-blue-700) in app/components/Hero.tsx
- [x] T022 [US2] Ensure minimalistic design with appropriate whitespace in app/components/Hero.tsx per FR-008

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently with modern visual design. Test visual appeal and dark mode.

---

## Phase 5: User Story 3 - Fast Page Load Experience (Priority: P1)

**Goal**: A visitor on a slower connection or mobile device experiences fast initial page load because the hero section prioritizes critical content and defers non-essential image loading.

**Independent Test**: Measure page load metrics using Lighthouse and network throttling tools, verify that text content displays immediately and images load progressively without blocking rendering. Verify FCP < 600ms, LCP < 900ms, CLS = 0.0.

### Implementation for User Story 3

- [x] T023 [US3] Add loading="lazy" attribute to Image component in app/components/Hero.tsx per FR-003
- [x] T024 [US3] Set priority={false} on Image component in app/components/Hero.tsx to defer loading
- [x] T025 [US3] Add explicit width={600} and height={600} to Image component in app/components/Hero.tsx to prevent CLS per FR-011
- [x] T026 [US3] Add aspect-square class to illustration container div in app/components/Hero.tsx to reserve space and prevent layout shift per FR-011
- [x] T027 [US3] Verify text content renders before illustration loads (text appears immediately, illustration loads after) in app/components/Hero.tsx
- [ ] T028 [US3] Run Lighthouse audit and verify FCP < 600ms, LCP < 900ms, CLS = 0.0 per SC-001, SC-002, SC-003

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should work independently with optimal performance. Test with Lighthouse and network throttling.

---

## Phase 6: User Story 4 - Responsive Experience Across Devices (Priority: P1)

**Goal**: A visitor using any device (desktop, tablet, mobile) sees an optimally laid out hero section that adapts to their screen size without horizontal scrolling, content overflow, or layout breaking.

**Independent Test**: View the hero section on various screen sizes (320px mobile to 2560px desktop) and verify proper layout adaptation, readable text, and appropriate image sizing at each breakpoint.

### Implementation for User Story 4

- [x] T029 [US4] Verify vertical stack layout works correctly on screens < 1024px in app/components/Hero.tsx per FR-002
- [x] T030 [US4] Verify horizontal layout works correctly on screens ≥ 1024px in app/components/Hero.tsx per FR-001
- [ ] T031 [US4] Test responsive behavior at breakpoints: 320px, 768px, 1024px, 1920px, 2560px per SC-005
- [x] T032 [US4] Verify text remains readable without zoom or horizontal scrolling at all breakpoints in app/components/Hero.tsx per FR-012
- [x] T033 [US4] Verify illustration sizing adapts appropriately (max-w-md on mobile, max-w-lg on desktop) in app/components/Hero.tsx
- [ ] T034 [US4] Test device rotation (orientation change) to ensure layout adapts smoothly in app/components/Hero.tsx
- [x] T035 [US4] Verify maximum width constraint (max-w-7xl) prevents awkward stretching on 4K+ screens in app/components/Hero.tsx per FR-016

**Checkpoint**: At this point, all user stories should work independently with full responsive behavior. Test on real devices and various screen sizes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and edge cases

- [x] T036 [P] Implement illustration failure handling with onError handler to hide gracefully in app/components/Hero.tsx per FR-015
- [x] T037 [P] Verify keyboard navigation works for all interactive elements in app/components/Hero.tsx per FR-013
- [x] T038 [P] Validate WCAG 2.1 Level AA contrast ratios (4.5:1 body, 3:1 headings) in app/components/Hero.tsx per SC-006
- [ ] T039 [P] Test with images disabled in browser to ensure text content remains functional per edge cases
- [x] T040 [P] Test dark mode styling and contrast in app/components/Hero.tsx per FR-007
- [x] T041 [P] Verify screen reader announces content correctly (semantic HTML, alt text) in app/components/Hero.tsx
- [ ] T042 [P] Run final Lighthouse audit and verify score ≥ 99/100 per SC-004
- [x] T043 [P] Test Vercel build succeeds (npm run build) per SC-007
- [x] T044 [P] Verify no TypeScript errors in app/components/Hero.tsx
- [ ] T045 [P] Test illustration loads correctly on production deployment per SC-007

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (US1 → US2 → US3 → US4)
  - Some tasks within stories can run in parallel if they touch different parts of the component
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 completion - Builds on layout structure from US1
- **User Story 3 (P1)**: Can start after US1 completion - Adds performance optimizations to existing structure
- **User Story 4 (P1)**: Can start after US1 completion - Tests responsive behavior of existing structure

### Within Each User Story

- Basic structure before styling
- Layout before visual design
- Core implementation before performance optimization
- Implementation before responsive testing
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks (T002-T005) marked [P] can run in parallel
- Polish tasks (T036-T045) marked [P] can run in parallel
- Some tasks within a user story can be parallelized if they modify different sections of the component
- Note: Most tasks modify the same file (Hero.tsx), so true parallelism is limited

---

## Parallel Example: Setup Phase

```bash
# Launch all setup verification tasks together:
Task: "Verify Tailwind CSS 3.4.19 configuration in tailwind.config.ts"
Task: "Verify TypeScript strict mode enabled in tsconfig.json"
Task: "Verify dark mode implementation exists in codebase"
Task: "Verify existing Hero component structure in app/components/Hero.tsx"
```

---

## Parallel Example: Polish Phase

```bash
# Launch all polish tasks together (they check different aspects):
Task: "Implement illustration failure handling with onError handler"
Task: "Verify keyboard navigation works for all interactive elements"
Task: "Validate WCAG 2.1 Level AA contrast ratios"
Task: "Test with images disabled in browser"
Task: "Test dark mode styling and contrast"
Task: "Verify screen reader announces content correctly"
Task: "Run final Lighthouse audit"
Task: "Test Vercel build succeeds"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently on desktop and mobile
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Visual polish)
4. Add User Story 3 → Test independently → Deploy/Demo (Performance)
5. Add User Story 4 → Test independently → Deploy/Demo (Responsive)
6. Add Polish → Final validation → Production

### Sequential Implementation (Recommended)

Since most tasks modify the same file (Hero.tsx), sequential implementation is recommended:

1. Team completes Setup + Foundational together
2. Implement User Story 1 (basic layout and illustration)
3. Implement User Story 2 (visual design and gradients)
4. Implement User Story 3 (performance optimizations)
5. Implement User Story 4 (responsive testing and validation)
6. Complete Polish phase (edge cases and final validation)

---

## Notes

- [P] tasks = different files or different aspects, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Most tasks modify app/components/Hero.tsx - commit frequently
- Stop at any checkpoint to validate story independently
- Follow quickstart.md for detailed implementation guidance
- Reference research.md for technical decisions
- Avoid: modifying multiple unrelated files simultaneously, skipping performance validation

---

## Task Summary

**Total Tasks**: 45 tasks

**Task Count by Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 1 task
- Phase 3 (User Story 1): 7 tasks
- Phase 4 (User Story 2): 9 tasks
- Phase 5 (User Story 3): 6 tasks
- Phase 6 (User Story 4): 7 tasks
- Phase 7 (Polish): 10 tasks

**Task Count by User Story**:
- User Story 1 (P1): 7 tasks
- User Story 2 (P2): 9 tasks
- User Story 3 (P1): 6 tasks
- User Story 4 (P1): 7 tasks

**Parallel Opportunities**: 
- Setup phase: 4 tasks can run in parallel
- Polish phase: 10 tasks can run in parallel
- Limited parallelism within user stories (same file)

**Independent Test Criteria**:
- **US1**: Load homepage on desktop and mobile, verify layout and illustration
- **US2**: Rate visual appeal, measure design standards compliance
- **US3**: Measure Lighthouse metrics (FCP, LCP, CLS) with network throttling
- **US4**: Test on various screen sizes (320px to 2560px), verify responsive behavior

**Suggested MVP Scope**: User Story 1 only (basic layout with illustration)

**Format Validation**: ✅ All tasks follow checklist format with checkbox, ID, optional [P] marker, optional [Story] label, and file paths

