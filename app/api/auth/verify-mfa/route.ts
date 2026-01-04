import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { isPinExpired } from '@/lib/auth/mfa'

export async function POST(request: Request) {
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

    const { pin } = await request.json()

    if (!pin) {
      return NextResponse.json(
        { error: 'MFA PIN is required' },
        { status: 400 }
      )
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        mfaEnabled: true,
        mfaPin: true,
        mfaPinExpires: true,
      }
    })

    if (!profile || !profile.mfaEnabled) {
      return NextResponse.json(
        { error: 'MFA not enabled' },
        { status: 400 }
      )
    }

    // Check if PIN exists and is not expired
    if (!profile.mfaPin || isPinExpired(profile.mfaPinExpires)) {
      return NextResponse.json(
        { error: 'MFA PIN has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify PIN
    if (profile.mfaPin !== pin) {
      return NextResponse.json(
        { error: 'Invalid MFA PIN' },
        { status: 400 }
      )
    }

    // Mark MFA as verified
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        mfaVerified: true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'MFA verified successfully',
    })
  } catch (error) {
    console.error('Error verifying MFA:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

