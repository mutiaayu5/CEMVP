-- Supabase RLS Policies Setup
-- Run these commands in your Supabase SQL Editor

-- Enable Row Level Security on tables
ALTER TABLE waitlist_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for waitlist_emails table
-- Allow public to read (for count endpoint)
CREATE POLICY "Allow public read on waitlist_emails"
ON waitlist_emails
FOR SELECT
USING (true);

-- Allow public to insert (for signup)
CREATE POLICY "Allow public insert on waitlist_emails"
ON waitlist_emails
FOR INSERT
WITH CHECK (true);

-- Policies for blog_posts table
-- Allow public to read published posts
CREATE POLICY "Allow public read on blog_posts"
ON blog_posts
FOR SELECT
USING (published_at IS NOT NULL);

-- Optional: Allow authenticated users to manage blog posts
-- Uncomment if you want to add admin functionality later
-- CREATE POLICY "Allow authenticated insert on blog_posts"
-- ON blog_posts
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (true);

-- CREATE POLICY "Allow authenticated update on blog_posts"
-- ON blog_posts
-- FOR UPDATE
-- TO authenticated
-- USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "Allow authenticated delete on blog_posts"
-- ON blog_posts
-- FOR DELETE
-- TO authenticated
-- USING (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('waitlist_emails', 'blog_posts');

