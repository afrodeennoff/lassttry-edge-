import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";

export async function GET(_req: NextRequest, context: { params: Promise<unknown> }) {
  const { slug } = (await context.params) as { slug: string };
  const shared = await prisma.sharedView.findUnique({ where: { slug } });
  if (!shared) return fail("not found", 404);
  if (shared.expiresAt && shared.expiresAt.getTime() < Date.now()) return fail("expired", 410);

  await prisma.sharedView.update({ where: { slug }, data: { viewCount: { increment: 1 } } });
  return ok({ shared });
}
