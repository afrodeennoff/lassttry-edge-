import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { assertAccountOwnership } from "@/lib/tenancy";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ accountId: z.string().min(1), amount: z.number(), paidAt: z.string().datetime() });

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const payouts = await prisma.payout.findMany({ where: { userId: user.userId }, orderBy: { paidAt: "desc" } });
  return ok({ payouts });
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);
  if (!(await assertAccountOwnership(user.userId, parsed.data.accountId))) return fail("forbidden", 403);

  const payout = await prisma.payout.create({
    data: { ...parsed.data, userId: user.userId, paidAt: new Date(parsed.data.paidAt) }
  });
  return ok({ payout }, 201);
}
