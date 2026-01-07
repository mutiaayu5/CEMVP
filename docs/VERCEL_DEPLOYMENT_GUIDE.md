# Vercel Deployment Guide for CEMVP

## ✅ Fixed Issues

### 1. TypeScript Type Error (RESOLVED)
**Issue:** `BlogSection.tsx` had a type mismatch where `category` was typed as `string` instead of `"News" | "Stories"`.

**Fix:** Added proper TypeScript interface with type casting for the imported JSON data.

### 2. Theme Consistency (RESOLVED)
**Issue:** Error and loading pages didn't match the application's amber/accent theme.

**Fix:** Updated `app/error.tsx` and `app/loading.tsx` to use the correct theme colors with dark mode support.

### 3. Prisma Client Generation (RESOLVED)
**Issue:** Vercel needs to generate Prisma Client during deployment.

**Fix:** Added `"postinstall": "prisma generate"` script to `package.json`.

## 🔧 Required Vercel Configuration

### Environment Variables
You **MUST** set the following environment variable in your Vercel project settings:

```
DATABASE_URL=postgresql://user:password@host:port/database?schema=public
```

**For Supabase:**
```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### Steps to Configure:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add `DATABASE_URL` with your database connection string
4. Make sure to add it for **Production**, **Preview**, and **Development** environments
5. Redeploy your application

## 📋 Pre-Deployment Checklist

- [x] TypeScript compilation passes
- [x] Build completes successfully
- [x] Prisma schema is valid
- [x] Prisma client generation is automated
- [x] All components use consistent theming
- [x] API routes are properly configured
- [x] Image domains are whitelisted in `next.config.js`
- [ ] Database is set up and accessible
- [ ] Environment variables are configured in Vercel
- [ ] Database migrations have been run

## 🗄️ Database Setup

Before deploying, ensure your database is set up:

### Option 1: Using Prisma Migrate (Recommended for new databases)
```bash
npx prisma migrate deploy
```

### Option 2: Using Prisma DB Push (For development/prototyping)
```bash
npx prisma db push
```

### Option 3: Using SQL directly
Run the migration files in `prisma/migrations/` in order.

## 🚀 Deployment Steps

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Fix: Resolve TypeScript errors and prepare for Vercel deployment"
   git push origin main
   ```

2. **Configure Vercel:**
   - Ensure `DATABASE_URL` environment variable is set
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Deploy:**
   - Vercel will automatically deploy when you push to your branch
   - Or manually trigger deployment from Vercel dashboard

## 🔍 Verification

After deployment, verify:
- [ ] Homepage loads correctly
- [ ] Dark mode toggle works
- [ ] Blog sections (Stories/News) display correctly
- [ ] Waitlist form accepts submissions
- [ ] API endpoints respond correctly:
  - `POST /api/waitlist` - Submit email
  - `GET /api/waitlist/count` - Get count

## 🐛 Troubleshooting

### Build Fails with Prisma Error
- Ensure `DATABASE_URL` is set in environment variables
- Check that database is accessible from Vercel's IP addresses
- Verify Prisma schema syntax is correct

### TypeScript Errors
- Run `npm run build` locally to catch errors before deploying
- Check that all imports are correct
- Ensure all types are properly defined

### API Routes Return 500
- Check Vercel Function Logs for detailed error messages
- Verify database connection string is correct
- Ensure database migrations have been run

### Images Not Loading
- Verify image domains are whitelisted in `next.config.js`
- Check that external image URLs are accessible

## 📝 Notes

- The application uses **Turbopack** for faster builds (Next.js 16.1.1)
- Database uses **PostgreSQL** with Prisma ORM
- Rate limiting is implemented per IP address (5 submissions/hour)
- All pages support dark mode
- Static pages are pre-rendered for optimal performance

## 🎉 Success!

Once deployed, your application will be live at your Vercel URL. Make sure to:
1. Test all functionality
2. Monitor the Vercel logs for any runtime errors
3. Set up custom domain if needed
4. Configure analytics if desired

---

**Last Updated:** January 7, 2026
**Build Status:** ✅ Passing
**TypeScript:** ✅ No Errors
**Linting:** ⚠️ ESLint 9 config needs migration (non-blocking)

