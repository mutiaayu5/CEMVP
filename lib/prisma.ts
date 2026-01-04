import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if DATABASE_URL is a dummy value (used during build)
const isDummyUrl = process.env.DATABASE_URL?.includes('dummy@localhost')

// Only create Prisma Client if DATABASE_URL is available and not dummy
export const prisma = (() => {
  if (!process.env.DATABASE_URL || isDummyUrl) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ DATABASE_URL is not set in production.')
      console.error('   Get it from: Supabase Dashboard > Settings > Database > Connection Pooling')
    }
    // Return a mock client that will throw helpful errors
    return {
      profile: {
        findUnique: () => Promise.reject(new Error('DATABASE_URL is not set. Get it from Supabase Dashboard > Settings > Database > Connection Pooling')),
        create: () => Promise.reject(new Error('DATABASE_URL is not set. Get it from Supabase Dashboard > Settings > Database > Connection Pooling')),
        update: () => Promise.reject(new Error('DATABASE_URL is not set. Get it from Supabase Dashboard > Settings > Database > Connection Pooling')),
      },
      oAuthAccount: {
        upsert: () => Promise.reject(new Error('DATABASE_URL is not set')),
        create: () => Promise.reject(new Error('DATABASE_URL is not set')),
      },
      sellerInfo: {
        create: () => Promise.reject(new Error('DATABASE_URL is not set')),
      },
      adminInfo: {
        create: () => Promise.reject(new Error('DATABASE_URL is not set')),
      },
    } as any
  }

  return globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
})()

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL && !isDummyUrl) {
  globalForPrisma.prisma = prisma as PrismaClient
}

