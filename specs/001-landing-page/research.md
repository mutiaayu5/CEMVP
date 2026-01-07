# Research: CreateConomy Landing Page

**Date**: 2026-01-06  
**Feature**: CreateConomy Landing Page  
**Plan**: [plan.md](./plan.md)

## Technical Decisions

### Rendering Strategy: Static Site Generation (SSG)

**Decision**: Use Next.js 16.1.1 App Router with Static Site Generation (SSG) for the main landing page (`app/page.tsx`) with 3600s (1 hour) revalidation.

**Rationale**:
- SSG provides optimal performance for landing pages (FCP < 600ms, LCP < 900ms achievable)
- Static HTML can be cached at CDN edge (Vercel Edge) for global performance
- 3600s revalidation balances freshness with performance (blog posts and waitlist count update hourly)
- No server-side computation on each request reduces latency
- Meets constitution Performance-First principle requirements

**Alternatives considered**:
- **Server-Side Rendering (SSR)**: Rejected - adds latency, not needed for landing page content
- **Incremental Static Regeneration (ISR) with shorter intervals**: Rejected - 3600s sufficient for blog content updates, reduces database load
- **Client-Side Rendering (CSR)**: Rejected - poor SEO, slower initial load, violates performance targets

### Rate Limiting: Database-Based (No Redis)

**Decision**: Implement rate limiting using database queries: `COUNT(created_at > NOW() - '1 hour')` per IP address.

**Rationale**:
- User specified "NO Redis" constraint
- Supabase PostgreSQL can handle rate limit queries efficiently with proper indexing
- Simpler infrastructure (no additional service to manage)
- Rate limit data persists across deployments
- Index on `created_at` in `waitlist_emails` table ensures fast queries

**Alternatives considered**:
- **Redis-based rate limiting**: Rejected - violates "NO Redis" constraint
- **In-memory rate limiting**: Rejected - doesn't persist across server restarts, not suitable for serverless
- **Third-party rate limiting service**: Rejected - adds external dependency, cost, and complexity

### API Route Structure

**Decision**: Use Next.js App Router API routes:
- `POST /api/waitlist` - Email signup with validation, rate limiting, duplicate check
- `GET /api/waitlist/count` - Return current waitlist count for live counter

**Rationale**:
- Follows Next.js 16.1.1 App Router conventions
- Co-located with application code for maintainability
- Supports Edge runtime for optimal performance
- RESTful design is clear and testable

**Alternatives considered**:
- **Separate API service**: Rejected - unnecessary complexity for landing page, adds latency
- **GraphQL**: Rejected - overkill for simple CRUD operations, adds complexity

### Database ORM: Prisma 5.17.0

**Decision**: Use Prisma 5.17.0 as the database ORM with Supabase PostgreSQL.

**Rationale**:
- Constitution requirement (Prisma 5.17.0)
- Type-safe database queries prevent runtime errors
- Excellent migration system for schema management
- Strong TypeScript integration
- Works seamlessly with Supabase PostgreSQL

**Alternatives considered**:
- **Raw SQL queries**: Rejected - no type safety, more error-prone, violates Type Safety principle
- **Other ORMs (TypeORM, Sequelize)**: Rejected - constitution specifies Prisma 5.17.0

### Validation: Zod Schemas

**Decision**: Use Zod for runtime validation of all API inputs and form submissions.

**Rationale**:
- Constitution requirement (Security by Default, Type Safety)
- Type-safe validation with TypeScript inference
- Clear error messages for users
- Prevents invalid data from reaching database
- Industry standard for Next.js applications

**Alternatives considered**:
- **Manual validation**: Rejected - error-prone, violates Security by Default principle
- **Other validation libraries (Yup, Joi)**: Rejected - Zod is modern, TypeScript-first, widely adopted in Next.js ecosystem

### Component Architecture

**Decision**: Organize components as:
- `Header.tsx` - Navigation (Logo, Our Story, News)
- `Hero.tsx` - Under construction hero with grayscale design
- `BlogSection.tsx` - Blog grid (3-column, category filtering)
- `WaitlistForm.tsx` - Email signup form

**Rationale**:
- Separation of concerns (navigation, hero, content, form)
- Reusable components
- Easy to test independently
- Follows React best practices
- Supports mobile-responsive design

**Alternatives considered**:
- **Monolithic page component**: Rejected - poor maintainability, difficult to test
- **Over-abstracted component hierarchy**: Rejected - unnecessary complexity for landing page

### Live Counter Updates

**Decision**: Implement live counter using client-side polling or Server-Sent Events (SSE) to fetch updated count from `/api/waitlist/count` endpoint.

**Rationale**:
- Simple implementation without WebSocket complexity
- Polling every 5-10 seconds is sufficient for social proof
- SSE provides real-time updates if needed
- Works with SSG architecture (API route handles dynamic data)

**Alternatives considered**:
- **WebSocket connection**: Rejected - unnecessary complexity, adds connection overhead
- **No live updates**: Rejected - violates user story requirement for real-time counter

## Performance Optimization Strategies

1. **Image Optimization**: Use Next.js Image component with proper sizing to prevent CLS
2. **Font Optimization**: Use `next/font` for self-hosted fonts, preload critical fonts
3. **CSS Optimization**: Tailwind CSS v4.x with purging unused styles
4. **Code Splitting**: Automatic with Next.js App Router
5. **Static Asset Caching**: Leverage Vercel Edge CDN for global distribution

## Security Considerations

1. **Input Validation**: All inputs validated with Zod before processing
2. **Rate Limiting**: Database-based, per-IP, 5 submissions/hour
3. **SQL Injection Prevention**: Prisma parameterized queries
4. **CSP Headers**: Configure in Next.js middleware (script-src 'self')
5. **Supabase RLS**: Enable Row Level Security policies on all tables

## Mobile Responsiveness

1. **Mobile-First Design**: Start with 320px width, scale up
2. **3-Column Grid**: Adapts to 1 column on mobile, 2 on tablet, 3 on desktop
3. **Touch-Friendly**: Form inputs and buttons sized for mobile interaction
4. **Performance**: Optimize for 3G connections (<2s load time)

## SEO Considerations

1. **Meta Tags**: Title "CreateConomy - AI Marketplace Coming Soon", unique descriptions
2. **Structured Data**: JSON-LD for Organization and BlogPosting
3. **Semantic HTML**: Proper heading hierarchy, article tags for blog posts
4. **robots.txt**: Allow indexing (index, follow)
5. **Sitemap**: Generate sitemap for blog posts

