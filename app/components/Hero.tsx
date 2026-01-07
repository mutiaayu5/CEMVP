import WaitlistForm from './WaitlistForm'

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[80vh] md:min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-amber-100 to-amber-50 dark:from-gray-900 dark:to-gray-800 px-4 py-20 transition-colors">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="mb-8 inline-block">
          <div className="px-4 py-2 bg-accent-50 dark:bg-accent-900/30 rounded-full border border-accent-300 dark:border-accent-700 text-sm font-medium text-accent-700 dark:text-accent-400">
            🚀 Coming Soon
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 text-gray-900 dark:text-white">
          AI Workflow
          <br />
          Marketplace
        </h1>

        {/* Subtitle */}
        <div className="mb-8">
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light">
            Join innovators building the future of automation
          </p>
        </div>

        {/* Waitlist Form */}
        <div className="max-w-2xl mx-auto">
          <WaitlistForm />
        </div>

        {/* Supporting Text */}
        <p className="mt-8 text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Discover, share, and monetize AI-powered workflows.
          <br className="hidden sm:inline" />
          Be the first to know when we launch.
        </p>
      </div>
    </section>
  )
}
