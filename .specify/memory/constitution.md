<!--
Sync Impact Report:
Version: 0.0.0 (template) → 1.0.0 (initial constitution)
Modified Principles: N/A (initial creation)
Added Sections: Performance Standards, Security Requirements, Database Schema, SEO Requirements, Tech Stack
Removed Sections: N/A
Templates requiring updates:
  ✅ .specify/templates/plan-template.md - Constitution Check section aligns with principles
  ✅ .specify/templates/spec-template.md - No changes needed
  ✅ .specify/templates/tasks-template.md - No changes needed
Follow-up TODOs: None
-->

# CreateConomy Constitution

## Core Principles

### I. Performance-First (NON-NEGOTIABLE)

All features MUST meet strict performance targets: First Contentful Paint
(FCP) < 600ms, Largest Contentful Paint (LCP) < 900ms, Cumulative Layout
Shift (CLS) = 0.0, and Lighthouse score >= 99/100. Performance budgets
are non-negotiable and MUST be validated before deployment. Rationale:
User experience and search engine rankings depend on fast load times.

### II. Security by Default

All user inputs MUST be validated with Zod schemas. Database access MUST
use Supabase Row Level Security (RLS) policies. Rate limiting MUST be
enforced (5 emails/hour per IP for waitlist endpoints). Content Security
Policy (CSP) MUST restrict script sources to 'self'. Rationale: Security
vulnerabilities can compromise user data and platform integrity.

### III. Type Safety & Validation

All API endpoints and form inputs MUST use Zod schemas for runtime
validation. TypeScript strict mode MUST be enabled. Database queries
MUST use Prisma's type-safe client. Rationale: Type safety prevents
runtime errors and ensures data integrity.

### IV. SEO & Accessibility

All pages MUST include proper meta tags, semantic HTML, and structured
data. Title tags MUST follow project conventions (e.g., "CreateConomy -
AI Marketplace Coming Soon"). robots.txt MUST allow indexing (index,
follow) unless explicitly restricted. Rationale: Discoverability and
accessibility are essential for user acquisition.

### V. Modern Web Standards

MUST use Next.js 16.1.1 App Router architecture. MUST deploy on Vercel
Edge runtime for optimal performance. MUST use Tailwind CSS v4.x for
styling. Database MUST use Prisma 5.17.0 with Supabase PostgreSQL.
Rationale: Modern frameworks provide better performance, developer
experience, and maintainability.

## Performance Standards

- **FCP Target**: < 600ms (measured via Lighthouse)
- **LCP Target**: < 900ms (measured via Lighthouse)
- **CLS Target**: 0.0 (zero layout shift)
- **Lighthouse Score**: >= 99/100 (all categories)
- **Load Time**: < 2 seconds total page load
- Performance budgets MUST be validated in CI/CD pipeline before
  deployment.

## Security Requirements

- **Input Validation**: All user inputs MUST use Zod schemas
- **Database Security**: Supabase RLS policies MUST be enabled on all
  tables
- **Rate Limiting**: 5 emails/hour per IP address for waitlist
  endpoints
- **CSP**: Content Security Policy MUST restrict script-src to 'self'
- **Authentication**: All authenticated endpoints MUST verify user
  identity
- Security audits MUST be performed before production deployment.

## Database Schema

### Required Tables

- **waitlist_emails**: id (primary key), email (unique, indexed),
  created_at (indexed)
- **blog_posts**: id (primary key), title, slug (unique), excerpt,
  category, published_at

### Index Requirements

- Email column in waitlist_emails MUST be indexed for fast lookups
- created_at in waitlist_emails MUST be indexed for time-based queries
- All foreign keys MUST be indexed

### Migration Policy

- All schema changes MUST use Prisma migrations
- Migrations MUST be reviewed before application
- Rollback plans MUST be documented for each migration

## SEO Requirements

- **Page Titles**: MUST follow format "CreateConomy - [Page Description]"
- **Meta Descriptions**: MUST be unique and descriptive for each page
- **robots.txt**: MUST allow indexing (index, follow) unless explicitly
  restricted
- **Structured Data**: MUST include JSON-LD where applicable
- **Semantic HTML**: MUST use proper heading hierarchy and semantic
  elements
- **Alt Text**: All images MUST include descriptive alt text

## Tech Stack Standards

- **Framework**: Next.js 16.1.1 App Router (MUST use App Router, not
  Pages Router)
- **Database ORM**: Prisma 5.17.0
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS v4.x
- **Deployment**: Vercel Edge runtime
- **Package Manager**: [To be determined based on project setup]
- Tech stack versions MUST be locked in package.json/package-lock.json

## Development Workflow

- All features MUST pass Constitution Check before Phase 0 research
- Constitution Check MUST be re-validated after Phase 1 design
- Performance budgets MUST be validated before deployment
- Security reviews MUST be performed for all user-facing features
- Code reviews MUST verify compliance with all principles

## Governance

This constitution supersedes all other development practices and
guidelines. Amendments require:

1. Documentation of the proposed change and rationale
2. Impact assessment on existing features and templates
3. Update to version number following semantic versioning:
   - **MAJOR**: Backward incompatible changes or principle removals
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
4. Propagation of changes to all dependent templates and documentation
5. Approval from project maintainers

All PRs and code reviews MUST verify compliance with this constitution.
Complexity that violates principles MUST be justified with explicit
rationale in the Complexity Tracking section of implementation plans.

**Version**: 1.0.0 | **Ratified**: 2026-01-06 | **Last Amended**: 2026-01-06
