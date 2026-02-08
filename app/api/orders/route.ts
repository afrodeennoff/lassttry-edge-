import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({
  symbol: z.string().min(1),
  side: z.string().min(1),
  price: z.number(),
  quantity: z.number().int().positive(),
  status: z.string().default("FILLED"),
  tradeId: z.string().optional()
});

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const orders = await prisma.order.findMany({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
  return ok({ orders });
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const order = await prisma.order.create({ data: { ...parsed.data, userId: user.userId } });
  return ok({ order }, 201);
}
