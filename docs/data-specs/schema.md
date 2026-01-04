# Data Model Specifications

This document defines the database schema specifications that map to Prisma schema.

## Model: Profile

**Table**: `profiles`

**Description**: User profiles linked to Supabase auth.users with role-based access and MFA support

**Fields**:
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | uuid | Yes | uuid() | Primary Key | Profile ID |
| `userId` | string | Yes | - | Unique, Index | Links to Supabase auth.users.id |
| `email` | string | Yes | - | Unique, Index | User email |
| `username` | string | No | null | Unique, Index | Username from OAuth or custom |
| `fullName` | string | No | null | Max 200 chars | User's full name |
| `firstName` | string | No | null | Max 100 chars | First name from OAuth |
| `lastName` | string | No | null | Max 100 chars | Last name from OAuth |
| `avatarUrl` | string | No | null | Valid URL | Avatar image URL |
| `phone` | string | No | null | Valid phone format | Phone number |
| `role` | enum | Yes | USER | Index | UserRole: USER, SELLER, ADMIN |
| `mfaEnabled` | boolean | Yes | false | - | MFA enabled status |
| `mfaPin` | string | No | null | Encrypted, 6 digits | PIN code for MFA |
| `mfaPinExpires` | datetime | No | null | - | PIN expiration (24 hours) |
| `mfaVerified` | boolean | Yes | false | - | MFA verification status |
| `passwordSet` | boolean | Yes | false | - | Whether password has been set |
| `createdAt` | datetime | Yes | now() | - | Creation timestamp |
| `updatedAt` | datetime | Yes | auto | - | Last update timestamp |

**Relations**:
- `oauthAccounts` → OAuthAccount[] (one-to-many)
- `sellerInfo` → SellerInfo? (one-to-one, if SELLER role)
- `adminInfo` → AdminInfo? (one-to-one, if ADMIN role)
- `templates` → Template[] (one-to-many, creator)

**Indexes**:
- Primary: `id`
- Unique: `userId`, `email`, `username`
- Index: `role`

**Role Auto-Detection**:
- Default: `USER`
- Can be set based on email domain, invitation, or admin assignment
- SELLER: Can sell templates (requires Stripe Connect setup)
- ADMIN: Can manage platform (approve templates, manage users)

---

## Model: OAuthAccount

**Table**: `oauth_accounts`

**Description**: OAuth provider account information from social media platforms

**Fields**:
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | uuid | Yes | uuid() | Primary Key | OAuth account ID |
| `profileId` | uuid | Yes | - | Foreign Key, Index | Profile ID |
| `provider` | enum | Yes | - | Unique with providerId | OAuthProvider: GOOGLE, GITHUB, AZURE, APPLE, EMAIL |
| `providerId` | string | Yes | - | Unique with provider | Unique ID from provider |
| `providerEmail` | string | No | null | - | Email from provider |
| `providerUsername` | string | No | null | - | Username from provider |
| `accessToken` | text | No | null | Encrypted | OAuth access token |
| `refreshToken` | text | No | null | Encrypted | OAuth refresh token |
| `expiresAt` | datetime | No | null | - | Token expiration |
| `providerData` | json | No | null | - | All additional data from provider |
| `createdAt` | datetime | Yes | now() | - | Creation timestamp |
| `updatedAt` | datetime | Yes | auto | - | Last update timestamp |

**Relations**:
- `profile` → Profile (many-to-one, required, cascade delete)

**Indexes**:
- Primary: `id`
- Unique: `(provider, providerId)`
- Index: `profileId`, `provider`

**Provider Data (JSON)**:
Stores all information from OAuth providers:
- Google: `given_name`, `family_name`, `picture`, `locale`, etc.
- GitHub: `login`, `avatar_url`, `bio`, `company`, `location`, etc.
- Microsoft/Azure: `name`, `preferred_username`, `oid`, etc.
- Apple: `name`, `email`, `sub`, etc.

---

## Model: SellerInfo

**Table**: `seller_info`

**Description**: Additional information for users with SELLER role

**Fields**:
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | uuid | Yes | uuid() | Primary Key | Seller info ID |
| `profileId` | uuid | Yes | - | Unique, Foreign Key | Profile ID |
| `businessName` | string | No | null | Max 200 chars | Business name |
| `businessEmail` | string | No | null | Valid email | Business email |
| `businessPhone` | string | No | null | Valid phone | Business phone |
| `businessWebsite` | string | No | null | Valid URL | Business website |
| `taxId` | string | No | null | - | Tax ID for payments |
| `stripeAccountId` | string | No | null | Unique | Stripe Connect account ID |
| `stripeAccountStatus` | string | No | null | - | Stripe account status |
| `totalEarnings` | decimal(10,2) | Yes | 0 | Min 0 | Total earnings |
| `totalSales` | integer | Yes | 0 | Min 0 | Total sales count |
| `rating` | decimal(3,2) | No | null | 0-5 | Average rating |
| `reviewCount` | integer | Yes | 0 | Min 0 | Number of reviews |
| `verified` | boolean | Yes | false | - | Seller verification status |
| `verifiedAt` | datetime | No | null | - | Verification timestamp |
| `createdAt` | datetime | Yes | now() | - | Creation timestamp |
| `updatedAt` | datetime | Yes | auto | - | Last update timestamp |

**Relations**:
- `profile` → Profile (one-to-one, required, cascade delete)

**Indexes**:
- Primary: `id`
- Unique: `profileId`, `stripeAccountId`

---

## Model: AdminInfo

**Table**: `admin_info`

**Description**: Additional information for users with ADMIN role

**Fields**:
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | uuid | Yes | uuid() | Primary Key | Admin info ID |
| `profileId` | uuid | Yes | - | Unique, Foreign Key | Profile ID |
| `permissions` | string[] | Yes | [] | - | Array of permission strings |
| `templatesApproved` | integer | Yes | 0 | Min 0 | Templates approved count |
| `templatesRejected` | integer | Yes | 0 | Min 0 | Templates rejected count |
| `usersManaged` | integer | Yes | 0 | Min 0 | Users managed count |
| `lastActivityAt` | datetime | No | null | - | Last activity timestamp |
| `createdAt` | datetime | Yes | now() | - | Creation timestamp |
| `updatedAt` | datetime | Yes | auto | - | Last update timestamp |

**Relations**:
- `profile` → Profile (one-to-one, required, cascade delete)

**Indexes**:
- Primary: `id`
- Unique: `profileId`

**Permissions**:
- `manage_templates` - Can approve/reject templates
- `manage_users` - Can manage user accounts
- `manage_sellers` - Can manage seller accounts
- `view_analytics` - Can view platform analytics
- `manage_settings` - Can manage platform settings

---

## Model: Template

**Table**: `templates`

**Description**: Core marketplace asset - automation templates

**Fields**:
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | uuid | Yes | uuid() | Primary Key | Template ID |
| `title` | string | Yes | - | Max 200 chars, Index | Template title |
| `slug` | string | Yes | - | Unique, Index | URL-friendly identifier |
| `description` | text | No | null | Max 5000 chars | Template description |
| `price` | decimal(10,2) | Yes | 0 | Min 0, Max 9999.99 | Price in USD |
| `currency` | string | Yes | "USD" | Max 3 chars | Currency code |
| `category` | string | Yes | - | Index | Category name |
| `toolStack` | string[] | Yes | [] | Min 1, Max 10 items | Array of tool names |
| `complexity` | enum | Yes | MEDIUM | - | Complexity: LOW, MEDIUM, HIGH |
| `status` | enum | Yes | PENDING | Index | Status: PENDING, APPROVED, REJECTED |
| `views` | integer | Yes | 0 | Min 0 | View count |
| `downloads` | integer | Yes | 0 | Min 0 | Download count |
| `likes` | integer | Yes | 0 | Min 0 | Like count |
| `createdAt` | datetime | Yes | now() | - | Creation timestamp |
| `updatedAt` | datetime | Yes | auto | - | Last update timestamp |
| `creatorId` | uuid | Yes | - | Foreign Key, Index | Creator profile ID |

**Relations**:
- `creator` → Profile (many-to-one, required)
- `versions` → TemplateVersion[] (one-to-many)
- `interactions` → Interaction[] (one-to-many)

**Indexes**:
- Primary: `id`
- Unique: `slug`
- Index: `category`, `status`, `creatorId`

**Validation Rules**:
- `slug` must be URL-safe (lowercase, hyphens only)
- `price` must be >= 0
- `toolStack` must have at least 1 item
- `category` must be one of: Marketing, Finance, Dev, HR, Sales, Other

---

## Model: TemplateVersion

**Table**: `template_versions`

**Description**: Version control for templates

**Fields**:
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | uuid | Yes | uuid() | Primary Key | Version ID |
| `templateId` | uuid | Yes | - | Foreign Key, Index | Template ID |
| `versionNumber` | string | Yes | - | Format: "X.Y" | Version number (e.g., "1.0") |
| `fileUrl` | string | Yes | - | Valid URL | Link to Supabase Storage |
| `changelog` | text | No | null | Max 2000 chars | Version changelog |
| `createdAt` | datetime | Yes | now() | - | Creation timestamp |

**Relations**:
- `template` → Template (many-to-one, required, cascade delete)

**Indexes**:
- Primary: `id`
- Unique: `(templateId, versionNumber)`
- Index: `templateId`

**Validation Rules**:
- `versionNumber` must match pattern: `^\d+\.\d+$` (e.g., "1.0", "2.5")
- `fileUrl` must be valid Supabase Storage URL

---

## Model: Interaction

**Table**: `interactions`

**Description**: User interactions with templates (views, downloads, likes)

**Fields**:
| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | uuid | Yes | uuid() | Primary Key | Interaction ID |
| `templateId` | uuid | Yes | - | Foreign Key, Index | Template ID |
| `userId` | string | No | null | Index | User ID (nullable for anonymous) |
| `type` | enum | Yes | - | - | InteractionType: VIEW, DOWNLOAD, LIKE |
| `createdAt` | datetime | Yes | now() | - | Creation timestamp |

**Relations**:
- `template` → Template (many-to-one, required, cascade delete)

**Indexes**:
- Primary: `id`
- Unique: `(templateId, userId, type)`
- Index: `templateId`, `userId`

**Validation Rules**:
- `userId` can be null for anonymous interactions
- Same user cannot have duplicate interaction of same type for same template

---

## Enums

### UserRole
- `USER` - Regular user who can purchase/download templates
- `SELLER` - User who can upload and sell templates
- `ADMIN` - User who can manage platform (approve templates, manage users)

### OAuthProvider
- `GOOGLE` - Google OAuth
- `GITHUB` - GitHub OAuth
- `AZURE` - Microsoft/Azure OAuth
- `APPLE` - Apple OAuth
- `EMAIL` - Email/password authentication

### Complexity
- `LOW` - Simple templates, easy to use
- `MEDIUM` - Moderate complexity
- `HIGH` - Complex templates requiring advanced knowledge

### TemplateStatus
- `PENDING` - Awaiting admin review
- `APPROVED` - Published and visible
- `REJECTED` - Rejected by admin

### InteractionType
- `VIEW` - Template viewed
- `DOWNLOAD` - Template downloaded
- `LIKE` - Template liked

---

## MFA (Multi-Factor Authentication) - PIN-based

**Implementation**:
- Uses 6-digit PIN codes sent via email (Resend)
- PIN stored encrypted in database
- PIN expires after 24 hours
- MFA verification required for all admin logins

**Flow**:
1. Admin logs in for first time → PIN generated and sent via email
2. Admin receives email with PIN and password setup link
3. Admin sets password → Can log in
4. On login → Check if MFA enabled
5. If enabled → Request MFA PIN
6. Admin enters PIN from email → Verify PIN
7. If valid → Allow access

**PIN Generation**:
- 6-digit numeric PIN (000000-999999)
- Generated randomly
- Expires 24 hours after generation
- Can be resent via email

**First-Time Admin Setup**:
- Admin email: `developer@createconomy.com`
- Automatically set as ADMIN role
- MFA automatically enabled
- Email sent with PIN and password setup link
