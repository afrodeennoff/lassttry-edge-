import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { supportTriage } from "@/lib/ai/engine";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ message: z.string().min(1), email: z.string().email().optional() });

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const triage = supportTriage(parsed.data.message);
  const ticket = await prisma.supportTicket.create({
    data: {
      userId: user?.userId,
      email: parsed.data.email ?? user?.email,
      category: triage.category,
      complexity: triage.complexity === "low" ? "LOW" : triage.complexity === "medium" ? "MEDIUM" : "HIGH",
      message: parsed.data.message,
      aiSuggestion: triage.response,
      escalate: triage.escalateToHuman,
      payload: { source: "api", at: new Date().toISOString() }
    }
  });

  return ok({
    ticketId: ticket.id,
    triage,
    supportEmailPayload: {
      subject: `[Support:${triage.category}] ${triage.complexity.toUpperCase()}`,
      body: parsed.data.message,
      to: "support@aegisjournal.io"
    }
  }, 201);
}
