import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ lines: z.array(z.string()) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const orders = parsed.data.lines
    .filter((l) => /buy|sell/i.test(l))
    .map((line, index) => ({ id: `ibkr_${index}`, raw: line }));

  return ok({ orders });
}
