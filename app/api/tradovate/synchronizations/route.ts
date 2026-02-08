import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail } from "@/lib/http";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const events = await prisma.processedWebhook.findMany({
    where: { userId: user.userId, eventType: { startsWith: "tradovate." } },
    orderBy: { processedAt: "desc" },
    take: 50
  });

  return ok({ synchronizations: events });
}
