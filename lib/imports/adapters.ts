import { z } from "zod";

export const providerSchema = z.enum([
  "tradovate",
  "rithmic",
  "ibkr_pdf",
  "ninjatrader",
  "atas",
  "ftmo",
  "topstep",
  "tradezella",
  "quantower",
  "manual",
  "etp",
  "thor",
  "unknown"
]);

export const providers = providerSchema.options;

export type NormalizedTrade = {
  instrument: string;
  side: "BUY" | "SELL";
  quantity: number;
  entryPrice: number;
  closePrice: number;
  entryAt: string;
  closeAt: string;
  commission: number;
};

export function normalizeUnknownRow(row: Record<string, unknown>): NormalizedTrade {
  const direction = String(row.side ?? row.direction ?? "BUY").toUpperCase();
  const side = direction.includes("S") ? "SELL" : "BUY";

  return {
    instrument: String(row.instrument ?? row.symbol ?? "UNKNOWN"),
    side,
    quantity: Number(row.quantity ?? row.qty ?? 1),
    entryPrice: Number(row.entryPrice ?? row.entry ?? 0),
    closePrice: Number(row.closePrice ?? row.exit ?? 0),
    entryAt: new Date(row.entryAt as string ?? Date.now()).toISOString(),
    closeAt: new Date(row.closeAt as string ?? Date.now()).toISOString(),
    commission: Number(row.commission ?? 0)
  };
}
