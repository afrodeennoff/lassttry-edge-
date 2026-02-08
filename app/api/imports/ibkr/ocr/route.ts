import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ text: z.string().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);
  const lines = parsed.data.text.split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
  return ok({ lines });
}
