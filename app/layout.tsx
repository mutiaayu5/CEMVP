import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CreatEconomy - AI Marketplace Coming Soon',
  description: 'Join the waitlist for CreatEconomy AI Workflow Marketplace. Discover, share, and monetize AI-powered workflows.',
  keywords: ['AI', 'workflow', 'marketplace', 'automation', 'AI tools'],
  authors: [{ name: 'CreatEconomy' }],
  openGraph: {
    title: 'CreatEconomy - AI Marketplace Coming Soon',
    description: 'Join the waitlist for CreatEconomy AI Workflow Marketplace. Discover, share, and monetize AI-powered workflows.',
    url: 'https://creatEconomy.com',
    siteName: 'CreatEconomy',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CreatEconomy - AI Marketplace Coming Soon',
    description: 'Join the waitlist for CreatEconomy AI Workflow Marketplace',
    creator: '@creatEconomy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CreatEconomy',
              description: 'AI Workflow Marketplace',
              url: 'https://creatEconomy.com',
              logo: 'https://creatEconomy.com/logo.png',
              sameAs: [
                'https://twitter.com/creatEconomy',
                'https://linkedin.com/company/creatEconomy',
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

