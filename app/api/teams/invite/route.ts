import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { assertTeamAdmin } from "@/lib/tenancy";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ teamId: z.string().min(1), email: z.string().email(), role: z.enum(["ADMIN", "TRADER", "ANALYST", "VIEWER"]).default("TRADER") });

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);
  if (!(await assertTeamAdmin(user.userId, parsed.data.teamId))) return fail("forbidden", 403);

  const invitation = await prisma.teamInvitation.create({
    data: {
      teamId: parsed.data.teamId,
      email: parsed.data.email,
      role: parsed.data.role,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000)
    }
  });

  return ok({ invitation }, 201);
}
