import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { waitlistEmailSchema } from '@/app/lib/validations'
import { checkRateLimit, getClientIP } from '@/app/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validation = waitlistEmailSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || 'Invalid email address',
          field: 'email',
        },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // Get client IP for rate limiting
    const clientIP = getClientIP(request.headers)

    // Check rate limit (5 submissions per hour per IP)
    // Note: This is a simplified version - actual IP tracking would need
    // a separate table or use request headers more effectively
    if (clientIP !== 'unknown') {
      const rateLimited = await checkRateLimit(clientIP)
      if (rateLimited) {
        return NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
            retryAfter: 3600, // 1 hour in seconds
          },
          { status: 429 }
        )
      }
    }

    // Check for duplicate email
    const existing = await prisma.waitlistEmail.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already registered',
        },
        { status: 409 }
      )
    }

    // Insert new email with IP address
    await prisma.waitlistEmail.create({
      data: { 
        email,
        ip_address: clientIP !== 'unknown' ? clientIP : null,
      },
    })

    // Calculate position (1-indexed)
    const totalCount = await prisma.waitlistEmail.count()
    const position = totalCount

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined the waitlist!',
        position,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist signup error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred. Please try again later.',
      },
      { status: 500 }
    )
  }
}
