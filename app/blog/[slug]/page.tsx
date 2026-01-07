import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import blogData from '@/app/data/blog-posts.json'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featured_image: string
  category: 'Stories' | 'News'
  author_name: string
  author_avatar: string
  read_time: number
  published_at: string
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = blogData as BlogPost[]
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const posts = blogData as BlogPost[]
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  const publishedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="min-h-screen bg-amber-50 dark:bg-gray-900 transition-colors">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-50 bg-amber-50/95 backdrop-blur-sm dark:bg-gray-900/95 border-b border-amber-200 dark:border-gray-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Badge */}
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 rounded-full text-sm font-medium">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <Image
              src={post.author_avatar}
              alt={post.author_name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{post.author_name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={post.published_at}>{publishedDate}</time>
              <span>·</span>
              <span>{post.read_time} min read</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-12 bg-amber-100 dark:bg-gray-800">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-amber dark:prose-invert max-w-none">
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Since this is a coming soon page, we'll display a message */}
          <div className="my-12 p-8 bg-gradient-to-br from-accent-50 to-amber-50 dark:from-accent-900/20 dark:to-gray-800 rounded-lg border border-accent-200 dark:border-accent-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Full Article Coming Soon!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We're working hard to bring you detailed content about our AI workflow marketplace.
              This preview gives you a taste of what's to come.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Want to be the first to read our full articles and get exclusive updates?
            </p>
            <Link
              href="/#hero"
              className="inline-block px-6 py-3 bg-accent-600 dark:bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-700 dark:hover:bg-accent-600 transition-colors"
            >
              Join Our Waitlist
            </Link>
          </div>
        </div>

        {/* Back to Blog Link */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-500 font-medium transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Posts
          </Link>
        </div>
      </article>
    </main>
  )
}

