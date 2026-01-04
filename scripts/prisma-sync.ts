#!/usr/bin/env tsx
/**
 * Prisma Schema Sync Tool
 * Compares data specifications with Prisma schema and reports differences
 */

import fs from 'fs/promises'
import path from 'path'
import { SpecParser, type DataModel } from './spec-parser'

interface PrismaField {
  name: string
  type: string
  required: boolean
  default?: string
  attributes?: string[]
}

interface PrismaModel {
  name: string
  fields: PrismaField[]
}

export class PrismaSync {
  private prismaSchemaPath: string

  constructor(prismaSchemaPath: string = './prisma/schema.prisma') {
    this.prismaSchemaPath = prismaSchemaPath
  }

  /**
   * Parse Prisma schema file
   */
  async parsePrismaSchema(): Promise<PrismaModel[]> {
    const content = await fs.readFile(this.prismaSchemaPath, 'utf-8')
    const models: PrismaModel[] = []

    // Split by model blocks
    const modelBlocks = content.split(/^model\s+(\w+)/gm).slice(1)
    
    for (let i = 0; i < modelBlocks.length; i += 2) {
      const modelName = modelBlocks[i]
      const modelContent = modelBlocks[i + 1] || ''
      
      const model: PrismaModel = {
        name: modelName,
        fields: [],
      }

      // Parse fields
      const fieldLines = modelContent.split('\n').filter(line => {
        const trimmed = line.trim()
        return trimmed && 
               !trimmed.startsWith('//') && 
               !trimmed.startsWith('@@') &&
               !trimmed.startsWith('}') &&
               trimmed.includes(':')
      })

      for (const line of fieldLines) {
        const field = this.parsePrismaField(line)
        if (field) {
          model.fields.push(field)
        }
      }

      models.push(model)
    }

    return models
  }

  /**
   * Parse a single Prisma field
   */
  private parsePrismaField(line: string): PrismaField | null {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//')) return null

    // Match field pattern: name type attributes
    const match = trimmed.match(/^(\w+)\s+([^\s]+(?:\s+[^\s]+)*?)(?:\s+(.+))?$/)
    if (!match) return null

    const [, name, typePart, attributesPart] = match
    const type = typePart.split(/\s+/)[0] // Get first part (before @default, etc.)
    const required = !typePart.includes('?')
    
    const attributes: string[] = []
    let defaultValue: string | undefined

    // Parse attributes
    if (attributesPart) {
      const attrMatches = attributesPart.matchAll(/@(\w+)(?:\(([^)]+)\))?/g)
      for (const attrMatch of attrMatches) {
        const attrName = attrMatch[1]
        const attrValue = attrMatch[2]
        
        if (attrName === 'default') {
          defaultValue = attrValue || 'default'
        } else {
          attributes.push(attrName)
        }
      }
    }

    return {
      name,
      type,
      required,
      default: defaultValue,
      attributes,
    }
  }

  /**
   * Compare spec model with Prisma model
   */
  compareModels(specModel: DataModel, prismaModel: PrismaModel): {
    missingFields: string[]
    extraFields: string[]
    typeMismatches: Array<{ field: string; spec: string; prisma: string }>
  } {
    const missingFields: string[] = []
    const extraFields: string[] = []
    const typeMismatches: Array<{ field: string; spec: string; prisma: string }> = []

    // Check for missing fields in Prisma
    const prismaFieldNames = new Set(prismaModel.fields.map(f => f.name))
    for (const specField of specModel.fields) {
      if (!prismaFieldNames.has(specField.name)) {
        missingFields.push(specField.name)
      }
    }

    // Check for extra fields in Prisma (excluding relations)
    const specFieldNames = new Set(specModel.fields.map(f => f.name))
    for (const prismaField of prismaModel.fields) {
      if (!specFieldNames.has(prismaField.name) && 
          !prismaField.type.match(/^[A-Z]/)) { // Relations start with capital
        extraFields.push(prismaField.name)
      }
    }

    // Check for type mismatches
    const specFieldMap = new Map(specModel.fields.map(f => [f.name, f]))
    for (const prismaField of prismaModel.fields) {
      const specField = specFieldMap.get(prismaField.name)
      if (specField) {
        const specType = this.normalizeType(specField.type)
        const prismaType = this.normalizeType(prismaField.type)
        
        if (specType !== prismaType) {
          typeMismatches.push({
            field: prismaField.name,
            spec: specType,
            prisma: prismaType,
          })
        }
      }
    }

    return { missingFields, extraFields, typeMismatches }
  }

  /**
   * Normalize type for comparison
   */
  private normalizeType(type: string): string {
    // Remove array notation
    let normalized = type.replace('[]', '').trim().toLowerCase()
    
    // Map common types
    const typeMap: Record<string, string> = {
      'string': 'string',
      'text': 'string',
      'number': 'number',
      'integer': 'number',
      'int': 'number',
      'boolean': 'bool',
      'datetime': 'datetime',
      'date': 'datetime',
      'uuid': 'string',
      'decimal': 'decimal',
    }

    for (const [key, value] of Object.entries(typeMap)) {
      if (normalized.includes(key)) {
        return value
      }
    }

    return normalized
  }

  /**
   * Generate sync report
   */
  async generateReport(): Promise<string> {
    const parser = new SpecParser()
    const { data } = await parser.parseAllSpecs()
    const prismaModels = await this.parsePrismaSchema()

    const report: string[] = []
    report.push('# Prisma Schema Sync Report')
    report.push('')
    report.push(`Generated: ${new Date().toISOString()}`)
    report.push('')

    const specModelMap = new Map(data.map(m => [m.name, m]))
    const prismaModelMap = new Map(prismaModels.map(m => [m.name, m]))

    // Check each spec model
    for (const specModel of data) {
      report.push(`## Model: ${specModel.name}`)
      report.push('')

      const prismaModel = prismaModelMap.get(specModel.name)
      
      if (!prismaModel) {
        report.push('⚠️ **Model not found in Prisma schema**')
        report.push('')
        continue
      }

      const comparison = this.compareModels(specModel, prismaModel)

      if (comparison.missingFields.length > 0) {
        report.push('### Missing Fields in Prisma:')
        for (const field of comparison.missingFields) {
          report.push(`- \`${field}\``)
        }
        report.push('')
      }

      if (comparison.extraFields.length > 0) {
        report.push('### Extra Fields in Prisma:')
        for (const field of comparison.extraFields) {
          report.push(`- \`${field}\``)
        }
        report.push('')
      }

      if (comparison.typeMismatches.length > 0) {
        report.push('### Type Mismatches:')
        for (const mismatch of comparison.typeMismatches) {
          report.push(`- \`${mismatch.field}\`: Spec=${mismatch.spec}, Prisma=${mismatch.prisma}`)
        }
        report.push('')
      }

      if (comparison.missingFields.length === 0 && 
          comparison.extraFields.length === 0 && 
          comparison.typeMismatches.length === 0) {
        report.push('✅ **Schema matches specification**')
        report.push('')
      }
    }

    // Check for Prisma models not in specs
    const missingModels = prismaModels.filter(m => !specModelMap.has(m.name))
    if (missingModels.length > 0) {
      report.push('## Models in Prisma but not in Specs:')
      for (const model of missingModels) {
        report.push(`- \`${model.name}\``)
      }
      report.push('')
    }

    return report.join('\n')
  }

  /**
   * Run sync check and save report
   */
  async syncCheck(): Promise<void> {
    const report = await this.generateReport()
    const reportPath = './docs/prisma-sync-report.md'
    await fs.writeFile(reportPath, report, 'utf-8')
    console.log(`Sync report generated: ${reportPath}`)
    console.log(report)
  }
}

// CLI usage
if (require.main === module) {
  const sync = new PrismaSync()
  sync.syncCheck().catch(console.error)
}

