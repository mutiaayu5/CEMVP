# Supabase Environment Variables Setup

## Required Variables

You need to add the following environment variables to your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## How to Get These Values

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. You'll find:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Why These Are Needed

Even though we're using Prisma for database access, these variables are needed for:

1. **Row Level Security (RLS) Policies**: If RLS is enabled on your tables, Supabase needs these credentials to properly authenticate requests
2. **Future Supabase Features**: If you want to use Supabase's client library, auth, storage, or other features
3. **Client-Side Operations**: If you need to make client-side database queries (though we're currently using server-side only)

## Current Setup

- **DATABASE_URL**: Used by Prisma for direct database connection (already configured)
- **NEXT_PUBLIC_SUPABASE_URL**: Supabase project URL (needs to be added)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase anonymous/public key (needs to be added)

## Adding to .env File

1. Open your `.env` file in the project root
2. Add these two lines:
   ```
   NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-actual-anon-key-here"
   ```
3. Replace the placeholder values with your actual Supabase credentials
4. Save the file
5. Restart your development server (`npm run dev`)

## Verification

After adding the variables, you can verify they're loaded by checking:
- The variables should be available in your Next.js app
- RLS policies should work correctly if enabled
- No authentication errors when accessing the database

## Security Note

- The `NEXT_PUBLIC_` prefix means these variables are exposed to the browser
- This is safe for the anon key as it's designed for public use
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`

