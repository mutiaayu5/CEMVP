import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Add sample blog posts
  const blogPosts = [
    {
      title: 'Welcome to CreateConomy',
      slug: 'welcome-to-createconomy',
      excerpt: 'Building the future of AI workflows. Join us on this exciting journey as we revolutionize how creators work with AI.',
      category: 'Our Story',
      published_at: new Date('2024-01-15'),
    },
    {
      title: 'The Vision Behind CreateConomy',
      slug: 'vision-behind-createconomy',
      excerpt: 'Discover why we\'re building an AI workflow marketplace and how it will empower creators worldwide.',
      category: 'Our Story',
      published_at: new Date('2024-01-20'),
    },
    {
      title: 'Launch Announcement Coming Soon',
      slug: 'launch-announcement',
      excerpt: 'Exciting news! Our official launch is approaching. Be the first to know by joining our waitlist.',
      category: 'News',
      published_at: new Date('2024-01-25'),
    },
    {
      title: 'AI Workflows: The Future of Automation',
      slug: 'ai-workflows-future',
      excerpt: 'Explore how AI-powered workflows are transforming productivity and creativity across industries.',
      category: 'News',
      published_at: new Date('2024-02-01'),
    },
    {
      title: 'Meet the CreateConomy Team',
      slug: 'meet-the-team',
      excerpt: 'Get to know the passionate team building the next generation of AI workflow tools.',
      category: 'Our Story',
      published_at: new Date('2024-02-05'),
    },
    {
      title: 'Beta Program Opening Soon',
      slug: 'beta-program-opening',
      excerpt: 'Join our exclusive beta program and be among the first to experience CreateConomy.',
      category: 'News',
      published_at: new Date('2024-02-10'),
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
    console.log(`Created/Updated blog post: ${post.title}`)
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

