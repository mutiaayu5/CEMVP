# API Contracts: Waitlist Endpoints

**Date**: 2026-01-06  
**Feature**: CreateConomy Landing Page  
**Plan**: [plan.md](./plan.md)

## POST /api/waitlist

**Purpose**: Submit email address to join the waitlist.

### Request

**Method**: `POST`  
**Path**: `/api/waitlist`  
**Content-Type**: `application/json`

**Body Schema** (Zod):
```typescript
{
  email: string; // Valid email format, required
}
```

**Example Request**:
```json
{
  "email": "user@example.com"
}
```

### Response

#### Success (201 Created)

**Status**: `201 Created`

**Body Schema**:
```typescript
{
  success: true;
  message: string; // e.g., "Successfully joined the waitlist!"
  position: number; // Position in waitlist (1-indexed)
}
```

**Example Response**:
```json
{
  "success": true,
  "message": "Successfully joined the waitlist!",
  "position": 42
}
```

#### Validation Error (400 Bad Request)

**Status**: `400 Bad Request`

**Body Schema**:
```typescript
{
  success: false;
  error: string; // e.g., "Invalid email address"
  field?: string; // Optional: field name with error
}
```

**Example Response**:
```json
{
  "success": false,
  "error": "Invalid email address",
  "field": "email"
}
```

#### Rate Limit Exceeded (429 Too Many Requests)

**Status**: `429 Too Many Requests`

**Body Schema**:
```typescript
{
  success: false;
  error: string; // e.g., "Rate limit exceeded. Please try again later."
  retryAfter?: number; // Optional: seconds until retry allowed
}
```

**Example Response**:
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again later.",
  "retryAfter": 1800
}
```

#### Duplicate Email (409 Conflict)

**Status**: `409 Conflict`

**Body Schema**:
```typescript
{
  success: false;
  error: string; // e.g., "Email already registered"
}
```

**Example Response**:
```json
{
  "success": false,
  "error": "Email already registered"
}
```

### Implementation Details

1. **Zod Validation**: Validate email format using Zod schema
2. **Rate Limiting**: Check `COUNT(created_at > NOW() - '1 hour')` per IP address
   - If count >= 5, return 429
   - Note: IP tracking requires additional mechanism (headers, session, or separate table)
3. **Duplicate Check**: Query database for existing email
   - If exists, return 409
4. **Insert**: If validation passes, insert email into `waitlist_emails` table
5. **Position Calculation**: Count total waitlist entries to determine position
6. **Return**: Success response with position

### Error Handling

- **Invalid JSON**: Return 400 with error message
- **Missing email field**: Return 400 with field error
- **Database errors**: Return 500 with generic error (don't expose internal details)
- **Network errors**: Client should handle retry logic

---

## GET /api/waitlist/count

**Purpose**: Get the current total count of waitlist signups for live counter display.

### Request

**Method**: `GET`  
**Path**: `/api/waitlist/count`  
**Headers**: None required

### Response

#### Success (200 OK)

**Status**: `200 OK`

**Body Schema**:
```typescript
{
  count: number; // Total number of waitlist signups
}
```

**Example Response**:
```json
{
  "count": 1234
}
```

### Implementation Details

1. **Query**: Use Prisma `waitlist_emails.count()` to get total count
2. **Caching**: Consider caching for 5-10 seconds to reduce database load (optional)
3. **Performance**: Count query is fast with index on `created_at`

### Error Handling

- **Database errors**: Return 500 with generic error
- **Empty result**: Return count of 0 (not an error)

---

## Rate Limiting Implementation Notes

**Challenge**: IP-based rate limiting requires tracking IP addresses. Options:

1. **Request Headers**: Extract IP from `x-forwarded-for` or `x-real-ip` headers (Vercel provides these)
2. **Separate Table**: Create `rate_limit_tracking` table with `ip_address` and `created_at`
3. **Session-Based**: Use Next.js cookies/sessions to track submissions per session

**Recommended Approach**: Use request headers for IP extraction, store in temporary tracking table or use in-memory cache (with TTL) for rate limit checks.

**Alternative**: If IP tracking is complex, use email-based rate limiting (check if email submitted in last hour) as fallback, though this is less secure.

---

## Security Considerations

1. **Input Validation**: All inputs validated with Zod before processing
2. **SQL Injection**: Prisma parameterized queries prevent SQL injection
3. **Rate Limiting**: Prevents abuse and spam
4. **Error Messages**: Don't expose internal database errors to clients
5. **CORS**: Configure CORS if needed for cross-origin requests (not required for same-origin)

---

## Testing Scenarios

### POST /api/waitlist

1. **Valid email**: Should return 201 with position
2. **Invalid email format**: Should return 400
3. **Duplicate email**: Should return 409
4. **Rate limit exceeded**: Should return 429 after 5 submissions
5. **Missing email field**: Should return 400
6. **Database error**: Should return 500 (generic message)

### GET /api/waitlist/count

1. **Normal request**: Should return 200 with count
2. **Empty waitlist**: Should return 200 with count 0
3. **Database error**: Should return 500 (generic message)

