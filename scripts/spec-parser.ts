#!/usr/bin/env tsx
/**
 * Spec Parser
 * Parses Markdown specifications into structured JSON data
 */

import fs from 'fs/promises'
import path from 'path'

export interface ApiEndpoint {
  method: string
  path: string
  description: string
  auth: string
  params?: Record<string, any>
  requestBody?: any
  responses: Record<number, any>
}

export interface DataModel {
  name: string
  table: string
  description: string
  fields: Array<{
    name: string
    type: string
    required: boolean
    default?: any
    constraints?: string[]
    description?: string
  }>
  relations?: Array<{
    name: string
    type: string
    target: string
  }>
  indexes?: string[]
}

export interface UIPage {
  route: string
  description: string
  components: string[]
  state: Record<string, string>
  userFlows: string[]
}

export class SpecParser {
  private docsPath: string

  constructor(docsPath: string = './docs') {
    this.docsPath = docsPath
  }

  /**
   * Parse API specification from Markdown
   */
  async parseApiSpec(filePath: string): Promise<ApiEndpoint[]> {
    const content = await fs.readFile(filePath, 'utf-8')
    const endpoints: ApiEndpoint[] = []
    
    // Split by endpoint sections (## Endpoint:)
    const endpointSections = content.split(/## Endpoint:/g).slice(1)
    
    for (const section of endpointSections) {
      const endpoint = this.parseEndpoint(section)
      if (endpoint) {
        endpoints.push(endpoint)
      }
    }
    
    return endpoints
  }

  private parseEndpoint(section: string): ApiEndpoint | null {
    const lines = section.split('\n')
    const endpoint: Partial<ApiEndpoint> = {
      responses: {},
    }

    // Parse method and path from first line
    const firstLine = lines[0]?.trim()
    if (!firstLine) return null

    const methodMatch = firstLine.match(/^(GET|POST|PATCH|DELETE|PUT)\s+(.+)$/i)
    if (methodMatch) {
      endpoint.method = methodMatch[1].toUpperCase()
      endpoint.path = methodMatch[2].trim()
    }

    // Parse description
    const descMatch = section.match(/\*\*Description\*\*:\s*(.+)/i)
    if (descMatch) {
      endpoint.description = descMatch[1].trim()
    }

    // Parse authentication
    const authMatch = section.match(/\*\*Authentication\*\*:\s*(.+)/i)
    if (authMatch) {
      endpoint.auth = authMatch[1].trim()
    }

    // Parse request body
    const requestBodyMatch = section.match(/\*\*Request Body\*\*:\s*```typescript\n([\s\S]*?)```/i)
    if (requestBodyMatch) {
      endpoint.requestBody = this.parseTypeScriptType(requestBodyMatch[1])
    }

    // Parse responses
    const responseMatches = section.matchAll(/\*\*Response (\d+)\*\*:([\s\S]*?)(?=\*\*Response|\n##|$)/g)
    for (const match of responseMatches) {
      const status = parseInt(match[1])
      const content = match[2]
      
      // Try to parse TypeScript type
      const typeMatch = content.match(/```typescript\n([\s\S]*?)```/)
      if (typeMatch) {
        endpoint.responses![status] = this.parseTypeScriptType(typeMatch[1])
      } else {
        endpoint.responses![status] = { description: content.trim() }
      }
    }

    return endpoint as ApiEndpoint
  }

  /**
   * Parse data model specification from Markdown
   */
  async parseDataSpec(filePath: string): Promise<DataModel[]> {
    const content = await fs.readFile(filePath, 'utf-8')
    const models: DataModel[] = []
    
    // Split by model sections (## Model:)
    const modelSections = content.split(/## Model:/g).slice(1)
    
    for (const section of modelSections) {
      const model = this.parseModel(section)
      if (model) {
        models.push(model)
      }
    }
    
    return models
  }

  private parseModel(section: string): DataModel | null {
    const lines = section.split('\n')
    const model: Partial<DataModel> = {
      fields: [],
      relations: [],
      indexes: [],
    }

    // Parse model name from first line
    const firstLine = lines[0]?.trim()
    if (!firstLine) return null
    model.name = firstLine

    // Parse table name
    const tableMatch = section.match(/\*\*Table\*\*:\s*`(.+)`/i)
    if (tableMatch) {
      model.table = tableMatch[1]
    }

    // Parse description
    const descMatch = section.match(/\*\*Description\*\*:\s*(.+)/i)
    if (descMatch) {
      model.description = descMatch[1].trim()
    }

    // Parse fields table
    const fieldsTableMatch = section.match(/\*\*Fields\*\*:[\s\S]*?\|([\s\S]*?)\n\n/)
    if (fieldsTableMatch) {
      const tableContent = fieldsTableMatch[1]
      const rows = tableContent.split('\n').filter(line => line.trim().startsWith('|'))
      
      // Skip header row
      for (const row of rows.slice(1)) {
        const cells = row.split('|').map(c => c.trim()).filter(c => c)
        if (cells.length >= 3) {
          model.fields!.push({
            name: cells[0],
            type: cells[1],
            required: cells[2] === 'Yes',
            default: cells[3] || undefined,
            constraints: cells[4] ? cells[4].split(', ') : undefined,
            description: cells[5] || undefined,
          })
        }
      }
    }

    // Parse relations
    const relationsMatch = section.match(/\*\*Relations\*\*:([\s\S]*?)(?=\*\*Indexes|$)/i)
    if (relationsMatch) {
      const relationsContent = relationsMatch[1]
      const relationLines = relationsContent.split('\n').filter(line => line.trim().startsWith('-'))
      for (const line of relationLines) {
        const match = line.match(/`(\w+)`\s*→\s*(\w+)/)
        if (match) {
          model.relations!.push({
            name: match[1],
            type: 'one-to-many', // Simplified
            target: match[2],
          })
        }
      }
    }

    // Parse indexes
    const indexesMatch = section.match(/\*\*Indexes\*\*:([\s\S]*?)(?=\*\*Validation|$)/i)
    if (indexesMatch) {
      const indexesContent = indexesMatch[1]
      const indexLines = indexesContent.split('\n').filter(line => line.trim().startsWith('-'))
      for (const line of indexLines) {
        const match = line.match(/`(.+)`/)
        if (match) {
          model.indexes!.push(match[1])
        }
      }
    }

    return model as DataModel
  }

  /**
   * Parse UI page specification from Markdown
   */
  async parseUISpec(filePath: string): Promise<UIPage[]> {
    const content = await fs.readFile(filePath, 'utf-8')
    const pages: UIPage[] = []
    
    // Split by page sections (## Page:)
    const pageSections = content.split(/## Page:/g).slice(1)
    
    for (const section of pageSections) {
      const page = this.parsePage(section)
      if (page) {
        pages.push(page)
      }
    }
    
    return pages
  }

  private parsePage(section: string): UIPage | null {
    const page: Partial<UIPage> = {
      components: [],
      state: {},
      userFlows: [],
    }

    // Parse page name from first line
    const firstLine = section.split('\n')[0]?.trim()
    if (!firstLine) return null

    // Parse route
    const routeMatch = section.match(/\*\*Route\*\*:\s*`(.+)`/i)
    if (routeMatch) {
      page.route = routeMatch[1]
    }

    // Parse description
    const descMatch = section.match(/\*\*Description\*\*:\s*(.+)/i)
    if (descMatch) {
      page.description = descMatch[1].trim()
    }

    // Parse components
    const componentsMatch = section.match(/\*\*Components\*\*:([\s\S]*?)(?=\*\*State|\*\*User Flows|$)/i)
    if (componentsMatch) {
      const componentsContent = componentsMatch[1]
      const componentLines = componentsContent.split('\n').filter(line => line.trim().startsWith('-'))
      page.components = componentLines.map(line => {
        const match = line.match(/-\s*(.+?)\s*\(/)
        return match ? match[1] : line.replace(/^-\s*/, '')
      })
    }

    // Parse state
    const stateMatch = section.match(/\*\*State\*\*:([\s\S]*?)(?=\*\*User Flows|$)/i)
    if (stateMatch) {
      const stateContent = stateMatch[1]
      const stateLines = stateContent.split('\n').filter(line => line.trim().startsWith('-'))
      for (const line of stateLines) {
        const match = line.match(/`(\w+)`\s*\((.+?)\)/)
        if (match) {
          page.state![match[1]] = match[2]
        }
      }
    }

    // Parse user flows
    const flowsMatch = section.match(/\*\*User Flows\*\*:([\s\S]*?)(?=\*\*Performance|\*\*SEO|$)/i)
    if (flowsMatch) {
      const flowsContent = flowsMatch[1]
      const flowLines = flowsContent.split('\n').filter(line => line.trim().match(/^\d+\./))
      page.userFlows = flowLines.map(line => line.replace(/^\d+\.\s*/, '').trim())
    }

    return page as UIPage
  }

  /**
   * Simple TypeScript type parser (basic implementation)
   */
  private parseTypeScriptType(typeString: string): any {
    // Remove comments and clean up
    const cleaned = typeString
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim()

    // Try to parse as JSON if it looks like an object
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      try {
        // Convert TypeScript types to JSON-like structure
        const jsonLike = cleaned
          .replace(/(\w+):/g, '"$1":')
          .replace(/:\s*string/g, ': "string"')
          .replace(/:\s*number/g, ': 0')
          .replace(/:\s*boolean/g, ': true')
          .replace(/\| null/g, '')
          .replace(/Array<(.+)>/g, '[$1]')
        
        return JSON.parse(jsonLike)
      } catch {
        // Return as string if parsing fails
        return { type: cleaned }
      }
    }

    return { type: cleaned }
  }

  /**
   * Parse all specs in a directory
   */
  async parseAllSpecs(): Promise<{
    api: ApiEndpoint[]
    data: DataModel[]
    ui: UIPage[]
  }> {
    const apiSpecs: ApiEndpoint[] = []
    const dataSpecs: DataModel[] = []
    const uiSpecs: UIPage[] = []

    try {
      // Parse API specs
      const apiDir = path.join(this.docsPath, 'api-specs')
      const apiFiles = await fs.readdir(apiDir)
      for (const file of apiFiles.filter(f => f.endsWith('.md'))) {
        const endpoints = await this.parseApiSpec(path.join(apiDir, file))
        apiSpecs.push(...endpoints)
      }

      // Parse data specs
      const dataDir = path.join(this.docsPath, 'data-specs')
      const dataFiles = await fs.readdir(dataDir)
      for (const file of dataFiles.filter(f => f.endsWith('.md'))) {
        if (file === 'schema.md') {
          const models = await this.parseDataSpec(path.join(dataDir, file))
          dataSpecs.push(...models)
        }
      }

      // Parse UI specs
      const uiDir = path.join(this.docsPath, 'ui-specs')
      const uiFiles = await fs.readdir(uiDir)
      for (const file of uiFiles.filter(f => f.endsWith('.md'))) {
        if (file === 'pages.md') {
          const pages = await this.parseUISpec(path.join(uiDir, file))
          uiSpecs.push(...pages)
        }
      }
    } catch (error) {
      console.error('Error parsing specs:', error)
    }

    return {
      api: apiSpecs,
      data: dataSpecs,
      ui: uiSpecs,
    }
  }
}

// CLI usage
if (require.main === module) {
  const parser = new SpecParser()
  parser.parseAllSpecs().then(result => {
    console.log(JSON.stringify(result, null, 2))
  })
}

