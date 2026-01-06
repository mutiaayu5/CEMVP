# Implementation Plan: CreateConomy Landing Page

**Branch**: `001-landing-page` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-landing-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a high-performance landing page for CreateConomy AI Workflow Marketplace with waitlist signup, blog content display, and live counter. The page uses Next.js 16.1.1 App Router with Static Site Generation (SSG) for optimal performance, Prisma ORM with Supabase PostgreSQL for data persistence, and implements strict rate limiting and validation to meet security and performance requirements.

## Technical Context

**Language/Version**: TypeScript 5.x (Next.js 16.1.1)  
**Primary Dependencies**: Next.js 16.1.1, Prisma 5.17.0, Supabase PostgreSQL, Tailwind CSS v4.x, Zod  
**Storage**: Supabase PostgreSQL (via Prisma ORM)  
**Testing**: Jest/Vitest for unit tests, Playwright for E2E (to be determined)  
**Target Platform**: Web (Vercel Edge runtime), mobile-responsive (320px-768px+)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: FCP < 600ms, LCP < 900ms, CLS = 0.0, Lighthouse >= 99/100, page load < 2s  
**Constraints**: No Redis (rate limiting via database queries), SSG with 3600s revalidation, mobile-first design  
**Scale/Scope**: Landing page with waitlist signup, blog content display, real-time counter updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with all constitution principles:

- **Performance-First**: ✅ SSG with 3600s revalidation ensures fast initial load. Static generation meets FCP < 600ms, LCP < 900ms targets. CLS = 0.0 achievable with proper image sizing and layout stability. Lighthouse >= 99/100 achievable with optimized static assets.
- **Security by Default**: ✅ Zod validation on all API inputs. Supabase RLS policies required on waitlist_emails and blog_posts tables. Rate limiting via database query (COUNT with time window). CSP headers to be configured in Next.js middleware.
- **Type Safety & Validation**: ✅ TypeScript strict mode enabled. Zod schemas for API endpoints. Prisma type-safe client for database queries.
- **SEO & Accessibility**: ✅ SSG enables proper meta tags and structured data. Semantic HTML in components. Title format: "CreateConomy - AI Marketplace Coming Soon".
- **Modern Web Standards**: ✅ Next.js 16.1.1 App Router architecture. Compatible with Vercel Edge runtime. Tailwind CSS v4.x for styling.

**Status**: All gates pass. No violations identified.

### Post-Design Constitution Check

*Re-evaluated after Phase 1 design completion.*

- **Performance-First**: ✅ SSG with 3600s revalidation confirmed. Database queries optimized with proper indexes. Static assets can be cached at CDN edge. Performance targets achievable.
- **Security by Default**: ✅ Zod schemas defined for all API inputs. Supabase RLS policies documented in quickstart. Rate limiting implemented via database queries. CSP configuration documented.
- **Type Safety & Validation**: ✅ Prisma schema provides type-safe database access. Zod validation schemas defined. TypeScript strict mode will be enforced.
- **SEO & Accessibility**: ✅ Metadata structure defined. Semantic HTML in component architecture. Structured data approach documented.
- **Modern Web Standards**: ✅ Next.js 16.1.1 App Router structure confirmed. Vercel Edge runtime compatible. Tailwind CSS v4.x styling approach documented.

**Status**: All gates pass after design phase. Implementation ready to proceed.

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-page/
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
├── page.tsx                    # Main landing page (SSG, revalidate 3600s)
├── layout.tsx                  # Root layout with metadata
├── api/
│   └── waitlist/
│       ├── route.ts           # POST /api/waitlist (signup)
│       └── count/
│           └── route.ts       # GET /api/waitlist/count
├── components/
│   ├── Header.tsx             # Navigation (Logo, Our Story, News)
│   ├── Hero.tsx               # Under construction hero (grayscale)
│   ├── BlogSection.tsx        # Blog grid (3-column, category filter)
│   └── WaitlistForm.tsx       # Email signup form with validation
└── lib/
    ├── prisma.ts              # Prisma client singleton
    ├── rate-limit.ts           # Rate limiting utility (DB-based)
    └── validations.ts          # Zod schemas

prisma/
├── schema.prisma              # Database schema (WaitlistEmail, BlogPost)
└── migrations/                # Prisma migrations

public/
└── [static assets]

tests/
├── unit/                      # Component and utility tests
└── e2e/                       # End-to-end tests (to be determined)
```

**Structure Decision**: Next.js App Router structure with API routes in `app/api/`, components in `app/components/`, and utilities in `app/lib/`. Prisma schema and migrations in `prisma/` directory. This follows Next.js 16.1.1 conventions and supports SSG for optimal performance.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. All technical choices align with constitution principles.
