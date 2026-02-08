import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/http";

export async function POST() {
  const soon = new Date(Date.now() + 72 * 3600 * 1000);
  const subscriptions = await prisma.subscription.findMany({ where: { currentPeriodEnd: { lte: soon }, status: "ACTIVE" }, take: 1000 });

  const run = await prisma.jobRun.create({
    data: {
      name: "renewal-notice",
      status: "SUCCEEDED",
      startedAt: new Date(),
      finishedAt: new Date(),
      details: { notifications: subscriptions.length }
    }
  });

  return ok({ run, count: subscriptions.length });
}
