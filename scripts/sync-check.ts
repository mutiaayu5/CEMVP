#!/usr/bin/env tsx
/**
 * Sync Check Tool
 * Detects drift between specifications and implementation
 */

import fs from 'fs/promises'
import path from 'path'
import { SpecParser, type ApiEndpoint, type DataModel } from './spec-parser'

interface DriftIssue {
  type: 'missing' | 'extra' | 'mismatch' | 'outdated'
  category: 'api' | 'schema' | 'type' | 'prisma'
  message: string
  details?: string[]
}

export class SyncChecker {
  private apiDir: string
  private schemasDir: string
  private typesDir: string
  private prismaSchemaPath: string

  constructor(
    apiDir: string = './app/api',
    schemasDir: string = './lib/schemas',
    typesDir: string = './lib/types',
    prismaSchemaPath: string = './prisma/schema.prisma'
  ) {
    this.apiDir = apiDir
    this.schemasDir = schemasDir
    this.typesDir = typesDir
    this.prismaSchemaPath = prismaSchemaPath
  }

  /**
   * Check for API route drift
   */
  async checkApiDrift(endpoints: ApiEndpoint[]): Promise<DriftIssue[]> {
    const issues: DriftIssue[] = []

    // Check for missing routes
    for (const endpoint of endpoints) {
      const routePath = this.endpointToRoutePath(endpoint.path)
      const routeFile = path.join(this.apiDir, routePath, 'route.ts')

      try {
        const exists = await fs.access(routeFile).then(() => true).catch(() => false)
        
        if (!exists) {
          issues.push({
            type: 'missing',
            category: 'api',
            message: `Missing route: ${endpoint.method} ${endpoint.path}`,
            details: [`Expected: ${routeFile}`],
          })
        } else {
          // Check if route is outdated (contains "Generated from spec" but spec changed)
          const content = await fs.readFile(routeFile, 'utf-8')
          const specHash = this.hashEndpoint(endpoint)
          
          if (content.includes('Generated from spec') && !content.includes(specHash)) {
            issues.push({
              type: 'outdated',
              category: 'api',
              message: `Route may be outdated: ${endpoint.method} ${endpoint.path}`,
              details: [`File: ${routeFile}`, 'Consider regenerating from spec'],
            })
          }
        }
      } catch (error) {
        // Ignore errors, route doesn't exist
      }
    }

    // Check for extra routes not in specs
    const specPaths = new Set(endpoints.map(e => this.endpointToRoutePath(e.path)))
    const routeDirs = await this.getRouteDirectories(this.apiDir)
    
    for (const routeDir of routeDirs) {
      const relativePath = path.relative(this.apiDir, routeDir)
      if (!specPaths.has(relativePath)) {
        issues.push({
          type: 'extra',
          category: 'api',
          message: `Route not in specs: ${relativePath}`,
          details: [`Directory: ${routeDir}`, 'Consider adding to specs or removing'],
        })
      }
    }

    return issues
  }

  /**
   * Check for schema drift
   */
  async checkSchemaDrift(models: DataModel[]): Promise<DriftIssue[]> {
    const issues: DriftIssue[] = []

    for (const model of models) {
      const schemaFile = path.join(this.schemasDir, `${model.name.toLowerCase()}.ts`)

      try {
        const exists = await fs.access(schemaFile).then(() => true).catch(() => false)
        
        if (!exists) {
          issues.push({
            type: 'missing',
            category: 'schema',
            message: `Missing schema: ${model.name}`,
            details: [`Expected: ${schemaFile}`, 'Run: npm run spec:generate'],
          })
        } else {
          const content = await fs.readFile(schemaFile, 'utf-8')
          
          // Check if schema is outdated
          if (content.includes('Generated from spec')) {
            // Simple check: count fields
            const specFieldCount = model.fields.length
            const schemaFieldMatches = content.match(/^\s+\w+:/gm)
            const schemaFieldCount = schemaFieldMatches ? schemaFieldMatches.length : 0
            
            if (schemaFieldCount !== specFieldCount) {
              issues.push({
                type: 'mismatch',
                category: 'schema',
                message: `Schema field count mismatch: ${model.name}`,
                details: [
                  `Spec: ${specFieldCount} fields`,
                  `Schema: ${schemaFieldCount} fields`,
                  'Run: npm run spec:generate',
                ],
              })
            }
          }
        }
      } catch (error) {
        // Ignore errors
      }
    }

    return issues
  }

  /**
   * Check for type drift
   */
  async checkTypeDrift(models: DataModel[]): Promise<DriftIssue[]> {
    const issues: DriftIssue[] = []

    const dataTypesFile = path.join(this.typesDir, 'data.ts')
    try {
      const exists = await fs.access(dataTypesFile).then(() => true).catch(() => false)
      
      if (!exists) {
        issues.push({
          type: 'missing',
          category: 'type',
          message: 'Data types file not found',
          details: [`Expected: ${dataTypesFile}`, 'Run: npm run spec:generate'],
        })
      } else {
        const content = await fs.readFile(dataTypesFile, 'utf-8')
        
        for (const model of models) {
          if (!content.includes(`interface ${model.name}`)) {
            issues.push({
              type: 'missing',
              category: 'type',
              message: `Missing type: ${model.name}`,
              details: ['Run: npm run spec:generate'],
            })
          }
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return issues
  }

  /**
   * Check Prisma schema drift
   */
  async checkPrismaDrift(models: DataModel[]): Promise<DriftIssue[]> {
    const issues: DriftIssue[] = []

    try {
      const prismaContent = await fs.readFile(this.prismaSchemaPath, 'utf-8')
      
      for (const model of models) {
        // Check if model exists in Prisma
        const modelRegex = new RegExp(`model\\s+${model.name}\\s*{`, 'i')
        if (!modelRegex.test(prismaContent)) {
          issues.push({
            type: 'missing',
            category: 'prisma',
            message: `Model not in Prisma schema: ${model.name}`,
            details: ['Update Prisma schema to match spec'],
          })
        } else {
          // Check field count (simple check)
          const modelBlockMatch = prismaContent.match(
            new RegExp(`model\\s+${model.name}\\s*{([^}]+)}`, 'is')
          )
          
          if (modelBlockMatch) {
            const modelBlock = modelBlockMatch[1]
            const fieldCount = (modelBlock.match(/^\s+\w+\s+\w+/gm) || []).length
            
            if (fieldCount !== model.fields.length) {
              issues.push({
                type: 'mismatch',
                category: 'prisma',
                message: `Field count mismatch in Prisma: ${model.name}`,
                details: [
                  `Spec: ${model.fields.length} fields`,
                  `Prisma: ${fieldCount} fields`,
                  'Run: npm run spec:sync',
                ],
              })
            }
          }
        }
      }
    } catch (error) {
      issues.push({
        type: 'missing',
        category: 'prisma',
        message: 'Error reading Prisma schema',
        details: [`Error: ${error instanceof Error ? error.message : String(error)}`],
      })
    }

    return issues
  }

  /**
   * Generate hash for endpoint (simple content hash)
   */
  private hashEndpoint(endpoint: ApiEndpoint): string {
    return `${endpoint.method}-${endpoint.path}-${endpoint.description}`
  }

  /**
   * Convert endpoint path to route file path
   */
  private endpointToRoutePath(endpointPath: string): string {
    let routePath = endpointPath.replace(/^\/api/, '')
    routePath = routePath.replace(/\[(\w+)\]/g, '[$1]')
    routePath = routePath.replace(/^\//, '')
    const parts = routePath.split('/')
    if (parts.length > 1) {
      routePath = parts.slice(0, -1).join('/')
    }
    return routePath || endpointPath.split('/').filter(Boolean).join('/')
  }

  /**
   * Get all route directories
   */
  private async getRouteDirectories(baseDir: string): Promise<string[]> {
    const dirs: string[] = []
    
    try {
      const entries = await fs.readdir(baseDir, { withFileTypes: true })
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const fullPath = path.join(baseDir, entry.name)
          dirs.push(fullPath)
          
          // Recursively get subdirectories
          const subDirs = await this.getRouteDirectories(fullPath)
          dirs.push(...subDirs)
        }
      }
    } catch {
      // Directory doesn't exist
    }
    
    return dirs
  }

  /**
   * Run sync check
   */
  async checkAll(): Promise<void> {
    const parser = new SpecParser()
    const { api, data } = await parser.parseAllSpecs()

    console.log('🔍 Checking for spec-code drift...\n')

    const allIssues: DriftIssue[] = []

    // Check API drift
    console.log('📡 Checking API routes...')
    const apiIssues = await this.checkApiDrift(api)
    allIssues.push(...apiIssues)

    // Check schema drift
    console.log('📋 Checking Zod schemas...')
    const schemaIssues = await this.checkSchemaDrift(data)
    allIssues.push(...schemaIssues)

    // Check type drift
    console.log('📝 Checking TypeScript types...')
    const typeIssues = await this.checkTypeDrift(data)
    allIssues.push(...typeIssues)

    // Check Prisma drift
    console.log('🗄️  Checking Prisma schema...')
    const prismaIssues = await this.checkPrismaDrift(data)
    allIssues.push(...prismaIssues)

    // Print results
    console.log('\n' + '='.repeat(50))
    
    if (allIssues.length === 0) {
      console.log('✅ No drift detected! Specs and code are in sync.')
    } else {
      console.log(`⚠️  Found ${allIssues.length} drift issue(s):\n`)
      
      const byCategory = new Map<string, DriftIssue[]>()
      for (const issue of allIssues) {
        if (!byCategory.has(issue.category)) {
          byCategory.set(issue.category, [])
        }
        byCategory.get(issue.category)!.push(issue)
      }

      for (const [category, issues] of byCategory.entries()) {
        console.log(`\n${category.toUpperCase()}:`)
        for (const issue of issues) {
          const icon = issue.type === 'missing' ? '❌' : 
                      issue.type === 'extra' ? '➕' :
                      issue.type === 'mismatch' ? '⚠️' : '🔄'
          console.log(`  ${icon} ${issue.message}`)
          if (issue.details) {
            for (const detail of issue.details) {
              console.log(`     ${detail}`)
            }
          }
        }
      }
    }

    console.log('\n' + '='.repeat(50))
  }
}

// CLI usage
if (require.main === module) {
  const checker = new SyncChecker()
  checker.checkAll().catch(console.error)
}

