# Database Migrations Guide

## Why Migrations Are Needed

When you update your Prisma schema (like we just did to add OAuth accounts, MFA, seller/admin tables), the **database structure** needs to be updated to match. 

**Think of it like this:**
- Your Prisma schema = Blueprint of your database
- Your actual database = The building
- Migration = The construction work to update the building to match the blueprint

## What Changed in Your Schema

We added:
1. New fields to `profiles` table (username, firstName, lastName, phone, MFA fields)
2. New `oauth_accounts` table
3. New `seller_info` table
4. New `admin_info` table
5. Changed `UserRole` enum (CONSUMER → USER, CREATOR → SELLER)

## Two Ways to Update Database

### Option 1: `prisma db push` (Quick - For Development)

**What it does:** Directly pushes schema changes to database (no migration files)

**When to use:** 
- Development/testing
- Quick prototyping
- When you don't need migration history

**How to run:**
```bash
npm run prisma:push
```

**Pros:**
- Fast and simple
- No migration files to manage
- Good for development

**Cons:**
- No migration history
- Can't rollback easily
- Not ideal for production

### Option 2: `prisma migrate` (Production-Safe)

**What it does:** Creates migration files and applies them to database

**When to use:**
- Production deployments
- When you need migration history
- Team collaboration

**How to run:**
```bash
# Create and apply migration
npm run prisma:migrate

# Or manually
npx prisma migrate dev --name add_oauth_and_mfa
```

**Pros:**
- Migration history
- Can rollback
- Production-safe
- Team-friendly

**Cons:**
- Slightly more complex
- Creates migration files

## For Vercel Deployment

### Recommended Approach: Run Migration Before Deploying

**Step 1: Run migration locally (or on your machine)**

```bash
# Make sure you have DATABASE_URL and DIRECT_URL set in .env.local
npm run prisma:generate
npm run prisma:push
```

**Step 2: Deploy to Vercel**

Vercel will automatically:
- Run `prisma generate` (already in your build script)
- Build your Next.js app
- Deploy

**Important:** The migration should be run **before** deploying, not during build.

### Alternative: Run Migration via Supabase SQL Editor

If you can't run migrations locally:

1. **Generate SQL from Prisma:**
   ```bash
   npx prisma migrate dev --create-only --name add_oauth_and_mfa
   ```
   This creates a migration file without applying it.

2. **Get the SQL:**
   - Check `prisma/migrations/[timestamp]_add_oauth_and_mfa/migration.sql`

3. **Run in Supabase:**
   - Go to Supabase Dashboard → SQL Editor
   - Paste and run the SQL

### Option 3: Add Postinstall Script (Not Recommended for Production)

You could add a postinstall script, but this runs on every build and can cause issues:

```json
"scripts": {
  "postinstall": "prisma generate && prisma db push"
}
```

**Why not recommended:**
- Runs on every build (slow)
- Can fail if database is locked
- No migration history

## Step-by-Step: First Time Setup

### 1. Get Your Database URLs

From Supabase Dashboard → Settings → Database:

- **Connection Pooling URL** (for app): Port 6543
  ```
  postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

- **Direct Connection URL** (for migrations): Port 5432
  ```
  postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
  ```

### 2. Set Environment Variables Locally

Create/update `.env.local`:
```env
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
```

### 3. Run Migration Locally

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push
```

### 4. Set Environment Variables in Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add:
- `DATABASE_URL` (Connection Pooling URL)
- `DIRECT_URL` (Direct Connection URL - optional, only if you want to run migrations from Vercel)

### 5. Deploy to Vercel

```bash
git add .
git commit -m "Add OAuth and MFA schema"
git push
```

Vercel will automatically:
1. Install dependencies
2. Run `prisma generate` (from build script)
3. Build Next.js app
4. Deploy

## Verify Migration Success

### Check in Supabase

1. Go to Supabase Dashboard → Table Editor
2. You should see:
   - `profiles` table (with new columns)
   - `oauth_accounts` table
   - `seller_info` table
   - `admin_info` table

### Check via Prisma Studio

```bash
npm run prisma:studio
```

Opens a visual database browser at `http://localhost:5555`

## Troubleshooting

### Error: "Migration failed"

**Solution:** Make sure `DIRECT_URL` is set (not the pooling URL) for migrations.

### Error: "Table already exists"

**Solution:** The table might already exist. You can:
1. Drop and recreate (development only)
2. Use `prisma migrate resolve` to mark as applied
3. Manually check what's different

### Error: "Can't reach database"

**Solution:** 
- Check your `DATABASE_URL` and `DIRECT_URL`
- Make sure Supabase project is active
- Check network/firewall settings

## Best Practices

1. **Always backup before migration** (Supabase has automatic backups)
2. **Test migrations locally first**
3. **Use `prisma migrate` for production** (not `db push`)
4. **Review migration SQL** before applying
5. **Run migrations during maintenance window** (if possible)

## Quick Reference

```bash
# Generate Prisma Client (always needed)
npm run prisma:generate

# Push schema (development)
npm run prisma:push

# Create migration (production)
npm run prisma:migrate

# View database
npm run prisma:studio
```

## Summary

**For Vercel:**
1. ✅ Run migration **locally** before deploying
2. ✅ Set `DATABASE_URL` in Vercel environment variables
3. ✅ Vercel will auto-generate Prisma Client during build
4. ✅ No need to run migrations during Vercel build

**The migration updates your database structure to match your new Prisma schema!**

