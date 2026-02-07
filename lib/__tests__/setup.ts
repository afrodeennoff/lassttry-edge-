import { beforeAll, afterAll, beforeEach } from 'vitest'
import { PrismaClient } from '@/prisma/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

let prisma: PrismaClient
let pool: pg.Pool

beforeAll(async () => {
  const connectionString = process.env.DATABASE_URL_TEST || process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL not configured')
  }

  pool = new pg.Pool({
    connectionString,
    max: 1,
  })

  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })

  global.prisma = prisma
  global.pool = pool
})

afterAll(async () => {
  await prisma.$disconnect()
  await pool.end()
})

beforeEach(async () => {
  const tables = [
    'PaymentTransaction',
    'Invoice',
    'Refund',
    'SubscriptionEvent',
    'PaymentMethod',
    'Promotion',
    'UsageMetric',
    'Subscription',
  ]

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE public."${table}" CASCADE;`)
    } catch (error) {
      console.warn(`Could not truncate table ${table}:`, error)
    }
  }
})

export { prisma }
