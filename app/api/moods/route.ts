import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ day: z.string().datetime(), score: z.number().int().min(1).max(10), notes: z.string().optional() });

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const moods = await prisma.mood.findMany({ where: { userId: user.userId }, orderBy: { day: "desc" }, take: 180 });
  return ok({ moods });
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const mood = await prisma.mood.create({
    data: { userId: user.userId, day: new Date(parsed.data.day), score: parsed.data.score, notes: parsed.data.notes }
  });
  return ok({ mood }, 201);
}
