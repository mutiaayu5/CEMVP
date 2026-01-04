import { Resend } from 'resend'

// Initialize Resend only if API key is available (allows build to succeed without it)
export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@createconomy.com'

// Helper to check if email is configured
export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY && !!resend
}

