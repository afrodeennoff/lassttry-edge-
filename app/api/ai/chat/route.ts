import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { summarizeTrades } from "@/lib/analytics";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({
  message: z.string().min(1),
  scope: z.enum(["global", "account", "instrument"]).default("global"),
  accountId: z.string().optional(),
  instrument: z.string().optional()
});

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const where: Record<string, unknown> = { userId: user.userId };
  if (parsed.data.scope === "account" && parsed.data.accountId) where.accountId = parsed.data.accountId;
  if (parsed.data.scope === "instrument" && parsed.data.instrument) where.instrument = parsed.data.instrument;

  const trades = await prisma.trade.findMany({ where, orderBy: { closeAt: "desc" }, take: 200 });
  const summary = summarizeTrades(trades);
  const lower = parsed.data.message.toLowerCase();

  const response = lower.includes("risk")
    ? `Risk profile: win rate ${summary.winRate.toFixed(2)}%, avg RR ${summary.avgRiskReward.toFixed(2)}.`
    : lower.includes("improve")
    ? "Focus on setups with positive expectancy, and reduce size during low-performance sessions."
    : `You took ${summary.count} trades with net PnL ${summary.netPnl.toFixed(2)}.`;

  return ok({
    message: parsed.data.message,
    scope: parsed.data.scope,
    response,
    context: summary
  });
}
