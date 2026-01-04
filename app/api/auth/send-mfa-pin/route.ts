import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { generateMFAPin, getPinExpiration } from '@/lib/auth/mfa'
import { resend, FROM_EMAIL, isEmailConfigured } from '@/lib/email/resend'
import { getMfaPinEmail } from '@/lib/email/templates'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        email: true,
        mfaEnabled: true,
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    if (!profile.mfaEnabled) {
      return NextResponse.json(
        { error: 'MFA not enabled for this account' },
        { status: 400 }
      )
    }

    // Generate new PIN
    const mfaPin = generateMFAPin()
    const expiresAt = getPinExpiration()

    // Update profile with new PIN
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        mfaPin: mfaPin, // In production, encrypt this
        mfaPinExpires: expiresAt,
        mfaVerified: false, // Reset verification
      }
    })

    // Send email with PIN
    if (!isEmailConfigured() || !resend) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const emailContent = getMfaPinEmail(mfaPin, profile.email)
    
    await resend.emails.send({
      from: FROM_EMAIL,
      to: profile.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    })

    return NextResponse.json({
      success: true,
      message: 'MFA PIN sent to your email',
    })
  } catch (error) {
    console.error('Error sending MFA PIN:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

