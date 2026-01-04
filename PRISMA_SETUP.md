# Prisma + Supabase Setup Guide

This guide explains how Prisma is integrated with Supabase in this project.

## Architecture Overview

- **Supabase**: Handles authentication (auth.users) and hosts PostgreSQL database
- **Prisma**: Provides type-safe ORM for data access to custom tables
- **Connection**: Prisma connects directly to Supabase's PostgreSQL instance

## Initial Setup

### 1. Get Supabase Connection Strings

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **Database**
4. Find **Connection String** section
5. Copy:
   - **Connection Pooling** (port 6543) → Use for `DATABASE_URL`
   - **Direct Connection** (port 5432) → Use for `DIRECT_URL`

### 2. Configure Environment Variables

#### For Local Development (Optional)

If you want to test locally, create `.env.local`:

```bash
cp env.example .env.local
```

Update `.env.local` with your Supabase connection strings:

```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

**Note**: `.env.local` is ONLY for local development. It's not deployed to Vercel.

#### For Vercel Deployment (Required)

Add environment variables in **Vercel Dashboard** → **Settings** → **Environment Variables**:

- `DATABASE_URL` - Supabase connection pooling URL
- `DIRECT_URL` - Supabase direct connection URL

Vercel will use these during build and runtime. Prisma reads from `process.env.DATABASE_URL` which Vercel provides.

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

This creates the type-safe Prisma Client based on your schema.

### 5. Push Schema to Database

Since you're starting fresh, use `db push` to create tables:

```bash
npm run prisma:push
```

This will:
- Create all tables in Supabase
- Set up indexes
- Create enums
- Link foreign keys

## Database Schema

### Models

1. **Profile** - User profiles linked to Supabase auth.users
   - `userId` links to `auth.users.id` from Supabase
   - Roles: CONSUMER, CREATOR, ADMIN

2. **Template** - Core marketplace asset
   - Contains template metadata
   - Links to creator (Profile)
   - Supports vector embeddings for semantic search

3. **TemplateVersion** - Version control for templates
   - Multiple versions per template
   - Links to Supabase Storage for file URLs

4. **Interaction** - User interactions (views, downloads, likes)
   - Tracks user engagement
   - Used for trending/analytics

## Using Prisma in Your Code

### Import Prisma Client

```typescript
import { prisma } from '@/lib/prisma'
```

### Example: Create Profile After Signup

```typescript
// app/api/auth/create-profile/route.ts
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      email: user.email!,
      role: 'CONSUMER',
    },
  })

  return Response.json({ profile })
}
```

### Example: Query Templates

```typescript
// Get approved templates
const templates = await prisma.template.findMany({
  where: {
    status: 'APPROVED',
  },
  include: {
    creator: {
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
})
```

## Available Scripts

- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:push` - Push schema changes to database (development)
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:migrate` - Create migration (for production)

## Important Notes

### Connection Strings

- **DATABASE_URL**: Use connection pooling (port 6543) for app queries
  - Better performance
  - Handles connection limits
  - Use `?pgbouncer=true` parameter

- **DIRECT_URL**: Use direct connection (port 5432) for migrations
  - Required for schema changes
  - Used by `prisma migrate` and `prisma db push`

### Supabase Auth Integration

- Supabase handles authentication (auth.users table)
- Prisma manages your custom tables (profiles, templates, etc.)
- Link them via `Profile.userId = auth.users.id`

### Vector Embeddings

The `embedding` field uses `Unsupported("vector(1536)")` because Prisma doesn't natively support pgvector. For vector operations, use:

1. Raw SQL queries for vector search
2. Supabase RPC functions for semantic search
3. Prisma for all other operations

### Production Deployment

1. Add `DATABASE_URL` and `DIRECT_URL` to Vercel environment variables
2. Run `prisma generate` in build step (already in package.json)
3. Use migrations for schema changes: `prisma migrate deploy`

## Troubleshooting

### Error: Can't reach database server

- Check connection strings are correct
- Verify Supabase project is active
- Check network/firewall settings

### Error: Relation does not exist

- Run `npm run prisma:push` to create tables
- Or create migration: `npm run prisma:migrate`

### Error: Prisma Client not generated

- Run `npm run prisma:generate`
- Ensure `prisma generate` runs before build

## Next Steps

1. ✅ Prisma is set up and ready
2. Create API routes using Prisma Client
3. Update signup flow to create Profile
4. Build template CRUD operations
5. Implement admin dashboard

