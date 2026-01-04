/**
 * Role Detection Utility
 * Auto-detects user role based on various criteria
 */

export type UserRole = 'USER' | 'SELLER' | 'ADMIN'

interface RoleDetectionConfig {
  adminEmailDomains?: string[]
  adminEmails?: string[]
  sellerEmailDomains?: string[]
  defaultRole?: UserRole
}

const defaultConfig: RoleDetectionConfig = {
  adminEmailDomains: ['createconomy.com'], // Company domain
  adminEmails: ['developer@createconomy.com'], // Admin email
  sellerEmailDomains: [],
  defaultRole: 'USER',
}

/**
 * Detect user role based on email and other criteria
 */
export function detectUserRole(
  email: string,
  config: RoleDetectionConfig = defaultConfig
): UserRole {
  const mergedConfig = { ...defaultConfig, ...config }
  
  // Check for admin
  if (mergedConfig.adminEmails?.includes(email.toLowerCase())) {
    return 'ADMIN'
  }
  
  const emailDomain = email.split('@')[1]?.toLowerCase()
  if (emailDomain && mergedConfig.adminEmailDomains?.includes(emailDomain)) {
    return 'ADMIN'
  }
  
  // Check for seller
  if (emailDomain && mergedConfig.sellerEmailDomains?.includes(emailDomain)) {
    return 'SELLER'
  }
  
  // Default to USER
  return mergedConfig.defaultRole || 'USER'
}

/**
 * Check if user should be prompted for role selection
 */
export function shouldPromptRoleSelection(email: string): boolean {
  // For now, always default to USER
  // Can be customized to prompt for role selection
  return false
}

