# Authentication API Specifications

## Endpoint: POST /api/auth/create-profile

**Description**: Create a user profile after Supabase authentication

**Authentication**: Required (must be authenticated via Supabase)

**Request Body**:
```typescript
{
  userId: string;        // Required, must match authenticated user ID
  email: string;         // Required, must match authenticated user email
  fullName?: string;     // Optional, max 100 chars
}
```

**Response 201**:
```typescript
{
  profile: {
    id: string;
    userId: string;
    email: string;
    fullName: string | null;
    role: "CONSUMER" | "CREATOR" | "ADMIN";
    createdAt: string;
  };
}
```

**Response 400**: Profile already exists or validation error
**Response 401**: Unauthorized
**Response 403**: User ID mismatch
**Response 500**: Server error

---

## Endpoint: GET /api/auth/profile

**Description**: Get current user's profile

**Authentication**: Required

**Response 200**:
```typescript
{
  profile: {
    id: string;
    userId: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    role: "CONSUMER" | "CREATOR" | "ADMIN";
    createdAt: string;
    updatedAt: string;
  };
}
```

**Response 401**: Unauthorized
**Response 404**: Profile not found
**Response 500**: Server error

---

## Endpoint: PATCH /api/auth/profile

**Description**: Update current user's profile

**Authentication**: Required

**Request Body** (all fields optional):
```typescript
{
  fullName?: string;     // Max 100 chars
  avatarUrl?: string;    // Valid URL
}
```

**Response 200**: Updated profile
**Response 400**: Validation error
**Response 401**: Unauthorized
**Response 500**: Server error

