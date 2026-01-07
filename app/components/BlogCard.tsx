import Image from 'next/image'
import Link from 'next/link'

interface BlogCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string
    featured_image: string
    author_name: string
    author_avatar: string
    read_time: number
    category: 'Stories' | 'News'
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group cursor-pointer block">
      {/* Featured Image */}
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-amber-100 dark:bg-gray-800">
        <Image
          src={post.featured_image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-3 pt-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            <Image
              src={post.author_avatar}
              alt={post.author_name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{post.author_name}</span>
            <span>·</span>
            <span>{post.read_time} min read</span>
          </div>
        </div>
      </div>
    </article>
    </Link>
  )
}

