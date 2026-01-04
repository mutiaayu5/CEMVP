import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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

    const { passwordSet } = await request.json()

    // Update profile to mark password as set
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        passwordSet: passwordSet === true,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Password status updated',
    })
  } catch (error) {
    console.error('Error setting password status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

