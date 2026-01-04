# Spec-Driven Development Framework

This project uses a spec-driven development approach where Markdown specifications serve as the single source of truth for all implementation.

## Quick Start

1. **Write specifications** in `docs/api-specs/`, `docs/data-specs/`, and `docs/ui-specs/`
2. **Generate code** from specs: `npm run spec:generate`
3. **Validate** implementation matches specs: `npm run spec:validate`
4. **Check for drift**: `npm run spec:sync`

## Workflow

```
Write Spec → Generate Code → Implement Logic → Validate → Sync Check
```

### 1. Write Spec

Create or update Markdown specifications:

- **API Specs** (`docs/api-specs/`): Define endpoints, request/response schemas
- **Data Specs** (`docs/data-specs/`): Define database models and validation rules
- **UI Specs** (`docs/ui-specs/`): Define pages and components

### 2. Generate Code

Run the generator to create code from specs:

```bash
npm run spec:generate
```

This will:
- Generate Zod schemas from data specs → `lib/schemas/`
- Generate TypeScript types from specs → `lib/types/`
- Generate API route stubs from API specs → `app/api/`

### 3. Implement Logic

Fill in the business logic in the generated code stubs. The generators create the structure, you add the implementation.

### 4. Validate

Check that your implementation matches the specifications:

```bash
npm run spec:validate
```

This validates:
- API routes exist and handle correct methods
- Zod schemas include all required fields
- TypeScript types match specs

### 5. Sync Check

Detect drift between specs and code:

```bash
npm run spec:sync
```

This checks for:
- Missing routes/schemas/types
- Outdated generated code
- Mismatches between specs and implementation

## Spec Format

### API Spec Example

```markdown
## Endpoint: GET /api/templates

**Description**: List all approved templates

**Authentication**: Optional (public endpoint)

**Query Parameters**:
- `category` (string, optional): Filter by category
- `page` (number, default: 1): Page number

**Response 200**:
```typescript
{
  templates: Array<{
    id: string;
    title: string;
    price: number;
  }>;
}
```
```

### Data Spec Example

```markdown
## Model: Template

**Table**: `templates`

**Fields**:
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | uuid | Yes | uuid() | Primary Key | Template ID |
| `title` | string | Yes | - | Max 200 chars | Template title |
| `price` | decimal(10,2) | Yes | 0 | Min 0 | Price in USD |
```

## Generated Code Structure

```
lib/
├── schemas/          # Zod validation schemas (generated)
│   ├── template.ts
│   └── index.ts
└── types/            # TypeScript types (generated)
    ├── api.ts
    ├── data.ts
    └── index.ts

app/api/              # API routes (generated stubs)
├── templates/
│   └── route.ts
└── auth/
    └── route.ts
```

## Prisma Schema Sync

Compare Prisma schema with data specs:

```bash
tsx scripts/prisma-sync.ts
```

This generates a report at `docs/prisma-sync-report.md` showing:
- Missing models/fields in Prisma
- Extra fields in Prisma
- Type mismatches

## Benefits

1. **Consistency**: Code always matches specifications
2. **Speed**: Generate boilerplate automatically
3. **Documentation**: Specs serve as living documentation
4. **Quality**: Validation ensures correctness
5. **Maintainability**: Single source of truth reduces drift

## Best Practices

1. **Update specs first**: When requirements change, update specs before code
2. **Regenerate after spec changes**: Run `npm run spec:generate` after updating specs
3. **Validate before committing**: Run `npm run spec:validate` in CI/CD
4. **Check for drift regularly**: Run `npm run spec:sync` weekly
5. **Don't edit generated files**: Only modify specs, regenerate code

## Troubleshooting

### Generated code is outdated

Run `npm run spec:generate` to regenerate from latest specs.

### Validation fails

Check the error messages and update either:
- Your implementation to match specs, or
- Your specs to match implementation

### Prisma schema out of sync

Run `tsx scripts/prisma-sync.ts` to see differences, then update Prisma schema manually.

## Scripts Reference

- `npm run spec:generate` - Generate all code from specs
- `npm run spec:validate` - Validate code matches specs
- `npm run spec:sync` - Check for spec-code drift

