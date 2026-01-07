import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const count = await prisma.waitlistEmail.count()

    return NextResponse.json(
      {
        count,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Waitlist count error:', error)
    return NextResponse.json(
      {
        count: 0,
        error: 'Failed to fetch count',
      },
      { status: 500 }
    )
  }
}
