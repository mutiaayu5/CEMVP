'use client'

import { useState } from 'react'
import { waitlistEmailSchema } from '@/app/lib/validations'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [position, setPosition] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Client-side validation
    const validation = waitlistEmailSchema.safeParse({ email })
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid email')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to join waitlist')
        setLoading(false)
        return
      }

      // Success
      setSuccess(true)
      setPosition(data.position)
      setEmail('')

      // Dispatch event for counter to refresh
      window.dispatchEvent(new Event('waitlist-updated'))
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full mb-4">
          <svg
            className="w-5 h-5 text-green-600 dark:text-green-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-700 dark:text-green-300 font-medium">
            You're on the list!
          </span>
        </div>
        {position && (
          <p className="text-gray-600 dark:text-gray-400">
            You're <span className="font-bold text-gray-900 dark:text-white">#{position}</span> in line
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-6 py-4 text-lg rounded-full border border-amber-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 text-lg font-medium text-white bg-accent-600 dark:bg-accent-500 rounded-full hover:bg-accent-700 dark:hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Joining...' : 'Join Waitlist'}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-600 dark:text-red-400 text-sm text-center">{error}</div>
      )}
    </form>
  )
}
