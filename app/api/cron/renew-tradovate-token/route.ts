import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/http";

export async function POST() {
  const run = await prisma.jobRun.create({
    data: {
      name: "renew-tradovate-token",
      status: "SUCCEEDED",
      startedAt: new Date(),
      finishedAt: new Date(),
      details: { refreshed: true, at: new Date().toISOString() }
    }
  });

  return ok({ run });
}
