# How to Get DATABASE_URL from Supabase

## Yes, it's from Supabase!

`DATABASE_URL` is the **PostgreSQL connection string** from your Supabase project.

## Step-by-Step Guide

### 1. Go to Supabase Dashboard
- Visit [supabase.com](https://supabase.com)
- Sign in to your account
- Select your project

### 2. Navigate to Database Settings
- Click **Settings** (gear icon in left sidebar)
- Click **Database** in the settings menu

### 3. Find Connection Pooling URL
- Scroll down to **Connection Pooling** section
- Look for **Connection string** or **URI**
- Select **Transaction mode** (recommended for Prisma)
- Copy the connection string

It will look like this:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 4. Replace Placeholders
The connection string will have placeholders:
- `[PROJECT-REF]` - Your project reference ID
- `[YOUR-PASSWORD]` - Your database password
- `[REGION]` - Your database region (e.g., `us-east-1`)

**Important:** You need to replace `[YOUR-PASSWORD]` with your actual database password.

### 5. Get Your Database Password
If you don't know your password:
- Go to **Settings** → **Database**
- Scroll to **Database password**
- If you forgot it, click **Reset database password**
- Copy the new password

### 6. Final DATABASE_URL Format
Your final `DATABASE_URL` should look like:
```
postgresql://postgres.abcdefghijklmnop:MySecurePassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Quick Copy Method

1. Supabase Dashboard → Settings → Database
2. Scroll to **Connection Pooling**
3. Click **Transaction** mode
4. Copy the **Connection string**
5. Replace `[YOUR-PASSWORD]` with your actual password
6. That's your `DATABASE_URL`!

## Alternative: Direct Connection URL

If you need `DIRECT_URL` (for migrations):
- Same page, scroll to **Connection string** (not pooling)
- Use port **5432** (not 6543)
- Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## For Vercel

1. Copy your `DATABASE_URL` (Connection Pooling, port 6543)
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Add new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste your connection string
   - **Environment**: Production (and Preview if needed)
4. Save

## Security Note

- Never commit `DATABASE_URL` to Git
- Always use environment variables
- The password in the URL is sensitive - keep it secure

## Summary

✅ **Yes, it's from Supabase**  
✅ **Get it from**: Supabase Dashboard → Settings → Database → Connection Pooling  
✅ **Use**: Connection Pooling URL (port 6543)  
✅ **Replace**: `[YOUR-PASSWORD]` with your actual password

