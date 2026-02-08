import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { summarizeTrades } from "@/lib/analytics";
import { assertAccountOwnership } from "@/lib/tenancy";
import { ok, fail } from "@/lib/http";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const accountId = req.nextUrl.searchParams.get("accountId");
  if (!accountId) return fail("accountId is required", 400);
  if (!(await assertAccountOwnership(user.userId, accountId))) return fail("forbidden", 403);

  const trades = await prisma.trade.findMany({ where: { accountId, userId: user.userId } });
  return ok({ accountId, summary: summarizeTrades(trades) });
}
