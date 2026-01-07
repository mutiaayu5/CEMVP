# Quickstart Guide: CreateConomy Landing Page

**Date**: 2026-01-06  
**Feature**: CreateConomy Landing Page  
**Plan**: [plan.md](./plan.md)

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Supabase account and project
- Vercel account (for deployment)

## Setup Steps

### 1. Initialize Next.js Project

```bash
npx create-next-app@16.1.1 createconomy-landing --typescript --tailwind --app
cd createconomy-landing
```

### 2. Install Dependencies

```bash
npm install prisma@5.17.0 @prisma/client zod
npm install -D @types/node
```

### 3. Configure Prisma

```bash
npx prisma init
```

Update `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model WaitlistEmail {
  id        String   @id @default(uuid())
  email     String   @unique @db.VarChar(255)
  created_at DateTime @default(now()) @map("created_at")

  @@index([email])
  @@index([created_at])
  @@map("waitlist_emails")
}

model BlogPost {
  id          String    @id @default(uuid())
  title       String    @db.VarChar(255)
  slug        String    @unique @db.VarChar(255)
  excerpt     String    @db.Text
  category    String    @db.VarChar(50)
  published_at DateTime? @map("published_at")

  @@index([category])
  @@index([published_at])
  @@map("blog_posts")
}
```

### 4. Configure Environment Variables

Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Enable Supabase RLS Policies

In Supabase Dashboard:
1. Go to Authentication > Policies
2. Create policies for `waitlist_emails`:
   - **SELECT**: Allow public read (for count endpoint)
   - **INSERT**: Allow public insert (for signup)
3. Create policies for `blog_posts`:
   - **SELECT**: Allow public read (for blog display)

### 7. Create Prisma Client Singleton

Create `app/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 8. Create Zod Validation Schemas

Create `app/lib/validations.ts`:
```typescript
import { z } from 'zod'

export const waitlistEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
})
```

### 9. Create API Routes

#### `app/api/waitlist/route.ts`
- Implement POST handler with Zod validation
- Add rate limiting logic (database-based)
- Check for duplicates
- Insert email and return position

#### `app/api/waitlist/count/route.ts`
- Implement GET handler
- Return count using Prisma

### 10. Create Components

- `app/components/Header.tsx` - Navigation
- `app/components/Hero.tsx` - Under construction hero
- `app/components/BlogSection.tsx` - Blog grid
- `app/components/WaitlistForm.tsx` - Email signup form

### 11. Configure Main Page

Update `app/page.tsx`:
```typescript
export const revalidate = 3600 // 1 hour

export default async function HomePage() {
  // Fetch blog posts
  // Render components
}
```

### 12. Configure Metadata

Update `app/layout.tsx`:
```typescript
export const metadata = {
  title: 'CreateConomy - AI Marketplace Coming Soon',
  description: 'Join the waitlist for CreateConomy AI Workflow Marketplace',
}
```

## Development Commands

```bash
# Start development server
npm run dev

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## Testing

### Manual Testing Checklist

1. **Waitlist Signup**:
   - [ ] Submit valid email → Success message, counter increments
   - [ ] Submit invalid email → Validation error
   - [ ] Submit duplicate email → "Already registered" message
   - [ ] Submit 5+ times in 1 hour → Rate limit message

2. **Live Counter**:
   - [ ] Counter displays correct count
   - [ ] Counter updates after new signup

3. **Blog Section**:
   - [ ] "Our Story" shows correct posts
   - [ ] "News" shows correct posts
   - [ ] 3-column grid on desktop
   - [ ] Responsive on mobile

4. **Performance**:
   - [ ] Page loads < 2 seconds
   - [ ] Lighthouse score >= 99/100
   - [ ] FCP < 600ms, LCP < 900ms, CLS = 0.0

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Test waitlist signup
- [ ] Verify rate limiting works
- [ ] Check Lighthouse scores
- [ ] Test mobile responsiveness
- [ ] Verify Supabase RLS policies

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Verify network access

### Rate Limiting Not Working
- Check IP extraction from headers
- Verify database queries are correct
- Check indexes on `created_at`

### Performance Issues
- Verify SSG is working (check page source)
- Optimize images with Next.js Image component
- Check Tailwind CSS purging
- Verify CDN caching

## Next Steps

After initial setup:
1. Add E2E tests with Playwright
2. Set up CI/CD pipeline
3. Configure monitoring and analytics
4. Add error tracking (Sentry, etc.)

