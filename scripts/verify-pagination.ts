
// scripts/verify-pagination.ts
import { getTradesAction } from '../server/database'
import { prisma } from '../lib/prisma'

async function main() {
    const userId = 'test-pagination-user'

    console.log('Cleaning up old test data...')
    await prisma.trade.deleteMany({ where: { userId } })

    console.log('Seeding 105 trades...')
    const trades = Array.from({ length: 105 }).map((_, i) => ({
        userId,
        accountNumber: 'ACC123',
        instrument: `TEST-${i}`,
        entryPrice: 100 + i,
        closePrice: 110 + i,
        entryDate: new Date().toISOString(),
        closeDate: new Date().toISOString(),
        quantity: 1,
        pnl: 10,
        commission: 2,
        side: 'LONG'
    }))

    // Seed directly via raw prisma to avoid testing saveTradesAction yet
    await prisma.trade.createMany({ data: trades })

    console.log('Testing Page 1 (Expected 50 trades)...')
    const page1 = await getTradesAction(userId, 1, 50, true)
    console.log(`Page 1 count: ${page1.trades.length}`)

    if (page1.trades.length !== 50) {
        console.error('FAIL: Page 1 should have 50 trades')
        process.exit(1)
    }

    console.log('Testing Page 3 (Expected 5 trades)...')
    const page3 = await getTradesAction(userId, 3, 50, true)
    console.log(`Page 3 count: ${page3.trades.length}`)

    if (page3.trades.length !== 5) {
        console.error(`FAIL: Page 3 should have 5 trades, got ${page3.trades.length}`)
        process.exit(1)
    }

    console.log('Testing Metadata...')
    if (page1.metadata.total !== 105) {
        console.error(`FAIL: Total should be 105, got ${page1.metadata.total}`)
        process.exit(1)
    }

    console.log('SUCCESS: Pagination logic valid.')

    // Cleanup
    await prisma.trade.deleteMany({ where: { userId } })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
