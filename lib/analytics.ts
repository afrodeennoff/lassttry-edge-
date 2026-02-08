import type { Trade } from "@prisma/client";

export function summarizeTrades(trades: Trade[]) {
  const count = trades.length;
  const netPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const wins = trades.filter((t) => t.pnl > 0).length;
  const losses = trades.filter((t) => t.pnl <= 0).length;
  const winRate = count === 0 ? 0 : wins / count;
  const avgPnl = count === 0 ? 0 : netPnl / count;
  const avgMae = count === 0 ? 0 : trades.reduce((s, t) => s + (t.mae ?? 0), 0) / count;
  const avgMfe = count === 0 ? 0 : trades.reduce((s, t) => s + (t.mfe ?? 0), 0) / count;
  const avgRiskReward = count === 0 ? 0 : trades.reduce((s, t) => s + (t.riskReward ?? 0), 0) / count;

  return { count, netPnl, wins, losses, winRate, avgPnl, avgMae, avgMfe, avgRiskReward };
}

export function groupByInstrument(trades: Trade[]) {
  const byInstrument: Record<string, number> = {};
  for (const trade of trades) {
    byInstrument[trade.instrument] = (byInstrument[trade.instrument] ?? 0) + trade.pnl;
  }
  return byInstrument;
}

export function groupByTimeOfDay(trades: Trade[]) {
  const buckets: Record<string, number> = { asia: 0, london: 0, ny: 0 };
  for (const trade of trades) {
    const hour = new Date(trade.entryAt).getUTCHours();
    if (hour < 7) buckets.asia += trade.pnl;
    else if (hour < 13) buckets.london += trade.pnl;
    else buckets.ny += trade.pnl;
  }
  return buckets;
}
