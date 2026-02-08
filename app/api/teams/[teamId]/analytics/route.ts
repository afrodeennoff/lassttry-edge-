import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail } from "@/lib/http";

export async function GET(req: NextRequest, context: { params: Promise<unknown> }) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const { teamId } = (await context.params) as { teamId: string };

  const membership = await prisma.teamMember.findFirst({ where: { teamId, userId: user.userId } });
  if (!membership) return fail("forbidden", 403);

  const members = await prisma.teamMember.findMany({ where: { teamId }, select: { userId: true } });
  const userIds = members.map((m) => m.userId);

  const trades = await prisma.trade.findMany({ where: { userId: { in: userIds } } });
  const netPnl = trades.reduce((s, t) => s + t.pnl, 0);

  return ok({ teamId, members: members.length, tradeCount: trades.length, netPnl });
}
