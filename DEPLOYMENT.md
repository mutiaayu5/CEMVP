# Vercel Deployment Guide

This guide will help you deploy CEMVP to Vercel for testing.

## Pre-Deployment Checklist

- [ ] All code is committed to Git
- [ ] Supabase project is set up and active
- [ ] You have your Supabase credentials ready
- [ ] GitHub repository is created and pushed

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Initial setup for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository and click **"Import"**

### 3. Configure Project Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 4. Add Environment Variables

**CRITICAL**: Add these environment variables in Vercel:

1. Click **"Environment Variables"** section
2. Add each variable:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | From Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | From Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL | Will be `https://your-project.vercel.app` (set after first deploy) |
| `DATABASE_URL` | Supabase connection pooling URL | Optional - add when ready to use Prisma |
| `DIRECT_URL` | Supabase direct connection URL | Optional - add when ready to use Prisma |

**Important Notes:**
- Make sure to add these to **Production**, **Preview**, and **Development** environments
- `NEXT_PUBLIC_SITE_URL` can be updated after first deployment with your actual Vercel URL
- **You DON'T need .env.local for Vercel** - Vercel uses its own environment variables
- `.env.local` is ONLY for local development (it's in `.gitignore` and never deployed)
- Prisma reads from `process.env.DATABASE_URL` which Vercel provides automatically

### 5. Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (usually 1-2 minutes)
3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

### 6. Update Site URL (After First Deploy)

After first deployment:

1. Go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_SITE_URL` with your actual Vercel URL:
   ```
   https://your-project.vercel.app
   ```
3. Redeploy (or it will auto-redeploy on next push)

### 7. Configure Supabase Redirect URLs

In your Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Redirect URLs**:
   ```
   https://your-project.vercel.app/**
   ```
3. Add to **Site URL**:
   ```
   https://your-project.vercel.app
   ```

## Post-Deployment Testing

After deployment, test these features:

- [ ] Home page loads correctly
- [ ] Can navigate to sign up page
- [ ] Can create a new account
- [ ] Can sign in with created account
- [ ] Dashboard page loads (protected route)
- [ ] Can sign out successfully
- [ ] Supabase connection works

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Ensure all `NEXT_PUBLIC_*` variables are set in Vercel
- Check that variable names match exactly (case-sensitive)

**Error: TypeScript errors**
- Run `npm run build` locally first to catch errors
- Fix any TypeScript errors before pushing

**Error: Module not found**
- Ensure `package.json` has all dependencies
- Check that `node_modules` is not committed (should be in `.gitignore`)

### Runtime Errors

**Authentication not working**
- Verify Supabase URL and keys are correct
- Check Supabase redirect URLs are configured
- Ensure `NEXT_PUBLIC_SITE_URL` matches your Vercel URL

**Redirect loops**
- Check middleware configuration
- Verify `NEXT_PUBLIC_SITE_URL` is set correctly

### Environment Variables Not Loading

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Check Vercel logs for specific errors

## Vercel Configuration

The project includes `vercel.json` with recommended settings:
- Framework: Next.js
- Region: US East (iad1) - can be changed in Vercel dashboard

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## Monitoring

- Check **Deployments** tab for build logs
- Use **Functions** tab to monitor API routes
- Check **Analytics** for performance metrics

## Next Steps

After successful deployment:
1. Test all authentication flows
2. Verify Supabase connectivity
3. Test protected routes
4. Monitor error logs
5. Set up custom domain (optional)

