import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { summarizeTrades, groupByInstrument, groupByTimeOfDay } from "@/lib/analytics";
import { ok, fail } from "@/lib/http";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const trades = await prisma.trade.findMany({ where: { userId: user.userId }, take: 5000 });
  return ok({
    summary: summarizeTrades(trades),
    byInstrument: groupByInstrument(trades),
    bySession: groupByTimeOfDay(trades)
  });
}
