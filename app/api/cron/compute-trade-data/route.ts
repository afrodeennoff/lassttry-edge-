import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/http";

export async function POST() {
  const run = await prisma.jobRun.create({ data: { name: "compute-trade-data", status: "RUNNING", startedAt: new Date() } });

  const trades = await prisma.trade.findMany({ take: 2000 });
  for (const trade of trades) {
    const riskReward = trade.entryPrice !== 0 ? Number((trade.closePrice / trade.entryPrice).toFixed(4)) : null;
    const efficiency = trade.quantity !== 0 ? Number((trade.pnl / trade.quantity).toFixed(4)) : null;
    await prisma.trade.update({ where: { id: trade.id }, data: { riskReward, efficiency } });
  }

  const finished = await prisma.jobRun.update({ where: { id: run.id }, data: { status: "SUCCEEDED", finishedAt: new Date(), details: { processed: trades.length } } });
  return ok({ run: finished });
}
