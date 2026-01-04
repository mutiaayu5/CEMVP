"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function CheckMFARedirectPage() {
  const router = useRouter()

  useEffect(() => {
    const checkMFA = async () => {
      try {
        const response = await fetch('/api/auth/check-mfa')
        if (response.ok) {
          const data = await response.json()
          
          if (data.requiresMfa) {
            // Redirect to MFA verification
            router.push('/auth/verify-mfa')
            return
          }
          
          if (data.needsPasswordSetup) {
            // Redirect to password setup
            router.push('/auth/setup-password')
            return
          }
        }
        
        // No MFA required, go to dashboard
        router.push('/dashboard')
      } catch (error) {
        // On error, go to dashboard
        router.push('/dashboard')
      }
    }

    checkMFA()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#D97706]" />
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    </div>
  )
}

