import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/auth/check-mfa-redirect'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/auth/signin?error=auth_failed', requestUrl.origin))
    }

    // Create or update profile with OAuth data
    if (data.user) {
      const user = data.user
      
      // Get OAuth provider info from user metadata
      const provider = user.app_metadata?.provider as string || 'email'
      const providerData = user.user_metadata || {}
      
      // Determine role (auto-detect or default to USER)
      let role: 'USER' | 'SELLER' | 'ADMIN' = 'USER'
      
      // Auto-detect role based on email domain or other criteria
      // Import role detection utility
      const { detectUserRole } = await import('@/lib/auth/role-detection')
      role = detectUserRole(user.email || '')
      
      // Check if profile exists
      let existingProfile;
      try {
        existingProfile = await prisma.profile.findUnique({
          where: { userId: user.id },
          include: { oauthAccounts: true }
        })
      } catch (dbError) {
        console.error('Error checking existing profile:', dbError)
        // Continue to create new profile if query fails
        existingProfile = null
      }

      if (existingProfile) {
        // Update existing profile
        await prisma.profile.update({
          where: { userId: user.id },
          data: {
            email: user.email || existingProfile.email,
            username: providerData.preferred_username || providerData.user_name || providerData.username || existingProfile.username,
            fullName: providerData.full_name || providerData.name || existingProfile.fullName,
            firstName: providerData.given_name || providerData.first_name || existingProfile.firstName,
            lastName: providerData.family_name || providerData.last_name || existingProfile.lastName,
            avatarUrl: providerData.avatar_url || providerData.picture || providerData.photoURL || existingProfile.avatarUrl,
            phone: providerData.phone || existingProfile.phone,
            updatedAt: new Date(),
          }
        })

        // Update or create OAuth account
        if (provider !== 'email') {
          const providerUpper = provider.toUpperCase()
          let providerEnum: 'GOOGLE' | 'GITHUB' | 'AZURE' | 'APPLE' = 'GOOGLE'
          if (providerUpper === 'GITHUB') providerEnum = 'GITHUB'
          else if (providerUpper === 'AZURE' || providerUpper === 'MICROSOFT') providerEnum = 'AZURE'
          else if (providerUpper === 'APPLE') providerEnum = 'APPLE'
          else providerEnum = 'GOOGLE'
          
          const providerId = user.app_metadata?.provider_id || user.id

          await prisma.oAuthAccount.upsert({
            where: {
              provider_providerId: {
                provider: providerEnum,
                providerId: providerId,
              }
            },
            update: {
              providerEmail: user.email || undefined,
              providerUsername: providerData.preferred_username || providerData.user_name || providerData.username,
              providerData: providerData as any,
              updatedAt: new Date(),
            },
            create: {
              profileId: existingProfile.id,
              provider: providerEnum,
              providerId: providerId,
              providerEmail: user.email || undefined,
              providerUsername: providerData.preferred_username || providerData.user_name || providerData.username,
              providerData: providerData as any,
            }
          })
        }
      } else {
        // Create new profile
        const newProfile = await prisma.profile.create({
          data: {
            userId: user.id,
            email: user.email!,
            username: providerData.preferred_username || providerData.user_name || providerData.username,
            fullName: providerData.full_name || providerData.name,
            firstName: providerData.given_name || providerData.first_name,
            lastName: providerData.family_name || providerData.last_name,
            avatarUrl: providerData.avatar_url || providerData.picture || providerData.photoURL,
            phone: providerData.phone,
            role: role,
          }
        })

        // Create OAuth account if not email
        if (provider !== 'email') {
          const providerUpper = provider.toUpperCase()
          let providerEnum: 'GOOGLE' | 'GITHUB' | 'AZURE' | 'APPLE' = 'GOOGLE'
          if (providerUpper === 'GITHUB') providerEnum = 'GITHUB'
          else if (providerUpper === 'AZURE' || providerUpper === 'MICROSOFT') providerEnum = 'AZURE'
          else if (providerUpper === 'APPLE') providerEnum = 'APPLE'
          else providerEnum = 'GOOGLE'
          
          const providerId = user.app_metadata?.provider_id || user.id

          await prisma.oAuthAccount.create({
            data: {
              profileId: newProfile.id,
              provider: providerEnum,
              providerId: providerId,
              providerEmail: user.email || undefined,
              providerUsername: providerData.preferred_username || providerData.user_name || providerData.username,
              providerData: providerData as any,
            }
          })
        }

        // Create role-specific info if needed
        if (role === 'SELLER') {
          await prisma.sellerInfo.create({
            data: {
              profileId: newProfile.id,
            }
          })
        } else if (role === 'ADMIN') {
          await prisma.adminInfo.create({
            data: {
              profileId: newProfile.id,
              permissions: ['manage_templates', 'manage_users', 'manage_sellers'], // Default admin permissions
            }
          })

          // For first-time admin login, enable MFA and send setup email
          const { generateMFAPin, getPinExpiration } = await import('@/lib/auth/mfa')
          const { resend, FROM_EMAIL, isEmailConfigured } = await import('@/lib/email/resend')
          const { getFirstTimeAdminEmail } = await import('@/lib/email/templates')
          
          const mfaPin = generateMFAPin()
          const expiresAt = getPinExpiration()
          const setupUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/setup-password?token=${user.id}`

          // Update profile with MFA PIN
          await prisma.profile.update({
            where: { id: newProfile.id },
            data: {
              mfaEnabled: true,
              mfaPin: mfaPin, // In production, encrypt this
              mfaPinExpires: expiresAt,
              passwordSet: false, // Password not set yet
            }
          })

          // Send first-time admin email (only if email is configured)
          if (isEmailConfigured() && resend) {
            try {
              const emailContent = getFirstTimeAdminEmail(mfaPin, setupUrl, user.email || '')
              await resend.emails.send({
                from: FROM_EMAIL,
                to: user.email!,
                subject: emailContent.subject,
                html: emailContent.html,
                text: emailContent.text,
              })
            } catch (emailError) {
              console.error('Error sending admin setup email:', emailError)
              // Don't fail the callback if email fails
            }
          } else {
            console.warn('Email service not configured. MFA PIN generated but not sent:', mfaPin)
            // In production, you might want to log this to a monitoring service
          }
        }
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}
