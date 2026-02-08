import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ title: z.string().min(1), description: z.string().min(1) });

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const notifications = await prisma.notification.findMany({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });
  return ok({ notifications });
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const notification = await prisma.notification.create({ data: { userId: user.userId, ...parsed.data } });
  return ok({ notification }, 201);
}
