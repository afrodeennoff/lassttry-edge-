import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({
  sampleRow: z.record(z.unknown())
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const keys = Object.keys(parsed.data.sampleRow).map((k) => k.toLowerCase());
  const mapping = {
    instrument: keys.find((k) => k.includes("symbol") || k.includes("instrument")) ?? null,
    side: keys.find((k) => k.includes("side") || k.includes("direction")) ?? null,
    quantity: keys.find((k) => k.includes("qty") || k.includes("quantity")) ?? null,
    entryPrice: keys.find((k) => k.includes("entry")) ?? null,
    closePrice: keys.find((k) => k.includes("exit") || k.includes("close")) ?? null,
    entryAt: keys.find((k) => k.includes("entry") && k.includes("time")) ?? null,
    closeAt: keys.find((k) => (k.includes("exit") || k.includes("close")) && k.includes("time")) ?? null,
    commission: keys.find((k) => k.includes("commission") || k.includes("fee")) ?? null
  };

  return ok({ mapping });
}
