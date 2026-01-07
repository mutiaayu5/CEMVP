export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 dark:bg-gray-900 transition-colors">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 dark:border-accent-400 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

