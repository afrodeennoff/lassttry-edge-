import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail } from "@/lib/http";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const events = await prisma.processedWebhook.findMany({
    where: { userId: user.userId, eventType: { startsWith: "rithmic." } },
    orderBy: { processedAt: "desc" },
    take: 50
  });
  return ok({ synchronizations: events });
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const event = await prisma.processedWebhook.create({
    data: {
      userId: user.userId,
      provider: "WHOP",
      eventId: `rithmic_${crypto.randomUUID()}`,
      eventType: "rithmic.sync",
      payload: { status: "completed", at: new Date().toISOString() }
    }
  });

  return ok({ synchronization: event }, 201);
}
