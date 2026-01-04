#!/usr/bin/env tsx
/**
 * Generate All Script
 * Runs all code generators from specifications
 */

import { ZodGenerator } from './zod-generator'
import { TypeScriptGenerator } from './typescript-generator'
import { ApiGenerator } from './api-generator'

async function generateAll() {
  console.log('🚀 Generating code from specifications...\n')

  try {
    // Generate Zod schemas
    console.log('📋 Generating Zod schemas...')
    const zodGenerator = new ZodGenerator()
    await zodGenerator.generateAll()
    console.log('✅ Zod schemas generated\n')

    // Generate TypeScript types
    console.log('📝 Generating TypeScript types...')
    const tsGenerator = new TypeScriptGenerator()
    await tsGenerator.generateAll()
    console.log('✅ TypeScript types generated\n')

    // Generate API routes
    console.log('📡 Generating API routes...')
    const apiGenerator = new ApiGenerator()
    await apiGenerator.generateAll()
    console.log('✅ API routes generated\n')

    console.log('✨ All code generated successfully!')
  } catch (error) {
    console.error('❌ Error generating code:', error)
    process.exit(1)
  }
}

generateAll()

