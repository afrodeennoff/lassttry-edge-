import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/http";

export async function POST() {
  const run = await prisma.jobRun.create({
    data: {
      name: "investing-events",
      status: "SUCCEEDED",
      startedAt: new Date(),
      finishedAt: new Date(),
      details: {
        events: [
          { symbol: "ES", title: "CPI", impact: "high" },
          { symbol: "NQ", title: "FOMC Minutes", impact: "high" }
        ]
      }
    }
  });

  return ok({ run });
}
