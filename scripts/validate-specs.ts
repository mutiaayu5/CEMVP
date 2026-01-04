#!/usr/bin/env tsx
/**
 * Spec Validation Tool
 * Validates that implementation matches specifications
 */

import fs from 'fs/promises'
import path from 'path'
import { SpecParser, type ApiEndpoint, type DataModel } from './spec-parser'

interface ValidationResult {
  passed: boolean
  message: string
  details?: string[]
}

export class SpecValidator {
  private apiDir: string
  private schemasDir: string
  private typesDir: string

  constructor(
    apiDir: string = './app/api',
    schemasDir: string = './lib/schemas',
    typesDir: string = './lib/types'
  ) {
    this.apiDir = apiDir
    this.schemasDir = schemasDir
    this.typesDir = typesDir
  }

  /**
   * Validate API routes match specs
   */
  async validateApiRoutes(endpoints: ApiEndpoint[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    for (const endpoint of endpoints) {
      const routePath = this.endpointToRoutePath(endpoint.path)
      const routeFile = path.join(this.apiDir, routePath, 'route.ts')

      try {
        const exists = await fs.access(routeFile).then(() => true).catch(() => false)
        
        if (!exists) {
          results.push({
            passed: false,
            message: `Route not found: ${endpoint.method} ${endpoint.path}`,
            details: [`Expected: ${routeFile}`],
          })
          continue
        }

        const content = await fs.readFile(routeFile, 'utf-8')
        
        // Check if route handles the correct method
        const methodHandled = content.includes(`export async function ${endpoint.method.toLowerCase()}`) ||
                             content.includes(`case '${endpoint.method}'`)
        
        if (!methodHandled) {
          results.push({
            passed: false,
            message: `Route does not handle ${endpoint.method} method: ${endpoint.path}`,
            details: [`File: ${routeFile}`],
          })
          continue
        }

        // Check if authentication is implemented (if required)
        if (endpoint.auth.toLowerCase().includes('required')) {
          const hasAuth = content.includes('getUser()') || 
                         content.includes('auth.getUser') ||
                         content.includes('createClient()')
          
          if (!hasAuth) {
            results.push({
              passed: false,
              message: `Route missing authentication: ${endpoint.method} ${endpoint.path}`,
              details: [`File: ${routeFile}`],
            })
            continue
          }
        }

        results.push({
          passed: true,
          message: `Route validated: ${endpoint.method} ${endpoint.path}`,
        })
      } catch (error) {
        results.push({
          passed: false,
          message: `Error validating route: ${endpoint.method} ${endpoint.path}`,
          details: [`Error: ${error instanceof Error ? error.message : String(error)}`],
        })
      }
    }

    return results
  }

  /**
   * Validate Zod schemas match data specs
   */
  async validateSchemas(models: DataModel[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    for (const model of models) {
      const schemaFile = path.join(this.schemasDir, `${model.name.toLowerCase()}.ts`)

      try {
        const exists = await fs.access(schemaFile).then(() => true).catch(() => false)
        
        if (!exists) {
          results.push({
            passed: false,
            message: `Schema not found: ${model.name}`,
            details: [`Expected: ${schemaFile}`],
          })
          continue
        }

        const content = await fs.readFile(schemaFile, 'utf-8')
        
        // Check if schema includes all required fields
        const missingFields: string[] = []
        for (const field of model.fields) {
          if (field.required && !content.includes(`"${field.name}"`)) {
            missingFields.push(field.name)
          }
        }

        if (missingFields.length > 0) {
          results.push({
            passed: false,
            message: `Schema missing fields: ${model.name}`,
            details: [`Missing: ${missingFields.join(', ')}`],
          })
          continue
        }

        results.push({
          passed: true,
          message: `Schema validated: ${model.name}`,
        })
      } catch (error) {
        results.push({
          passed: false,
          message: `Error validating schema: ${model.name}`,
          details: [`Error: ${error instanceof Error ? error.message : String(error)}`],
        })
      }
    }

    return results
  }

  /**
   * Validate TypeScript types match specs
   */
  async validateTypes(models: DataModel[], endpoints: ApiEndpoint[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    // Check data types
    const dataTypesFile = path.join(this.typesDir, 'data.ts')
    try {
      const exists = await fs.access(dataTypesFile).then(() => true).catch(() => false)
      
      if (!exists) {
        results.push({
          passed: false,
          message: 'Data types file not found',
          details: [`Expected: ${dataTypesFile}`],
        })
      } else {
        const content = await fs.readFile(dataTypesFile, 'utf-8')
        
        for (const model of models) {
          if (!content.includes(`interface ${model.name}`)) {
            results.push({
              passed: false,
              message: `Type not found: ${model.name}`,
            })
          } else {
            results.push({
              passed: true,
              message: `Type validated: ${model.name}`,
            })
          }
        }
      }
    } catch (error) {
      results.push({
        passed: false,
        message: 'Error validating data types',
        details: [`Error: ${error instanceof Error ? error.message : String(error)}`],
      })
    }

    // Check API types
    const apiTypesFile = path.join(this.typesDir, 'api.ts')
    try {
      const exists = await fs.access(apiTypesFile).then(() => true).catch(() => false)
      
      if (!exists) {
        results.push({
          passed: false,
          message: 'API types file not found',
          details: [`Expected: ${apiTypesFile}`],
        })
      } else {
        results.push({
          passed: true,
          message: 'API types file exists',
        })
      }
    } catch (error) {
      results.push({
        passed: false,
        message: 'Error validating API types',
        details: [`Error: ${error instanceof Error ? error.message : String(error)}`],
      })
    }

    return results
  }

  /**
   * Convert endpoint path to route file path
   */
  private endpointToRoutePath(endpointPath: string): string {
    // Remove /api prefix
    let routePath = endpointPath.replace(/^\/api/, '')
    
    // Handle dynamic routes [id] -> [id]
    routePath = routePath.replace(/\[(\w+)\]/g, '[$1]')
    
    // Remove leading slash
    routePath = routePath.replace(/^\//, '')
    
    // Remove trailing segment if it's just the method (for grouped routes)
    const parts = routePath.split('/')
    if (parts.length > 1) {
      routePath = parts.slice(0, -1).join('/')
    }
    
    return routePath || endpointPath.split('/').filter(Boolean).join('/')
  }

  /**
   * Run all validations
   */
  async validateAll(): Promise<void> {
    const parser = new SpecParser()
    const { api, data } = await parser.parseAllSpecs()

    console.log('🔍 Validating specifications...\n')

    // Validate API routes
    console.log('📡 Validating API routes...')
    const apiResults = await this.validateApiRoutes(api)
    this.printResults(apiResults)

    // Validate schemas
    console.log('\n📋 Validating Zod schemas...')
    const schemaResults = await this.validateSchemas(data)
    this.printResults(schemaResults)

    // Validate types
    console.log('\n📝 Validating TypeScript types...')
    const typeResults = await this.validateTypes(data, api)
    this.printResults(typeResults)

    // Summary
    const allResults = [...apiResults, ...schemaResults, ...typeResults]
    const passed = allResults.filter(r => r.passed).length
    const failed = allResults.filter(r => !r.passed).length

    console.log('\n' + '='.repeat(50))
    console.log(`Summary: ${passed} passed, ${failed} failed`)
    console.log('='.repeat(50))

    if (failed > 0) {
      process.exit(1)
    }
  }

  /**
   * Print validation results
   */
  private printResults(results: ValidationResult[]): void {
    for (const result of results) {
      const icon = result.passed ? '✅' : '❌'
      console.log(`${icon} ${result.message}`)
      
      if (result.details) {
        for (const detail of result.details) {
          console.log(`   ${detail}`)
        }
      }
    }
  }
}

// CLI usage
if (require.main === module) {
  const validator = new SpecValidator()
  validator.validateAll().catch(console.error)
}

