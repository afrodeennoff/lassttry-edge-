import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ name: z.string().min(1) });

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const tags = await prisma.tag.findMany({ where: { userId: user.userId }, orderBy: { name: "asc" } });
  return ok({ tags });
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);
  const tag = await prisma.tag.create({ data: { userId: user.userId, name: parsed.data.name } });
  return ok({ tag }, 201);
}
