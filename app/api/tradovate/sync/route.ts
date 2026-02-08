import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail } from "@/lib/http";

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const sync = await prisma.processedWebhook.create({
    data: {
      userId: user.userId,
      provider: "WHOP",
      eventId: `tradovate_${crypto.randomUUID()}`,
      eventType: "tradovate.sync",
      payload: { status: "completed", at: new Date().toISOString() }
    }
  });

  return ok({ status: "completed", syncId: sync.id });
}
