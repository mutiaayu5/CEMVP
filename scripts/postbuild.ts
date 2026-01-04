#!/usr/bin/env tsx
/**
 * Post-build script to push schema to database
 * Runs after build if DATABASE_URL is available
 */

import { execSync } from 'child_process'

if (process.env.DATABASE_URL) {
  try {
    console.log('Pushing Prisma schema to database...')
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      stdio: 'inherit',
      env: process.env,
    })
    console.log('✅ Database schema updated')
  } catch (error) {
    console.warn('⚠️  Failed to push schema (this is okay if database is not accessible during build)')
    // Don't fail the build
  }
} else {
  console.log('⚠️  DATABASE_URL not set, skipping database push')
}

