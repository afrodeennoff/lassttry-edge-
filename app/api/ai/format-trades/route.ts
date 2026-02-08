import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail, safeJson } from "@/lib/http";
import { normalizeUnknownRow } from "@/lib/imports/adapters";

const schema = z.object({ rows: z.array(z.record(z.unknown())).min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  return ok({ trades: parsed.data.rows.map(normalizeUnknownRow) });
}
