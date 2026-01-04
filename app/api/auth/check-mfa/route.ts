import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
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
        mfaEnabled: true,
        mfaVerified: true,
        mfaPin: true,
        mfaPinExpires: true,
        role: true,
        passwordSet: true,
      }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Check if PIN is expired
    const isPinExpired = profile.mfaPinExpires ? new Date() > profile.mfaPinExpires : true

    return NextResponse.json({
      mfaEnabled: profile.mfaEnabled,
      mfaVerified: profile.mfaVerified,
      requiresMfa: profile.mfaEnabled && !profile.mfaVerified,
      pinExpired: isPinExpired,
      needsPasswordSetup: !profile.passwordSet && profile.role === 'ADMIN',
      role: profile.role,
    })
  } catch (error) {
    console.error('Error checking MFA:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

