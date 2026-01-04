# DATABASE_URL Setup Guide

## Quick Answer

**For Build**: Not required (build will succeed without it)  
**For Runtime**: Required (app won't work without it)

## What is DATABASE_URL?

`DATABASE_URL` is the connection string to your Supabase PostgreSQL database. Prisma uses it to:
- Query the database
- Create/update records
- Manage your data

## Where to Get It

1. Go to **Supabase Dashboard**
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection Pooling**
5. Copy the **Connection Pooling** URL (port 6543)

It looks like:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

## For Vercel Deployment

### Option 1: Add During First Deployment (Recommended)

1. **Deploy without DATABASE_URL** (build will succeed)
2. **After deployment**, go to Vercel Dashboard → Settings → Environment Variables
3. **Add** `DATABASE_URL` with the connection pooling URL
4. **Redeploy** (or it will work on next request)

### Option 2: Add Before Deployment

1. **Get DATABASE_URL** from Supabase (see above)
2. **Add to Vercel** before first deployment
3. **Deploy** - everything will work immediately

## Why Build Works Without It

The build process:
1. Uses a dummy `DATABASE_URL` just to generate Prisma Client types
2. Doesn't actually connect to the database
3. Succeeds even without a real connection

But at runtime, when your app tries to:
- Create user profiles
- Store OAuth data
- Query templates
- etc.

It **needs** the real `DATABASE_URL` to work.

## How to Add in Vercel

1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. **Key**: `DATABASE_URL`
6. **Value**: Your Supabase connection pooling URL
7. **Environment**: Production (and Preview if you want)
8. Click **Save**

## Verify It's Working

After adding `DATABASE_URL`:
1. Visit your deployed site
2. Try signing in
3. Check Supabase Dashboard → Table Editor
4. You should see data being created

## Summary

- ✅ **Build**: Works without `DATABASE_URL`
- ⚠️ **Runtime**: Needs `DATABASE_URL` to work
- 📍 **Get it from**: Supabase Dashboard > Settings > Database > Connection Pooling
- 🔧 **Add to**: Vercel Dashboard > Settings > Environment Variables

