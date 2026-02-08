import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
  locale: z.enum(["en", "fr"]).optional()
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { active: true, ...(parsed.data.locale ? { locale: parsed.data.locale } : {}) },
    take: 5000
  });

  return ok({ queued: subscribers.length, recipients: subscribers.map((s) => s.email) });
}
