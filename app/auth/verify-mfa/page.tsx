"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Shield, Loader2, Mail, Construction } from "lucide-react"

const mfaSchema = z.object({
  pin: z.string().length(6, "PIN must be 6 digits").regex(/^\d+$/, "PIN must contain only numbers"),
})

type MfaFormValues = z.infer<typeof mfaSchema>

export default function VerifyMFAPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sendingPin, setSendingPin] = useState(false)

  const form = useForm<MfaFormValues>({
    resolver: zodResolver(mfaSchema),
    defaultValues: {
      pin: "",
    },
  })

  const onSubmit = async (values: MfaFormValues) => {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: values.pin }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Invalid PIN')
        setLoading(false)
        return
      }

      // MFA verified, redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleResendPin = async () => {
    setSendingPin(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/send-mfa-pin', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to send PIN')
      } else {
        setError(null)
        alert('MFA PIN sent to your email')
      }
    } catch (err) {
      setError("Failed to send PIN. Please try again.")
    } finally {
      setSendingPin(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md shadow-lg border-2 border-gray-200">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FFE5B4] flex items-center justify-center">
              <Shield className="h-8 w-8 text-[#D97706]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Verify Your Identity
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Enter the 6-digit PIN sent to your email
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      MFA PIN
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        disabled={loading}
                        className="h-11 border-2 focus:border-[#D97706] transition-colors text-center text-2xl tracking-widest"
                        onChange={(e) => {
                          // Only allow numbers
                          const value = e.target.value.replace(/\D/g, '')
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border-2 border-destructive/20 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-[#D97706] hover:bg-[#B45309] text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify PIN'
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              Didn't receive the PIN?
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#D97706] text-[#D97706] hover:bg-[#FFE5B4]"
              onClick={handleResendPin}
              disabled={sendingPin}
            >
              {sendingPin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend PIN
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

