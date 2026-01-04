# Vercel Deployment Guide

## Automated Migrations (Fresh Database)

Since you're starting fresh with no existing data, migrations are **automated during Vercel build**.

## How It Works

Your build script automatically:
1. Generates Prisma Client
2. Pushes schema to database (creates/updates tables)
3. Builds your Next.js app

```json
"build": "prisma generate && prisma db push --skip-generate && next build"
```

## Deployment Steps

### 1. Set Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required for Build:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Required for Runtime (add after first deployment):**
- `DATABASE_URL` - Your Supabase connection pooling URL
  ```
  postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
  Get this from: Supabase Dashboard > Settings > Database > Connection Pooling

**Optional (for migrations):**
- `DIRECT_URL` - Your Supabase direct connection URL (port 5432)
  ```
  postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
  ```

**Note:** If `DIRECT_URL` is not set, Prisma will use `DATABASE_URL` for migrations.

### 2. Deploy (First Time)

```bash
git add .
git commit -m "Initial deployment"
git push
```

Vercel will automatically:
- ✅ Install dependencies
- ✅ Generate Prisma Client (uses dummy DATABASE_URL for build)
- ✅ Build Next.js app
- ✅ Deploy

**Note:** The build will succeed, but the app won't work until you add `DATABASE_URL`.

### 3. Add DATABASE_URL After First Deployment

1. **Get DATABASE_URL** from Supabase:
   - Go to Supabase Dashboard > Settings > Database
   - Copy the **Connection Pooling** URL (port 6543)

2. **Add to Vercel**:
   - Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add `DATABASE_URL` with the connection string
   - Save

3. **Redeploy** (or it will work on next request):
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or just wait - it will work on the next API request

Now your app will work! The database tables will be created automatically on first use.

## What Gets Created

The migration will create these tables in your Supabase database:

1. **`profiles`** - User profiles with MFA support
2. **`oauth_accounts`** - OAuth provider data
3. **`seller_info`** - Seller-specific information
4. **`admin_info`** - Admin-specific information
5. **`templates`** - Template marketplace items
6. **`template_versions`** - Template version control
7. **`interactions`** - User interactions (views, downloads, likes)

## Verify Deployment

After deployment:

1. **Check Supabase Tables:**
   - Go to Supabase Dashboard → Table Editor
   - You should see all the tables listed above

2. **Test Authentication:**
   - Visit your deployed site
   - Try signing in with OAuth (Google, GitHub, etc.)
   - Check if profile is created in `profiles` table

## Troubleshooting

### Build fails with "Can't reach database"

**Solution:**
- Check `DATABASE_URL` is set correctly in Vercel
- Make sure Supabase project is active
- Verify connection string format

### Build fails with "Migration failed"

**Solution:**
- Set `DIRECT_URL` in Vercel (use port 5432, not 6543)
- Check Supabase database is accessible
- Review build logs in Vercel for specific error

### Tables not created

**Solution:**
- Check Vercel build logs for Prisma errors
- Verify `DATABASE_URL` has correct permissions
- Try running `prisma db push` locally to test connection

## Future Updates

When you update the schema later:

1. **Update Prisma schema** (`prisma/schema.prisma`)
2. **Push to GitHub**
3. **Vercel automatically:**
   - Generates Prisma Client
   - Pushes schema changes
   - Deploys updated app

**Note:** For production with existing data, consider using `prisma migrate` instead of `db push` for better control.

## Summary

✅ **Migrations are automated** - No manual steps needed  
✅ **Runs during Vercel build** - Just push to GitHub  
✅ **Safe for fresh database** - No data to lose  
✅ **All tables created automatically** - Ready to use

Just set `DATABASE_URL` in Vercel and deploy! 🚀
