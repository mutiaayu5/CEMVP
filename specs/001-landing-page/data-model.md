# Data Model: CreateConomy Landing Page

**Date**: 2026-01-06  
**Feature**: CreateConomy Landing Page  
**Plan**: [plan.md](./plan.md)

## Entities

### WaitlistEmail

**Purpose**: Represents a user who has joined the waitlist to be notified when the AI marketplace launches.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier for the waitlist entry
- `email` (String, Unique, Indexed): Email address of the user (must be unique, indexed for fast lookups)
- `created_at` (Timestamp, Indexed): Timestamp when the user joined the waitlist (indexed for time-based queries and rate limiting)

**Validation Rules**:
- Email must be valid format (validated with Zod schema)
- Email must be unique (database constraint)
- Email cannot be null or empty
- `created_at` is automatically set on insert

**Relationships**:
- None (standalone entity)

**State Transitions**:
- **Initial**: User submits email → Validation → Duplicate check → Insert
- **Final**: Email stored in database, user sees success message

**Use Cases**:
- Track waitlist signups for launch notifications
- Display live counter of total signups
- Rate limiting (count submissions per IP in last hour)
- Prevent duplicate email submissions

**Indexes**:
- Primary key on `id`
- Unique index on `email` (for duplicate prevention and fast lookups)
- Index on `created_at` (for rate limiting queries: `COUNT(created_at > NOW() - '1 hour')`)

### BlogPost

**Purpose**: Represents a blog post displayed on the landing page in the "Our Story" or "News" sections.

**Attributes**:
- `id` (UUID, Primary Key): Unique identifier for the blog post
- `title` (String): Title of the blog post
- `slug` (String, Unique): URL-friendly identifier (e.g., "welcome-to-createconomy")
- `excerpt` (String): Short preview text displayed in the grid
- `category` (Enum: "Our Story" | "News"): Category classification for filtering
- `published_at` (Timestamp, Nullable): Publication date (null if draft, used for sorting)

**Validation Rules**:
- Title cannot be null or empty
- Slug must be unique (database constraint)
- Slug must be URL-safe (lowercase, hyphens, alphanumeric)
- Category must be either "Our Story" or "News"
- Excerpt should be limited to reasonable length for grid display (e.g., 150 characters)

**Relationships**:
- None (standalone entity)

**State Transitions**:
- **Draft**: `published_at` is null, not displayed on landing page
- **Published**: `published_at` is set, displayed in appropriate category grid

**Use Cases**:
- Display blog posts in 3-column grid
- Filter by category ("Our Story" or "News")
- Sort by publication date (newest first)
- SEO-friendly URLs using slug

**Indexes**:
- Primary key on `id`
- Unique index on `slug` (for URL uniqueness and fast lookups)
- Index on `category` (for filtering queries)
- Index on `published_at` (for sorting and filtering published posts)

## Database Schema (Prisma)

```prisma
model WaitlistEmail {
  id        String   @id @default(uuid())
  email     String   @unique @db.VarChar(255)
  created_at DateTime @default(now()) @map("created_at")

  @@index([email])
  @@index([created_at])
  @@map("waitlist_emails")
}

model BlogPost {
  id          String    @id @default(uuid())
  title       String    @db.VarChar(255)
  slug        String    @unique @db.VarChar(255)
  excerpt     String    @db.Text
  category    String    @db.VarChar(50) // "Our Story" | "News"
  published_at DateTime? @map("published_at")

  @@index([category])
  @@index([published_at])
  @@map("blog_posts")
}
```

## Data Access Patterns

### WaitlistEmail

1. **Insert**: `INSERT INTO waitlist_emails (email) VALUES ($1)`
   - Used when user submits waitlist form
   - Validated with Zod before insert
   - Check for duplicates before insert

2. **Count**: `SELECT COUNT(*) FROM waitlist_emails`
   - Used for live counter display
   - Fast query with index on `created_at`

3. **Rate Limit Check**: `SELECT COUNT(*) FROM waitlist_emails WHERE created_at > NOW() - INTERVAL '1 hour' AND [IP-based filtering]`
   - Note: IP-based filtering requires additional table or session tracking
   - Alternative: Track IP in separate table or use request headers

4. **Duplicate Check**: `SELECT id FROM waitlist_emails WHERE email = $1`
   - Used before insert to prevent duplicates
   - Fast lookup with unique index on `email`

### BlogPost

1. **List by Category**: `SELECT * FROM blog_posts WHERE category = $1 AND published_at IS NOT NULL ORDER BY published_at DESC`
   - Used for "Our Story" and "News" category views
   - Indexed on `category` and `published_at` for performance

2. **Get by Slug**: `SELECT * FROM blog_posts WHERE slug = $1`
   - Used for individual blog post pages (future feature)
   - Fast lookup with unique index on `slug`

3. **List All Published**: `SELECT * FROM blog_posts WHERE published_at IS NOT NULL ORDER BY published_at DESC`
   - Used for main blog section
   - Indexed on `published_at` for sorting

## Constraints and Business Rules

1. **Email Uniqueness**: No duplicate emails in waitlist (enforced by database unique constraint)
2. **Rate Limiting**: Maximum 5 email submissions per hour per IP address (enforced in application logic)
3. **Blog Post Publishing**: Only posts with `published_at` set are displayed (draft posts are hidden)
4. **Category Validation**: Blog posts must have category "Our Story" or "News" (enforced by application logic, could be enum in database)

## Migration Strategy

1. Create `waitlist_emails` table with indexes
2. Create `blog_posts` table with indexes
3. Enable Supabase RLS policies on both tables
4. Set up indexes for performance (email, created_at, category, published_at)

