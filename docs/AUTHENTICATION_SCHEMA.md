# Authentication & User Management Schema

## Overview

The database schema supports three user roles (USER, SELLER, ADMIN) with automatic role detection, MFA (Multi-Factor Authentication), and comprehensive OAuth provider data storage.

## Database Schema

### Core Tables

1. **`profiles`** - Main user profile table
2. **`oauth_accounts`** - OAuth provider account information
3. **`seller_info`** - Seller-specific data
4. **`admin_info`** - Admin-specific data

## User Roles

### USER (Default)
- Regular users who can browse and purchase/download templates
- Default role for all new signups
- No special permissions

### SELLER
- Can upload and sell templates
- Has Stripe Connect integration
- Tracks earnings, sales, ratings
- Requires verification

### ADMIN
- Can manage platform (approve templates, manage users)
- Has permission-based access control
- Tracks admin activity

## Role Auto-Detection

Roles are automatically detected based on:
- Email domain (configurable in `lib/auth/role-detection.ts`)
- Specific email addresses
- Default: USER

**Configuration:**
```typescript
// lib/auth/role-detection.ts
const config = {
  adminEmailDomains: ['yourcompany.com'],
  adminEmails: ['admin@example.com'],
  sellerEmailDomains: [],
  defaultRole: 'USER',
}
```

## OAuth Provider Data

All OAuth providers (Google, GitHub, Microsoft, Apple) store:
- Provider ID and username
- Email from provider
- Access/refresh tokens (encrypted)
- Complete provider metadata (JSON)

**Stored Data Examples:**
- Google: `given_name`, `family_name`, `picture`, `locale`
- GitHub: `login`, `avatar_url`, `bio`, `company`, `location`
- Microsoft: `name`, `preferred_username`, `oid`
- Apple: `name`, `email`, `sub`

## MFA (Multi-Factor Authentication)

### Features
- TOTP (Time-based One-Time Password) via authenticator apps
- Backup codes for account recovery
- MFA verification required for sensitive operations

### Flow
1. User enables MFA → Secret generated, QR code displayed
2. User scans QR code with authenticator app
3. User verifies with code → MFA enabled
4. On login → Check if MFA enabled
5. If enabled → Request MFA code
6. Verify code → Allow access

### API Endpoints
- `GET /api/auth/check-mfa` - Check MFA status
- `POST /api/auth/verify-mfa` - Verify MFA code

## Database Migration

To apply the schema changes:

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database (for development)
npm run prisma:push

# Or create migration (for production)
npm run prisma:migrate
```

## OAuth Callback Flow

1. User signs in with OAuth provider
2. Redirects to `/auth/callback`
3. Supabase exchanges code for session
4. Profile created/updated with OAuth data
5. OAuth account record created/updated
6. Role-specific info created if needed (SELLER/ADMIN)
7. Redirects to dashboard

## Profile Creation

When a user signs in (OAuth or email/password):
1. Check if profile exists (by `userId`)
2. If exists: Update with latest OAuth data
3. If new: Create profile with auto-detected role
4. Create OAuth account record (if OAuth)
5. Create role-specific info (if SELLER or ADMIN)

## MFA Setup

To enable MFA for a user:

```typescript
import { generateMFA } from '@/lib/auth/mfa'

const { secret, qrCodeUrl, backupCodes } = await generateMFA(profileId, email)

// Store secret and backup codes in database (encrypted)
await prisma.profile.update({
  where: { id: profileId },
  data: {
    mfaEnabled: true,
    mfaSecret: secret, // Should be encrypted
    mfaBackupCodes: backupCodes, // Should be encrypted
  }
})
```

## Security Considerations

1. **Encrypt sensitive data:**
   - MFA secrets
   - Backup codes
   - OAuth tokens

2. **Role-based access:**
   - Check user role before allowing actions
   - Verify MFA for sensitive operations

3. **OAuth tokens:**
   - Store encrypted
   - Refresh before expiration
   - Revoke on logout

## Example Queries

### Get user with all OAuth accounts
```typescript
const profile = await prisma.profile.findUnique({
  where: { userId: user.id },
  include: {
    oauthAccounts: true,
    sellerInfo: true,
    adminInfo: true,
  }
})
```

### Check if user needs MFA
```typescript
const profile = await prisma.profile.findUnique({
  where: { userId: user.id },
  select: {
    mfaEnabled: true,
    mfaVerified: true,
  }
})

const requiresMFA = profile.mfaEnabled && !profile.mfaVerified
```

### Get seller information
```typescript
const seller = await prisma.sellerInfo.findUnique({
  where: { profileId: profile.id },
  include: {
    profile: true,
  }
})
```

## Next Steps

1. **Run migration:**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

2. **Configure role detection:**
   - Update `lib/auth/role-detection.ts` with your domains

3. **Set up OAuth providers:**
   - Configure in Supabase dashboard
   - Add redirect URLs

4. **Implement MFA UI:**
   - Create MFA setup page
   - Create MFA verification page
   - Add MFA checks to protected routes

