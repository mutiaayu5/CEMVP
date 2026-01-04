# Validation Rules Specifications

This document defines validation rules for all data models and API endpoints.

## Profile Validations

### Create Profile
- `userId`: Required, must match authenticated user's ID
- `email`: Required, valid email format, must match authenticated user's email
- `fullName`: Optional, max 100 characters, trim whitespace

### Update Profile
- `fullName`: Optional, max 100 characters, trim whitespace
- `avatarUrl`: Optional, valid URL format, must be HTTPS

---

## Template Validations

### Create Template
- `title`: Required, 3-200 characters, trim whitespace
- `description`: Optional, max 5000 characters
- `category`: Required, must be one of: Marketing, Finance, Dev, HR, Sales, Other
- `toolStack`: Required, array with 1-10 items, each item 1-50 characters
- `complexity`: Required, must be: LOW, MEDIUM, or HIGH
- `price`: Required, number >= 0, max 9999.99, 2 decimal places
- `currency`: Optional, default "USD", must be valid 3-letter currency code
- `file`: Required, max 10MB, allowed types: .json, .yaml, .zip
- `coverImage`: Optional, max 5MB, allowed types: .jpg, .jpeg, .png, .webp

### Update Template
- All fields optional
- Can only update if status is PENDING
- Must be template owner
- Same validation rules as create for provided fields

### Slug Generation
- Auto-generated from `title`
- Convert to lowercase
- Replace spaces with hyphens
- Remove special characters
- Ensure uniqueness

---

## TemplateVersion Validations

### Create Version
- `templateId`: Required, must exist
- `versionNumber`: Required, format: `^\d+\.\d+$` (e.g., "1.0", "2.5")
- `fileUrl`: Required, valid Supabase Storage URL
- `changelog`: Optional, max 2000 characters

### Version Number Rules
- Must be semantic versioning format (X.Y)
- Must be unique per template
- Should increment from previous version

---

## Interaction Validations

### Create Interaction
- `templateId`: Required, template must exist and be APPROVED
- `userId`: Optional, if provided must be valid user ID
- `type`: Required, must be: VIEW, DOWNLOAD, or LIKE

### Duplicate Prevention
- Same user cannot create duplicate interaction of same type for same template
- Anonymous users (null userId) can have multiple interactions

---

## API Query Parameter Validations

### GET /api/templates
- `category`: Optional, must be valid category if provided
- `tool`: Optional, string, max 50 characters
- `price`: Optional, must be "free" or "paid"
- `complexity`: Optional, must be LOW, MEDIUM, or HIGH
- `page`: Optional, integer >= 1, default 1
- `limit`: Optional, integer 1-100, default 20
- `sort`: Optional, must be: createdAt, price, views, downloads
- `order`: Optional, must be "asc" or "desc", default "desc"

---

## File Upload Validations

### Template File
- Max size: 10MB
- Allowed types: .json, .yaml, .zip
- Must be valid file format
- For .json: Must be valid JSON
- For .zip: Must contain valid files

### Cover Image
- Max size: 5MB
- Allowed types: .jpg, .jpeg, .png, .webp
- Recommended dimensions: 1200x630px (for SEO)
- Aspect ratio: 1.91:1

---

## Business Logic Validations

### Template Submission
- User must have CREATOR role
- Cannot submit duplicate (same title by same creator)
- File must be uploaded to Supabase Storage before creating record

### Template Purchase
- Template must be APPROVED status
- User cannot purchase own template
- Free templates don't require payment
- Paid templates require Stripe Checkout

### Template Update/Delete
- Only allowed if status is PENDING
- Must be template owner
- Cannot update/delete APPROVED templates

### Admin Actions
- Only ADMIN role can approve/reject
- Cannot approve template without file
- Rejection should include reason (stored in metadata)

