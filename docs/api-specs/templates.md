# Template API Specifications

## Endpoint: GET /api/templates

**Description**: List all approved templates with pagination and filtering

**Authentication**: Optional (public endpoint)

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `category` | string | No | - | Filter by category (Marketing, Finance, Dev, HR) |
| `tool` | string | No | - | Filter by tool name (n8n, Zapier, LangChain) |
| `price` | string | No | - | Filter by price: "free" or "paid" |
| `complexity` | string | No | - | Filter by complexity: "LOW", "MEDIUM", "HIGH" |
| `page` | number | No | 1 | Page number (1-indexed) |
| `limit` | number | No | 20 | Items per page (max: 100) |
| `sort` | string | No | "createdAt" | Sort field: "createdAt", "price", "views", "downloads" |
| `order` | string | No | "desc" | Sort order: "asc" or "desc" |

**Response 200**:
```typescript
{
  templates: Array<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    currency: string;
    category: string;
    toolStack: string[];
    complexity: "LOW" | "MEDIUM" | "HIGH";
    status: "APPROVED";
    views: number;
    downloads: number;
    likes: number;
    createdAt: string; // ISO 8601
    creator: {
      id: string;
      email: string;
      fullName: string | null;
    };
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Response 400**: Invalid query parameters
```typescript
{
  error: string;
  details?: Record<string, string[]>;
}
```

**Response 500**: Server error
```typescript
{
  error: string;
}
```

---

## Endpoint: GET /api/templates/[id]

**Description**: Get a single template by ID or slug

**Authentication**: Optional (public endpoint)

**Path Parameters**:
- `id` (string, required): Template ID or slug

**Response 200**:
```typescript
{
  template: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number;
    currency: string;
    category: string;
    toolStack: string[];
    complexity: "LOW" | "MEDIUM" | "HIGH";
    status: "APPROVED";
    views: number;
    downloads: number;
    likes: number;
    createdAt: string;
    updatedAt: string;
    creator: {
      id: string;
      email: string;
      fullName: string | null;
      avatarUrl: string | null;
    };
    versions: Array<{
      id: string;
      versionNumber: string;
      fileUrl: string;
      changelog: string | null;
      createdAt: string;
    }>;
  };
}
```

**Response 404**: Template not found
**Response 500**: Server error

---

## Endpoint: POST /api/templates

**Description**: Create a new template submission

**Authentication**: Required (Creator role)

**Request Body**:
```typescript
{
  title: string;           // Required, max 200 chars
  description: string;     // Optional, max 5000 chars
  category: string;        // Required, one of: Marketing, Finance, Dev, HR, Sales, Other
  toolStack: string[];     // Required, min 1 item, max 10 items
  complexity: "LOW" | "MEDIUM" | "HIGH"; // Required
  price: number;           // Required, min 0, max 9999.99
  currency?: string;       // Optional, default: "USD"
  file: File;              // Required, max 10MB, types: .json, .yaml, .zip
  coverImage?: File;        // Optional, max 5MB, types: .jpg, .png, .webp
}
```

**Response 201**:
```typescript
{
  template: {
    id: string;
    title: string;
    slug: string;
    status: "PENDING";
    createdAt: string;
  };
  message: "Template submitted for review";
}
```

**Response 400**: Validation error
**Response 401**: Unauthorized
**Response 403**: Not a creator
**Response 500**: Server error

---

## Endpoint: PATCH /api/templates/[id]

**Description**: Update an existing template (creator only, pending status only)

**Authentication**: Required (Creator role, must own template)

**Path Parameters**:
- `id` (string, required): Template ID

**Request Body** (all fields optional):
```typescript
{
  title?: string;
  description?: string;
  category?: string;
  toolStack?: string[];
  complexity?: "LOW" | "MEDIUM" | "HIGH";
  price?: number;
}
```

**Response 200**: Updated template
**Response 400**: Validation error
**Response 401**: Unauthorized
**Response 403**: Not owner or template not pending
**Response 404**: Template not found
**Response 500**: Server error

---

## Endpoint: DELETE /api/templates/[id]

**Description**: Delete a template (creator only, pending status only)

**Authentication**: Required (Creator role, must own template)

**Path Parameters**:
- `id` (string, required): Template ID

**Response 204**: Template deleted
**Response 401**: Unauthorized
**Response 403**: Not owner or template not pending
**Response 404**: Template not found
**Response 500**: Server error

---

## Endpoint: POST /api/templates/[id]/interactions

**Description**: Record user interaction (view, download, like)

**Authentication**: Optional (anonymous interactions allowed)

**Path Parameters**:
- `id` (string, required): Template ID

**Request Body**:
```typescript
{
  type: "VIEW" | "DOWNLOAD" | "LIKE"; // Required
}
```

**Response 200**:
```typescript
{
  interaction: {
    id: string;
    type: string;
    createdAt: string;
  };
  updatedCounts: {
    views: number;
    downloads: number;
    likes: number;
  };
}
```

**Response 400**: Invalid interaction type
**Response 404**: Template not found
**Response 500**: Server error

