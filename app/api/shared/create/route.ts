import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ payload: z.unknown(), isPublic: z.boolean().default(false), expiresAt: z.string().datetime().optional() });

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const slug = `s_${crypto.randomUUID().slice(0, 8)}`;
  const shared = await prisma.sharedView.create({
    data: {
      userId: user.userId,
      slug,
      payload: parsed.data.payload as Prisma.InputJsonValue,
      isPublic: parsed.data.isPublic,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null
    }
  });

  return ok({ shared }, 201);
}
