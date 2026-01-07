import Header from './components/Header'
import Hero from './components/Hero'
import BlogSection from './components/BlogSection'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-amber-50 dark:bg-gray-900 transition-colors">
      <Header />
      <Hero />
      <BlogSection />
    </main>
  )
}

