import { summarizeTrades, groupByInstrument, groupByTimeOfDay } from "@/lib/analytics";
import type { Trade } from "@prisma/client";

export function buildWeeklySummary(trades: Trade[]) {
  const summary = summarizeTrades(trades);
  const instruments = groupByInstrument(trades);
  const sessions = groupByTimeOfDay(trades);

  return {
    headline: summary.netPnl >= 0 ? "Positive week" : "Negative week",
    summary,
    instruments,
    sessions,
    recommendation:
      summary.netPnl >= 0
        ? "Keep position sizing stable and document repeated setups."
        : "Reduce size, focus on top-performing session, and review invalidated setups."
  };
}

export function supportTriage(message: string) {
  const lower = message.toLowerCase();
  const billing = ["invoice", "charge", "payment", "refund"].some((w) => lower.includes(w));
  const importIssue = ["import", "csv", "sync", "tradovate", "rithmic"].some((w) => lower.includes(w));

  const complexity = billing || importIssue ? "medium" : "low";
  return {
    category: billing ? "billing" : importIssue ? "import" : "general",
    complexity,
    escalateToHuman: complexity !== "low",
    response: billing
      ? "I can validate your subscription and latest transaction state."
      : importIssue
      ? "I can inspect your adapter mapping and normalization pipeline."
      : "I can help with setup and product guidance."
  };
}
