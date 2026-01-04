#!/usr/bin/env tsx
/**
 * API Route Generator
 * Generates Next.js API route stubs from API specifications
 */

import fs from 'fs/promises'
import path from 'path'
import { SpecParser, type ApiEndpoint } from './spec-parser'

export class ApiGenerator {
  private outputDir: string

  constructor(outputDir: string = './app/api') {
    this.outputDir = outputDir
  }

  /**
   * Generate API route handler from endpoint spec
   */
  generateRouteHandler(endpoint: ApiEndpoint): string {
    const lines: string[] = []
    
    lines.push(`import { NextRequest, NextResponse } from 'next/server'`)
    lines.push(`import { createClient } from '@/lib/supabase/server'`)
    lines.push('')
    
    // Import Zod schema if available
    const resourceName = this.getResourceName(endpoint.path)
    lines.push(`// TODO: Import validation schema`)
    lines.push(`// import { ${resourceName}Schema } from '@/lib/schemas'`)
    lines.push('')
    
    lines.push('/**')
    lines.push(` * ${endpoint.method} ${endpoint.path}`)
    lines.push(` * ${endpoint.description}`)
    lines.push(` *`)
    lines.push(` * Authentication: ${endpoint.auth}`)
    lines.push(` * Generated from spec: docs/api-specs/`)
    lines.push(` */`)
    lines.push('')
    
    const handlerName = endpoint.method.toLowerCase()
    lines.push(`export async function ${handlerName}(`)
    
    // Add parameters
    const hasParams = endpoint.path.includes('[')
    if (hasParams) {
      lines.push(`  request: NextRequest,`)
      lines.push(`  { params }: { params: Promise<{ id: string }> }`)
    } else {
      lines.push(`  request: NextRequest`)
    }
    
    lines.push(`) {`)
    lines.push(`  try {`)
    lines.push('')
    
    // Authentication check
    if (endpoint.auth.toLowerCase().includes('required')) {
      lines.push(`    // Check authentication`)
      lines.push(`    const supabase = await createClient()`)
      lines.push(`    const {`)
      lines.push(`      data: { user },`)
      lines.push(`      error: authError`)
      lines.push(`    } = await supabase.auth.getUser()`)
      lines.push('')
      lines.push(`    if (authError || !user) {`)
      lines.push(`      return NextResponse.json(`)
      lines.push(`        { error: 'Unauthorized' },`)
      lines.push(`        { status: 401 }`)
      lines.push(`      )`)
      lines.push(`    }`)
      lines.push('')
    }
    
    // Parse request body for POST/PATCH
    if (['POST', 'PATCH'].includes(endpoint.method)) {
      lines.push(`    // Parse and validate request body`)
      lines.push(`    const body = await request.json()`)
      lines.push(`    // TODO: Validate with Zod schema`)
      lines.push(`    // const validated = ${resourceName}Schema.parse(body)`)
      lines.push('')
    }
    
    // Parse query parameters for GET
    if (endpoint.method === 'GET') {
      lines.push(`    // Parse query parameters`)
      lines.push(`    const { searchParams } = new URL(request.url)`)
      lines.push(`    // TODO: Validate query params`)
      lines.push('')
    }
    
    // Extract path parameters
    if (hasParams) {
      lines.push(`    // Extract path parameters`)
      lines.push(`    const { id } = await params`)
      lines.push('')
    }
    
    lines.push(`    // TODO: Implement business logic`)
    lines.push(`    // Example:`)
    lines.push(`    // const result = await prisma.template.findMany({ ... })`)
    lines.push('')
    
    // Generate response
    const successStatus = endpoint.method === 'POST' ? 201 : 
                         endpoint.method === 'DELETE' ? 204 : 200
    const hasSuccessResponse = endpoint.responses[successStatus] || endpoint.responses[200]
    
    if (hasSuccessResponse && successStatus !== 204) {
      lines.push(`    return NextResponse.json(`)
      lines.push(`      {`)
      lines.push(`        // TODO: Return actual data`)
      lines.push(`        message: 'Not implemented'`)
      lines.push(`      },`)
      lines.push(`      { status: ${successStatus} }`)
      lines.push(`    )`)
    } else if (successStatus === 204) {
      lines.push(`    return new NextResponse(null, { status: 204 })`)
    } else {
      lines.push(`    return NextResponse.json(`)
      lines.push(`      { message: 'Not implemented' },`)
      lines.push(`      { status: ${successStatus} }`)
      lines.push(`    )`)
    }
    
    lines.push(`  } catch (error) {`)
    lines.push(`    console.error('Error:', error)`)
    lines.push(`    return NextResponse.json(`)
    lines.push(`      { error: 'Internal server error' },`)
    lines.push(`      { status: 500 }`)
    lines.push(`    )`)
    lines.push(`  }`)
    lines.push(`}`)
    
    return lines.join('\n')
  }

  /**
   * Get resource name from path
   */
  private getResourceName(path: string): string {
    const parts = path.split('/').filter(Boolean)
    const resource = parts[parts.length - 1] || parts[parts.length - 2]
    return resource.charAt(0).toUpperCase() + resource.slice(1).replace(/s$/, '')
  }

  /**
   * Convert endpoint path to file path
   */
  private pathToFilePath(endpointPath: string): string {
    // Remove /api prefix
    let filePath = endpointPath.replace(/^\/api/, '')
    
    // Handle dynamic routes [id] -> [id]
    filePath = filePath.replace(/\[(\w+)\]/g, '[$1]')
    
    // Remove leading slash
    filePath = filePath.replace(/^\//, '')
    
    return filePath
  }

  /**
   * Generate all API routes
   */
  async generateAll(): Promise<void> {
    const parser = new SpecParser()
    const { api } = await parser.parseAllSpecs()

    // Group endpoints by path
    const routeGroups = new Map<string, ApiEndpoint[]>()
    for (const endpoint of api) {
      const basePath = this.pathToFilePath(endpoint.path)
      const routeKey = basePath.split('/').slice(0, -1).join('/') || basePath
      
      if (!routeGroups.has(routeKey)) {
        routeGroups.set(routeKey, [])
      }
      routeGroups.get(routeKey)!.push(endpoint)
    }

    // Generate route handlers
    for (const [routePath, endpoints] of routeGroups.entries()) {
      const fullPath = path.join(this.outputDir, routePath)
      await fs.mkdir(fullPath, { recursive: true })

      // Generate route.ts file with all methods
      const methods = endpoints.map(e => e.method)
      const handlers: string[] = []

      for (const endpoint of endpoints) {
        handlers.push(this.generateRouteHandler(endpoint))
      }

      // Combine handlers into route.ts
      const routeFile = path.join(fullPath, 'route.ts')
      
      // Check if file exists and has custom implementation
      let existingContent = ''
      try {
        existingContent = await fs.readFile(routeFile, 'utf-8')
        // If file exists and doesn't contain "Generated from spec", skip
        if (!existingContent.includes('Generated from spec')) {
          console.log(`Skipping ${routeFile} (has custom implementation)`)
          continue
        }
      } catch {
        // File doesn't exist, create it
      }

      const routeContent = handlers.join('\n\n')
      await fs.writeFile(routeFile, routeContent, 'utf-8')
      console.log(`Generated: ${routeFile}`)
    }
  }
}

// CLI usage
if (require.main === module) {
  const generator = new ApiGenerator()
  generator.generateAll().catch(console.error)
}

