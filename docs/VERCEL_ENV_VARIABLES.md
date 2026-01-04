# Vercel Environment Variables Checklist

Complete list of environment variables to add in Vercel Dashboard.

## How to Add in Vercel

1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New** for each variable
5. Select **Environment**: Production (and Preview if needed)
6. Click **Save**

---

## Required for Build (Must Have)

These are required for the build to succeed:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard → Settings → API → anon/public key |

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Required for Runtime (Add After First Deployment)

These are required for the app to work, but build will succeed without them:

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string (with password) | Supabase Dashboard → Settings → Database → Connection Pooling → Copy connection string (port 6543) |

**Format:**
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Steps:**
1. Supabase Dashboard → Settings → Database
2. Scroll to **Connection Pooling**
3. Select **Transaction** mode
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. Paste as `DATABASE_URL` in Vercel

**Note:** If you don't know your database password:
- Same page → Scroll to **Database password**
- Click **Reset database password** if needed
- Copy the password

---

## Optional but Recommended

These enable additional features:

| Variable | Description | Where to Get | Required For |
|----------|-------------|--------------|-------------|
| `RESEND_API_KEY` | Resend API key for sending emails | resend.com → API Keys | MFA PIN emails, admin setup emails |
| `RESEND_FROM_EMAIL` | Email address to send from | Your verified domain in Resend | Email sender address |
| `NEXT_PUBLIC_SITE_URL` | Your production site URL | Your Vercel deployment URL | Email links (password setup, etc.) |

**Example:**
```
RESEND_API_KEY=re_1234567890abcdefghijklmnop
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**Note:** Without these, MFA emails won't be sent, but the app will still work.

---

## Optional (Advanced)

These are optional and only needed for specific use cases:

| Variable | Description | Where to Get | When Needed |
|----------|-------------|--------------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin access) | Supabase Dashboard → Settings → API → service_role key | Server-side admin operations |
| `DIRECT_URL` | Direct database connection (port 5432) | Supabase Dashboard → Settings → Database → Connection string | Manual migrations (not needed for fresh DB) |

---

## Quick Setup Checklist

### For Initial Deployment (Build Only)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### After First Deployment (For App to Work)
- [ ] `DATABASE_URL` (get from Supabase Connection Pooling)

### For Full Features (Email Support)
- [ ] `RESEND_API_KEY` (sign up at resend.com)
- [ ] `RESEND_FROM_EMAIL` (verify domain in Resend)
- [ ] `NEXT_PUBLIC_SITE_URL` (your Vercel URL)

---

## Environment-Specific Settings

In Vercel, you can set different values for:
- **Production** - Your live site
- **Preview** - Preview deployments (branches, PRs)
- **Development** - Local development (use `.env.local`)

**Recommendation:**
- Set all variables for **Production**
- Set `NEXT_PUBLIC_SITE_URL` differently for Preview if needed
- Use `.env.local` for local development

---

## Example: Complete Setup

Here's what a complete setup looks like:

```
# Required for Build
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Required for Runtime
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:MyPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Optional but Recommended
RESEND_API_KEY=re_1234567890abcdefghijklmnop
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

---

## Security Notes

- Never commit environment variables to Git
- Vercel encrypts environment variables
- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for public keys)
- `DATABASE_URL` and `RESEND_API_KEY` are server-only (secure)

---

## Troubleshooting

### Build Fails
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify values are correct (no extra spaces)

### App Doesn't Work After Deployment
- Add `DATABASE_URL` (required for database operations)
- Check `DATABASE_URL` format is correct
- Verify database password is correct

### Emails Not Sending
- Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
- Verify domain in Resend dashboard
- Check `NEXT_PUBLIC_SITE_URL` is set correctly

---

## Summary

**Minimum for Build:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Minimum for App to Work:**
- Above +
- `DATABASE_URL`

**Full Features:**
- Above +
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_SITE_URL`

