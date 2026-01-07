'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 dark:bg-gray-900 px-4 transition-colors">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We encountered an error while loading the page. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-accent-600 dark:bg-accent-500 text-white px-6 py-3 rounded-lg hover:bg-accent-700 dark:hover:bg-accent-600 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

