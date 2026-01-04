#!/usr/bin/env tsx
/**
 * Setup Prisma environment for build
 * Provides dummy DATABASE_URL if not set (for Prisma Client generation only)
 */

if (!process.env.DATABASE_URL) {
  // Use a dummy connection string for Prisma Client generation
  // This allows the build to succeed without a real database connection
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public'
  console.log('⚠️  DATABASE_URL not set, using dummy URL for Prisma Client generation')
  console.log('   Note: You\'ll need to set DATABASE_URL in Vercel for the app to work at runtime')
}

