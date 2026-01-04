#!/usr/bin/env tsx
/**
 * Pre-build check script
 * Validates environment and provides helpful warnings
 */

const requiredForBuild = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
]

const requiredForRuntime = [
  'DATABASE_URL',
]

const optional = [
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'DIRECT_URL',
  'NEXT_PUBLIC_SITE_URL',
]

console.log('🔍 Checking environment variables...\n')

let hasWarnings = false

// Check required for build
for (const key of requiredForBuild) {
  if (!process.env[key]) {
    console.error(`❌ Missing required variable: ${key}`)
    process.exit(1)
  } else {
    console.log(`✅ ${key}`)
  }
}

// Check required for runtime (warn but don't fail)
for (const key of requiredForRuntime) {
  if (!process.env[key]) {
    console.warn(`⚠️  Missing runtime variable: ${key} (app won't work without this)`)
    hasWarnings = true
  } else {
    console.log(`✅ ${key}`)
  }
}

// Check optional
for (const key of optional) {
  if (!process.env[key]) {
    console.log(`ℹ️  Optional variable not set: ${key}`)
  } else {
    console.log(`✅ ${key}`)
  }
}

if (hasWarnings) {
  console.log('\n⚠️  Warning: Some runtime variables are missing. The build will succeed, but the app may not work correctly.')
}

console.log('\n✅ Build check passed!')

