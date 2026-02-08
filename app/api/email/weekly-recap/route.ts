import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { buildWeeklySummary } from "@/lib/ai/engine";
import { ok, fail } from "@/lib/http";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const from = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const trades = await prisma.trade.findMany({ where: { userId: user.userId, closeAt: { gte: from } } });
  return ok({ recap: buildWeeklySummary(trades) });
}
