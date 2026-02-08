import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ token: z.string().min(1) });

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const invite = await prisma.teamInvitation.findUnique({ where: { token: parsed.data.token } });
  if (!invite) return fail("invalid token", 404);
  if (invite.expiresAt.getTime() < Date.now()) return fail("expired", 410);

  await prisma.$transaction([
    prisma.teamMember.upsert({
      where: { teamId_userId: { teamId: invite.teamId, userId: user.userId } },
      update: { role: invite.role },
      create: { teamId: invite.teamId, userId: user.userId, role: invite.role }
    }),
    prisma.teamInvitation.update({ where: { token: parsed.data.token }, data: { status: "ACCEPTED" } })
  ]);

  return ok({ success: true });
}
