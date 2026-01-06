'use client'

import { useState } from 'react'
import blogData from '@/app/data/blog-posts.json'
import BlogCard from './BlogCard'

type Category = 'Stories' | 'News'

export default function BlogSection() {
  const [activeTab, setActiveTab] = useState<Category>('Stories')

  const filteredPosts = blogData.filter((post) => post.category === activeTab)

  return (
    <section className="py-20 px-4 bg-amber-50 dark:bg-gray-900 transition-colors" id="blog">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-center gap-8 mb-16 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('Stories')}
            className={`pb-4 px-2 text-base font-medium transition-colors relative ${
              activeTab === 'Stories'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            id="stories"
          >
            Stories
            {activeTab === 'Stories' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('News')}
            className={`pb-4 px-2 text-base font-medium transition-colors relative ${
              activeTab === 'News'
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            id="news"
          >
            News
            {activeTab === 'News' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500" />
            )}
          </button>
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No posts available in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
