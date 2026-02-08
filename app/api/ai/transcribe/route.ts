import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ transcript: z.string().min(1) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const segments = parsed.data.transcript
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return ok({
    text: parsed.data.transcript,
    segments,
    summary: segments.slice(0, 3).join(". ")
  });
}
