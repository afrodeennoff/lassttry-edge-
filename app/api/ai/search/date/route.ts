import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ query: z.string().min(1) });

function parseDate(query: string): string | null {
  const normalized = query.trim().toLowerCase();
  const now = new Date();

  if (normalized === "today") return now.toISOString();
  if (normalized === "yesterday") return new Date(now.getTime() - 24 * 3600 * 1000).toISOString();

  const parsed = new Date(query);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return null;
}

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const date = parseDate(parsed.data.query);
  if (!date) return fail("could not parse date", 400);
  return ok({ isoDate: date });
}
