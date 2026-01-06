import { prisma } from './prisma'

/**
 * Check if an IP address has exceeded the rate limit (5 submissions per hour)
 * @param ipAddress - The IP address to check
 * @returns true if rate limit exceeded, false otherwise
 */
export async function checkRateLimit(ipAddress: string): Promise<boolean> {
  if (ipAddress === 'unknown') {
    return false // Don't rate limit if we can't identify IP
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  
  const count = await prisma.waitlistEmail.count({
    where: {
      ip_address: ipAddress,
      created_at: {
        gte: oneHourAgo,
      },
    },
  })

  return count >= 5
}

/**
 * Get client IP address from request headers
 * @param headers - Request headers object
 * @returns IP address string or 'unknown'
 */
export function getClientIP(headers: Headers): string {
  // Try x-forwarded-for first (Vercel provides this)
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  // Fallback to x-real-ip
  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  return 'unknown'
}

