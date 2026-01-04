/**
 * MFA (Multi-Factor Authentication) Utilities - PIN-based
 */

/**
 * Generate 6-digit MFA PIN
 */
export function generateMFAPin(): string {
  // Generate 6-digit PIN
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Check if PIN is expired
 */
export function isPinExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true
  return new Date() > expiresAt
}

/**
 * Check if MFA is required for user
 */
export function isMFARequired(mfaEnabled: boolean, mfaVerified: boolean): boolean {
  return mfaEnabled && !mfaVerified
}

/**
 * PIN expiration time (24 hours from now)
 */
export function getPinExpiration(): Date {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)
  return expiresAt
}
