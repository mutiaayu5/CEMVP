#!/usr/bin/env tsx
/**
 * Zod Schema Generator
 * Generates Zod validation schemas from data specifications
 */

import fs from 'fs/promises'
import path from 'path'
import { SpecParser, type DataModel } from './spec-parser'

interface FieldDefinition {
  name: string
  type: string
  required: boolean
  default?: any
  constraints?: string[]
  description?: string
}

export { SpecParser, type DataModel }

export class ZodGenerator {
  private outputDir: string

  constructor(outputDir: string = './lib/schemas') {
    this.outputDir = outputDir
  }

  /**
   * Generate Zod schema from data model
   */
  generateZodSchema(model: DataModel): string {
    const lines: string[] = []
    
    lines.push(`import { z } from 'zod'`)
    lines.push('')
    lines.push(`/**`)
    lines.push(` * ${model.name} Schema`)
    if (model.description) {
      lines.push(` * ${model.description}`)
    }
    lines.push(` * Generated from spec: ${model.table}`)
    lines.push(` */`)
    lines.push('')
    
    const schemaName = `${model.name.toLowerCase()}Schema`
    lines.push(`export const ${schemaName} = z.object({`)

    for (const field of model.fields) {
      const zodField = this.fieldToZod(field)
      const comment = field.description ? ` // ${field.description}` : ''
      lines.push(`  ${field.name}: ${zodField},${comment}`)
    }

    lines.push('})')
    lines.push('')
    
    // Generate TypeScript type
    lines.push(`export type ${model.name} = z.infer<typeof ${schemaName}>`)
    lines.push('')

    return lines.join('\n')
  }

  /**
   * Convert field definition to Zod schema string
   */
  private fieldToZod(field: FieldDefinition): string {
    let zodType = this.typeToZod(field.type)
    
    // Apply constraints
    if (field.constraints) {
      for (const constraint of field.constraints) {
        zodType = this.applyConstraint(zodType, constraint, field)
      }
    }

    // Handle required/optional
    if (!field.required) {
      zodType = `${zodType}.optional()`
    }

    // Handle default
    if (field.default !== undefined) {
      if (field.default === 'uuid()' || field.default === 'now()') {
        // Skip defaults that are handled by database
      } else if (field.default === 'auto') {
        // Skip auto-updated fields
      } else if (typeof field.default === 'string') {
        if (field.default.startsWith('"') || field.default.startsWith("'")) {
          zodType = `${zodType}.default(${field.default})`
        } else if (field.default === 'null') {
          zodType = `${zodType}.nullable()`
        } else {
          zodType = `${zodType}.default("${field.default}")`
        }
      } else if (typeof field.default === 'number') {
        zodType = `${zodType}.default(${field.default})`
      } else if (field.default === '[]') {
        zodType = `${zodType}.default([])`
      }
    }

    return zodType
  }

  /**
   * Convert Prisma/TypeScript type to Zod type
   */
  private typeToZod(type: string): string {
    // Handle arrays
    if (type.includes('[]')) {
      const innerType = type.replace('[]', '').trim()
      return `z.array(${this.typeToZod(innerType)})`
    }

    // Handle enums
    if (type.includes('|')) {
      const options = type.split('|').map(o => o.trim().replace(/"/g, ''))
      return `z.enum([${options.map(o => `"${o}"`).join(', ')}])`
    }

    // Handle specific types
    const typeMap: Record<string, string> = {
      'string': 'z.string()',
      'text': 'z.string()',
      'number': 'z.number()',
      'integer': 'z.number().int()',
      'boolean': 'z.boolean()',
      'datetime': 'z.date()',
      'date': 'z.date()',
      'uuid': 'z.string().uuid()',
      'decimal(10,2)': 'z.number().positive().max(9999.99)',
      'decimal': 'z.number()',
    }

    // Check for exact matches first
    if (typeMap[type.toLowerCase()]) {
      return typeMap[type.toLowerCase()]
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(typeMap)) {
      if (type.toLowerCase().includes(key)) {
        return value
      }
    }

    // Default to string
    return 'z.string()'
  }

  /**
   * Apply constraint to Zod type
   */
  private applyConstraint(zodType: string, constraint: string, field: FieldDefinition): string {
    // Max length
    const maxMatch = constraint.match(/max\s*:\s*(\d+)/i)
    if (maxMatch) {
      const max = parseInt(maxMatch[1])
      if (field.type.includes('string') || field.type.includes('text')) {
        return `${zodType}.max(${max})`
      }
    }

    // Min length
    const minMatch = constraint.match(/min\s*:\s*(\d+)/i)
    if (minMatch) {
      const min = parseInt(minMatch[1])
      if (field.type.includes('string') || field.type.includes('text')) {
        return `${zodType}.min(${min})`
      }
    }

    // Min value
    if (constraint.includes('Min 0')) {
      if (field.type.includes('number') || field.type.includes('decimal')) {
        return `${zodType}.min(0)`
      }
    }

    // Max value
    const maxValueMatch = constraint.match(/Max\s+(\d+\.?\d*)/i)
    if (maxValueMatch) {
      const max = parseFloat(maxValueMatch[1])
      if (field.type.includes('number') || field.type.includes('decimal')) {
        return `${zodType}.max(${max})`
      }
    }

    // Email
    if (constraint.toLowerCase().includes('email')) {
      return `${zodType}.email()`
    }

    // URL
    if (constraint.toLowerCase().includes('url')) {
      return `${zodType}.url()`
    }

    return zodType
  }

  /**
   * Generate all Zod schemas from data specs
   */
  async generateAll(): Promise<void> {
    const parser = new SpecParser()
    const { data } = await parser.parseAllSpecs()

    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true })

    // Generate schema for each model
    for (const model of data) {
      const schema = this.generateZodSchema(model)
      const fileName = `${model.name.toLowerCase()}.ts`
      const filePath = path.join(this.outputDir, fileName)
      await fs.writeFile(filePath, schema, 'utf-8')
      console.log(`Generated: ${filePath}`)
    }

    // Generate index file
    const indexContent = data
      .map(model => `export * from './${model.name.toLowerCase()}'`)
      .join('\n')
    
    await fs.writeFile(path.join(this.outputDir, 'index.ts'), indexContent, 'utf-8')
    console.log(`Generated: ${path.join(this.outputDir, 'index.ts')}`)
  }
}

// CLI usage
if (require.main === module) {
  const generator = new ZodGenerator()
  generator.generateAll().catch(console.error)
}

