import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({
  number: z.string().min(1),
  provider: z.string().min(1),
  startingBalance: z.number().default(0),
  drawdown: z.number().nullable().optional(),
  target: z.number().nullable().optional(),
  groupId: z.string().optional()
});

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const accounts = await prisma.account.findMany({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
  return ok({ accounts });
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const body = await safeJson<unknown>(req);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail("invalid payload", 400);

  const account = await prisma.account.create({ data: { ...parsed.data, userId: user.userId } });
  return ok({ account }, 201);
}
