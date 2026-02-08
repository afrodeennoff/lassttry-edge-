import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { assertTeamAdmin } from "@/lib/tenancy";
import { ok, fail } from "@/lib/http";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const teamId = req.nextUrl.searchParams.get("teamId");
  if (!teamId) return fail("teamId is required", 400);
  if (!(await assertTeamAdmin(user.userId, teamId))) return fail("forbidden", 403);

  const [subscriptions, txns, refunds] = await Promise.all([
    prisma.subscription.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.paymentTransaction.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.refund.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
  ]);

  return ok({ subscriptions, transactions: txns, refunds });
}
