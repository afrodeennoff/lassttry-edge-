import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail, safeJson } from "@/lib/http";
import { normalizeUnknownRow, providerSchema } from "@/lib/imports/adapters";

const schema = z.object({ provider: providerSchema, rows: z.array(z.record(z.unknown())) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const normalized = parsed.data.rows.map(normalizeUnknownRow);
  return ok({ provider: parsed.data.provider, normalized });
}
