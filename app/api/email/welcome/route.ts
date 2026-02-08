import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ email: z.string().email(), firstName: z.string().optional(), locale: z.enum(["en", "fr"]).default("en") });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const copy = parsed.data.locale === "fr" ? "Bienvenue sur Aegis Journal." : "Welcome to Aegis Journal.";
  return ok({ queued: true, to: parsed.data.email, subject: copy });
}
