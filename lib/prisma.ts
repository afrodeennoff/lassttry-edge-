import { PrismaClient } from '@/prisma/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: pg.Pool | undefined
}

const forceIPv4ConnectionString = (connectionString: string): string => {
  if (!connectionString) return ''
  try {
    const url = new URL(connectionString)

    if (url.hostname.includes(':')) {
      return connectionString
    }

    const family = 4
    const separator = connectionString.includes('?') ? '&' : '?'
    return `${connectionString}${separator}family=${family}`
  } catch (error) {
    return connectionString
  }
}

// Runtime should prefer pooled DATABASE_URL (Supabase pooler).
// DIRECT_URL is intended for migrations/admin operations.
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || ''
const parsedPoolMax = Number.parseInt(process.env.PG_POOL_MAX ?? '', 10)
const poolMax = Number.isFinite(parsedPoolMax) && parsedPoolMax > 0 ? parsedPoolMax : 5

const poolConfig: pg.PoolConfig = {
  connectionString: forceIPv4ConnectionString(connectionString),
  max: poolMax,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
}

const pool = globalForPrisma.pool ?? new pg.Pool(poolConfig)

pool.on('error', (err) => {
  console.error('[Prisma] Unexpected error on idle client', err)
})

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
if (process.env.NODE_ENV !== 'production') globalForPrisma.pool = pool
