# Admin Setup Guide

## Admin Email Configuration

The email `developer@createconomy.com` is automatically configured as an **ADMIN** user.

## First-Time Admin Login Flow

When `developer@createconomy.com` logs in for the first time:

1. **Profile Created** - Admin profile is automatically created
2. **MFA Enabled** - MFA is automatically enabled
3. **PIN Generated** - A 6-digit PIN is generated
4. **Email Sent** - An email is sent with:
   - MFA PIN (6 digits)
   - Password setup link
   - Setup instructions

## Email Contents

The first-time admin email includes:

- **Welcome message**
- **Password setup link** - Click to set your password
- **MFA PIN** - 6-digit PIN for authentication
- **Security instructions**

## MFA PIN System

- **Format**: 6-digit numeric PIN
- **Expiration**: 24 hours
- **Usage**: Required every time admin logs in
- **Resend**: Can request new PIN via email

## Login Flow

1. Admin signs in (OAuth or email/password)
2. System checks if MFA is enabled
3. If enabled and not verified:
   - Redirects to `/auth/verify-mfa`
   - Admin enters 6-digit PIN
4. If PIN is valid:
   - MFA verified
   - Redirects to dashboard

## Password Setup

If password is not set:
- Admin is redirected to `/auth/setup-password`
- Sets password (min 8 characters)
- Password is saved in Supabase Auth

## Resending MFA PIN

If PIN is lost or expired:
- Click "Resend PIN" on verify MFA page
- New PIN is generated and sent via email
- Old PIN is invalidated

## Environment Variables Required

```env
# Resend Email
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Site URL (for password setup links)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Setup Steps

1. **Configure Resend:**
   - Sign up at resend.com
   - Get API key
   - Add to Vercel environment variables

2. **Set Site URL:**
   - Add `NEXT_PUBLIC_SITE_URL` to Vercel
   - Should be your production domain

3. **First Login:**
   - Admin logs in with `developer@createconomy.com`
   - Receives email with PIN and password setup link
   - Sets password
   - Uses PIN for future logins

## Security Notes

- PINs expire after 24 hours
- PINs should be encrypted in database (currently stored plain - add encryption)
- Password setup link includes user token
- MFA is required for all admin logins

