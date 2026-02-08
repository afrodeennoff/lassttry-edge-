import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { buildWeeklySummary } from "@/lib/ai/engine";
import { ok, fail } from "@/lib/http";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const to = new Date();
  const from = new Date(to.getTime() - 7 * 24 * 3600 * 1000);

  const trades = await prisma.trade.findMany({
    where: { userId: user.userId, closeAt: { gte: from, lte: to } },
    orderBy: { closeAt: "asc" }
  });

  return ok({ period: { from, to }, summary: buildWeeklySummary(trades) });
}
