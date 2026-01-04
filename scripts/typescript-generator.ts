#!/usr/bin/env tsx
/**
 * TypeScript Type Generator
 * Generates TypeScript types from API and data specifications
 */

import fs from 'fs/promises'
import path from 'path'
import { SpecParser, type ApiEndpoint, type DataModel } from './spec-parser'

export class TypeScriptGenerator {
  private outputDir: string

  constructor(outputDir: string = './lib/types') {
    this.outputDir = outputDir
  }

  /**
   * Generate TypeScript types from API endpoints
   */
  generateApiTypes(endpoints: ApiEndpoint[]): string {
    const lines: string[] = []
    
    lines.push('/**')
    lines.push(' * API Types')
    lines.push(' * Generated from API specifications')
    lines.push(' */')
    lines.push('')

    // Group by endpoint path
    const endpointGroups = new Map<string, ApiEndpoint[]>()
    for (const endpoint of endpoints) {
      const basePath = endpoint.path.split('/').slice(0, -1).join('/') || endpoint.path
      if (!endpointGroups.has(basePath)) {
        endpointGroups.set(basePath, [])
      }
      endpointGroups.get(basePath)!.push(endpoint)
    }

    // Generate request/response types for each endpoint
    for (const endpoint of endpoints) {
      const typePrefix = this.endpointToTypeName(endpoint)
      
      // Request type
      if (endpoint.requestBody) {
        lines.push(`export interface ${typePrefix}Request {`)
        lines.push(this.objectToTypeScript(endpoint.requestBody, 1))
        lines.push('}')
        lines.push('')
      }

      // Response types
      for (const [status, response] of Object.entries(endpoint.responses)) {
        const responseTypeName = `${typePrefix}Response${status}`
        if (typeof response === 'object' && response !== null) {
          lines.push(`export interface ${responseTypeName} {`)
          lines.push(this.objectToTypeScript(response, 1))
          lines.push('}')
          lines.push('')
        }
      }
    }

    return lines.join('\n')
  }

  /**
   * Generate TypeScript types from data models
   */
  generateDataTypes(models: DataModel[]): string {
    const lines: string[] = []
    
    lines.push('/**')
    lines.push(' * Data Model Types')
    lines.push(' * Generated from data specifications')
    lines.push(' * These types match the Prisma schema')
    lines.push(' */')
    lines.push('')

    for (const model of models) {
      lines.push(`export interface ${model.name} {`)
      
      for (const field of model.fields) {
        const tsType = this.fieldToTypeScript(field)
        const optional = field.required ? '' : '?'
        const comment = field.description ? ` // ${field.description}` : ''
        lines.push(`  ${field.name}${optional}: ${tsType};${comment}`)
      }

      lines.push('}')
      lines.push('')
    }

    return lines.join('\n')
  }

  /**
   * Convert endpoint to type name
   */
  private endpointToTypeName(endpoint: ApiEndpoint): string {
    const pathParts = endpoint.path
      .replace(/^\/api\//, '')
      .replace(/\[(\w+)\]/g, '$1')
      .split('/')
      .filter(Boolean)
    
    const method = endpoint.method.toLowerCase()
    const resource = pathParts.map(p => 
      p.charAt(0).toUpperCase() + p.slice(1)
    ).join('')

    return `${method}${resource}`
  }

  /**
   * Convert field definition to TypeScript type
   */
  private fieldToTypeScript(field: FieldDefinition): string {
    let tsType = this.typeToTypeScript(field.type)
    
    // Handle arrays
    if (field.type.includes('[]')) {
      tsType = `${tsType}[]`
    }

    // Handle nullable
    if (!field.required || field.default === 'null') {
      tsType = `${tsType} | null`
    }

    return tsType
  }

  /**
   * Convert type string to TypeScript type
   */
  private typeToTypeScript(type: string): string {
    // Remove array notation for base type
    const baseType = type.replace('[]', '').trim()

    // Handle enums
    if (type.includes('|')) {
      return type.split('|').map(t => t.trim()).join(' | ')
    }

    // Type mapping
    const typeMap: Record<string, string> = {
      'string': 'string',
      'text': 'string',
      'number': 'number',
      'integer': 'number',
      'boolean': 'boolean',
      'datetime': 'Date',
      'date': 'Date',
      'uuid': 'string',
      'decimal(10,2)': 'number',
      'decimal': 'number',
    }

    for (const [key, value] of Object.entries(typeMap)) {
      if (baseType.toLowerCase().includes(key)) {
        return value
      }
    }

    return 'string'
  }

  /**
   * Convert object to TypeScript interface
   */
  private objectToTypeScript(obj: any, indent: number = 0): string {
    const lines: string[] = []
    const indentStr = '  '.repeat(indent)

    if (typeof obj !== 'object' || obj === null) {
      return `${indentStr}${JSON.stringify(obj)}`
    }

    if (Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object') {
        return `${indentStr}Array<{\n${this.objectToTypeScript(obj[0], indent + 1)}\n${indentStr}}>`
      }
      return `${indentStr}${obj.map(item => JSON.stringify(item)).join(' | ')}[]`
    }

    for (const [key, value] of Object.entries(obj)) {
      let valueType: string
      
      if (typeof value === 'string') {
        valueType = value
      } else if (typeof value === 'number') {
        valueType = 'number'
      } else if (typeof value === 'boolean') {
        valueType = 'boolean'
      } else if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          valueType = `Array<{\n${this.objectToTypeScript(value[0], indent + 2)}\n${indentStr}  }>`
        } else {
          valueType = `${value.map(v => typeof v).join(' | ')}[]`
        }
      } else if (typeof value === 'object' && value !== null) {
        valueType = `{\n${this.objectToTypeScript(value, indent + 1)}\n${indentStr}}`
      } else {
        valueType = 'any'
      }

      lines.push(`${indentStr}${key}: ${valueType};`)
    }

    return lines.join('\n')
  }

  /**
   * Generate all TypeScript types
   */
  async generateAll(): Promise<void> {
    const parser = new SpecParser()
    const { api, data } = await parser.parseAllSpecs()

    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true })

    // Generate API types
    const apiTypes = this.generateApiTypes(api)
    await fs.writeFile(path.join(this.outputDir, 'api.ts'), apiTypes, 'utf-8')
    console.log(`Generated: ${path.join(this.outputDir, 'api.ts')}`)

    // Generate data types
    const dataTypes = this.generateDataTypes(data)
    await fs.writeFile(path.join(this.outputDir, 'data.ts'), dataTypes, 'utf-8')
    console.log(`Generated: ${path.join(this.outputDir, 'data.ts')}`)

    // Generate index file
    const indexContent = [
      "export * from './api'",
      "export * from './data'",
    ].join('\n')
    
    await fs.writeFile(path.join(this.outputDir, 'index.ts'), indexContent, 'utf-8')
    console.log(`Generated: ${path.join(this.outputDir, 'index.ts')}`)
  }
}

export interface FieldDefinition {
  name: string
  type: string
  required: boolean
  default?: any
  constraints?: string[]
  description?: string
}

// CLI usage
if (require.main === module) {
  const generator = new TypeScriptGenerator()
  generator.generateAll().catch(console.error)
}

