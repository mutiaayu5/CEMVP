# Tasks: CreateConomy Landing Page

**Input**: Design documents from `/specs/001-landing-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Next.js App Router structure with `app/` directory at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Next.js 16.1.1 project with TypeScript and Tailwind CSS v4.x
- [x] T002 [P] Install dependencies: prisma@5.17.0 @prisma/client zod
- [x] T003 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T004 [P] Configure ESLint and Prettier for code quality
- [x] T005 [P] Set up environment variable management (.env.local template)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create Prisma schema in prisma/schema.prisma with WaitlistEmail and BlogPost models
- [x] T007 [P] Configure Prisma client connection to Supabase PostgreSQL
- [x] T008 [P] Run initial Prisma migration to create database tables and indexes
- [x] T009 [P] Create Prisma client singleton in app/lib/prisma.ts
- [x] T010 [P] Create Zod validation schemas in app/lib/validations.ts (waitlistEmailSchema)
- [x] T011 [P] Create rate limiting utility in app/lib/rate-limit.ts (database-based, IP tracking)
- [x] T012 [P] Configure root layout in app/layout.tsx with metadata (title, description, SEO)
- [x] T013 [P] Set up Next.js middleware for CSP headers (script-src 'self')
- [ ] T014 [P] Enable Supabase RLS policies on waitlist_emails and blog_posts tables
- [x] T015 [P] Create API route structure (app/api/waitlist/ and app/api/waitlist/count/)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Join Waitlist (Priority: P1) 🎯 MVP

**Goal**: Visitor can join the waitlist by submitting their email address. Form validates input, enforces rate limiting, prevents duplicates, and shows success confirmation.

**Independent Test**: Visit landing page, enter valid email in waitlist form, submit, verify email is saved and success message is displayed. Test invalid email, duplicate email, and rate limiting scenarios.

### Implementation for User Story 1

- [x] T016 [P] [US1] Create Hero component in app/components/Hero.tsx with under construction design (grayscale)
- [x] T017 [P] [US1] Create WaitlistForm component in app/components/WaitlistForm.tsx with email input and validation
- [x] T018 [US1] Implement POST /api/waitlist route in app/api/waitlist/route.ts with Zod validation
- [x] T019 [US1] Add duplicate email check in POST /api/waitlist route (query existing email)
- [x] T020 [US1] Add rate limiting logic in POST /api/waitlist route (COUNT query for IP in last hour)
- [x] T021 [US1] Implement email insertion and position calculation in POST /api/waitlist route
- [x] T022 [US1] Add error handling in POST /api/waitlist route (400, 409, 429 responses per contract)
- [x] T023 [US1] Integrate WaitlistForm with POST /api/waitlist endpoint (fetch, error handling, success state)
- [x] T024 [US1] Add form validation feedback in WaitlistForm (client-side Zod validation)
- [x] T025 [US1] Create main landing page in app/page.tsx with SSG (revalidate 3600s) and Hero/WaitlistForm

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Visitors can join waitlist with proper validation and rate limiting.

---

## Phase 4: User Story 2 - View Blog Content (Priority: P2)

**Goal**: Visitor can view blog posts organized by category ("Our Story" or "News") in a 3-column grid layout. Navigation allows filtering between categories.

**Independent Test**: Click "Our Story" or "News" in navigation, verify blog posts display in 3-column grid with correct category, see title, excerpt, and published date for each post.

### Implementation for User Story 2

- [x] T026 [P] [US2] Create Header component in app/components/Header.tsx with Logo, "Our Story", and "News" navigation
- [x] T027 [P] [US2] Create BlogSection component in app/components/BlogSection.tsx with 3-column grid layout
- [x] T028 [US2] Add blog post fetching logic in app/page.tsx (Prisma query for published posts by category)
- [x] T029 [US2] Implement category filtering in BlogSection component (state management for "Our Story" vs "News")
- [x] T030 [US2] Add blog post card rendering in BlogSection (title, excerpt, published date display)
- [x] T031 [US2] Implement responsive grid layout in BlogSection (3 columns desktop, 2 tablet, 1 mobile)
- [x] T032 [US2] Add empty state handling in BlogSection (message when no posts in category)
- [x] T033 [US2] Integrate Header and BlogSection into app/page.tsx
- [x] T034 [US2] Add navigation state management (highlight active category, scroll to blog section)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Visitors can join waitlist and view blog content by category.

---

## Phase 5: User Story 3 - View Live Counter (Priority: P3)

**Goal**: Visitor sees a live counter displaying total waitlist signups that updates in real-time when new signups occur.

**Independent Test**: View landing page, verify counter displays correct waitlist count. Submit new email, verify counter updates within 5 seconds.

### Implementation for User Story 3

- [x] T035 [P] [US3] Implement GET /api/waitlist/count route in app/api/waitlist/count/route.ts (Prisma count query)
- [x] T036 [US3] Add live counter display component in WaitlistForm or separate component (shows "X people joined")
- [x] T037 [US3] Implement client-side polling in live counter (fetch count every 5-10 seconds)
- [x] T038 [US3] Add counter update after successful waitlist signup (optimistic update + refetch)
- [x] T039 [US3] Handle empty waitlist state in counter (display "0 people joined" or appropriate message)
- [x] T040 [US3] Add loading state for counter (skeleton or spinner while fetching)

**Checkpoint**: At this point, all user stories should be independently functional. Visitors can join waitlist, view blog content, and see live counter updates.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T041 [P] Optimize images and assets for performance (Next.js Image component, proper sizing)
- [x] T042 [P] Add semantic HTML and proper heading hierarchy across all components
- [x] T043 [P] Implement structured data (JSON-LD) for SEO (Organization, BlogPosting schemas)
- [x] T044 [P] Configure robots.txt for indexing (index, follow)
- [x] T045 [P] Add meta descriptions and Open Graph tags in app/layout.tsx
- [x] T046 [P] Optimize Tailwind CSS (purge unused styles, ensure v3.4 compatibility)
- [ ] T047 [P] Add font optimization with next/font for performance
- [x] T048 [P] Implement mobile-responsive design testing (320px-768px+ breakpoints)
- [x] T049 [P] Add error boundaries and graceful error handling
- [ ] T050 [P] Performance testing and optimization (Lighthouse >= 99/100, FCP < 600ms, LCP < 900ms, CLS = 0.0)
- [ ] T051 [P] Accessibility audit and fixes (ARIA labels, keyboard navigation, screen reader support)
- [ ] T052 [P] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] T053 [P] Validate quickstart.md steps and update if needed
- [ ] T054 [P] Code cleanup and refactoring (remove unused code, optimize imports)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on US1, independently testable
- **User Story 3 (P3)**: Depends on US1 (needs waitlist endpoint) but counter can be implemented independently

### Within Each User Story

- Models/schema before API routes
- API routes before components
- Components before integration
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes:
  - US1 and US2 can start in parallel (different components, no dependencies)
  - US3 can start after US1 API route is complete
- Components within a story marked [P] can run in parallel (Hero, WaitlistForm, Header, BlogSection)

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
5. Add Polish phase → Final optimization → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (WaitlistForm, POST /api/waitlist, Hero)
   - Developer B: User Story 2 (Header, BlogSection, blog fetching)
   - Developer C: User Story 3 (GET /api/waitlist/count, live counter) - after US1 API is ready
3. Stories complete and integrate independently
4. Team collaborates on Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Performance targets (FCP < 600ms, LCP < 900ms, CLS = 0.0, Lighthouse >= 99/100) must be validated before deployment
- Rate limiting uses database queries (no Redis) - ensure proper indexing on created_at
- SSG revalidation set to 3600s (1 hour) for optimal performance
- All API inputs must use Zod validation
- Supabase RLS policies must be enabled on all tables

