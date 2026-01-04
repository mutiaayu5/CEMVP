# Environment Variables Explained

## Quick Answer

**You DON'T need to add .env file to Vercel!**

- `.env.local` = **LOCAL development only** (your computer)
- **Vercel Environment Variables** = **PRODUCTION deployment** (Vercel's servers)

They are **separate** and serve different purposes.

## How It Works

### Local Development (Your Computer)

When you run `npm run dev` on your computer:
- Next.js reads `.env.local` file
- Prisma reads `DATABASE_URL` from `.env.local`
- This is for **testing locally**

### Production (Vercel)

When Vercel builds and deploys:
- Vercel reads environment variables from **Vercel Dashboard**
- Prisma reads `DATABASE_URL` from **Vercel's environment variables**
- `.env.local` is **NOT deployed** (it's in `.gitignore`)

## Why You Need .env.local Locally

You need `.env.local` **only for local development**:

1. **Test locally** - Run `npm run dev` and test on your computer
2. **Prisma commands** - Run `prisma db push` or `prisma studio` locally
3. **Development** - Work on features before deploying

## Why Vercel Doesn't Use .env.local

- `.env.local` is in `.gitignore` (not committed to Git)
- Vercel never sees your `.env.local` file
- Vercel uses its **own environment variables** (set in dashboard)

## The Flow

```
LOCAL DEVELOPMENT:
Your Computer → .env.local → process.env → Prisma reads DATABASE_URL

PRODUCTION (Vercel):
Vercel Dashboard → Environment Variables → process.env → Prisma reads DATABASE_URL
```

## What Prisma Actually Reads

Prisma reads from `process.env.DATABASE_URL`:

```typescript
// prisma/schema.prisma
datasource db {
  url = env("DATABASE_URL")  // Reads from process.env.DATABASE_URL
}
```

Where does `process.env.DATABASE_URL` come from?

- **Local**: `.env.local` file (Next.js automatically loads it)
- **Vercel**: Environment variables you set in Vercel Dashboard

## Setup Summary

### For Local Development (Optional - only if you want to test locally)

1. Create `.env.local` on your computer
2. Add your Supabase connection strings
3. Test locally with `npm run dev`

### For Vercel Deployment (Required)

1. Go to Vercel Dashboard
2. Add environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
3. Deploy - Vercel will use these variables

## Important Notes

✅ **You can deploy to Vercel WITHOUT .env.local**
- Just add environment variables in Vercel Dashboard
- Vercel will use those during build and runtime

✅ **.env.local is ONLY for your local computer**
- Never committed to Git (in `.gitignore`)
- Never deployed to Vercel
- Only used when running `npm run dev` locally

✅ **Prisma works the same way in both places**
- Reads from `process.env.DATABASE_URL`
- Doesn't care if it comes from `.env.local` or Vercel

## Example

### Local Development
```bash
# On your computer
# .env.local file:
DATABASE_URL="postgresql://..."
```

### Vercel Production
```
# In Vercel Dashboard → Environment Variables:
DATABASE_URL = "postgresql://..."
```

Both work! Prisma reads from `process.env.DATABASE_URL` in both cases.

## Bottom Line

- **Local**: Use `.env.local` to test on your computer
- **Vercel**: Add environment variables in Vercel Dashboard
- **They're separate** - Vercel never sees your `.env.local` file

You can deploy to Vercel right now by just adding the environment variables in the Vercel Dashboard!

