'use client'

import WaitlistForm from './WaitlistForm'
import Image from 'next/image'

export default function Hero() {
  return (
    <section 
      id="hero" 
      className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 px-6 py-20 transition-colors overflow-hidden"
    >
      {/* Subtle background gradients for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/20 via-transparent to-transparent dark:from-indigo-900/10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left side - Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Badge */}
            <div className="mb-8 inline-block">
              <div className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-full border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm text-sm font-medium text-blue-700 dark:text-blue-300 shadow-sm">
                <span className="mr-2">✨</span>
                Coming Soon
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-serif font-bold mb-6 text-gray-900 dark:text-white leading-[1.1] tracking-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                AI Workflow
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>

            {/* Subtitle */}
            <div className="mb-10">
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                Join innovators building the future of automation
              </p>
            </div>

            {/* Waitlist Form */}
            <div className="max-w-xl mx-auto lg:mx-0">
              <WaitlistForm />
            </div>

            {/* Supporting Text */}
            <p className="mt-8 text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover, share, and monetize AI-powered workflows.
              <br className="hidden sm:inline" />
              Be the first to know when we launch.
            </p>
          </div>

          {/* Right side - Illustration */}
          <div className="flex-1 max-w-xl lg:max-w-2xl w-full flex items-center justify-center lg:justify-end">
            <div className="relative w-full aspect-square max-w-md lg:max-w-lg">
              <Image
                src="https://illustrations.popsy.co/amber/artificial-intelligence.svg"
                alt="AI Workflow Illustration"
                width={600}
                height={600}
                loading="lazy"
                priority={false}
                className="w-full h-auto drop-shadow-xl"
                onError={(e) => {
                  // Hide illustration gracefully if it fails to load (FR-015)
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
