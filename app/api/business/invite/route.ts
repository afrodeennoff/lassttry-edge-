import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ businessId: z.string().min(1), email: z.string().email(), role: z.enum(["ADMIN", "TRADER", "ANALYST", "VIEWER"]).default("TRADER") });

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const admin = await prisma.businessMember.findFirst({ where: { businessId: parsed.data.businessId, userId: user.userId, role: "ADMIN" } });
  if (!admin) return fail("forbidden", 403);

  const invitation = await prisma.businessInvitation.create({
    data: {
      businessId: parsed.data.businessId,
      email: parsed.data.email,
      role: parsed.data.role,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000)
    }
  });

  return ok({ invitation }, 201);
}
