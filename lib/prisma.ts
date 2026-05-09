import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Singleton pattern — prevents exhausting the Supabase connection pool
// on Next.js hot reloads in development.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
  // Append pooler-friendly params if not already set
  const url = process.env.DATABASE_URL ?? ''
  const connectionString = url.includes('connection_limit') ? url
    : url + (url.includes('?') ? '&' : '?') + 'connection_limit=5&pool_timeout=20'

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
