import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({ fills: z.array(z.object({ quantity: z.number(), price: z.number(), side: z.enum(["BUY", "SELL"]) })) });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const queue: { quantity: number; price: number }[] = [];
  let realized = 0;

  for (const fill of parsed.data.fills) {
    if (fill.side === "BUY") {
      queue.push({ quantity: fill.quantity, price: fill.price });
      continue;
    }

    let remaining = fill.quantity;
    while (remaining > 0 && queue.length > 0) {
      const head = queue[0];
      const matched = Math.min(remaining, head.quantity);
      realized += (fill.price - head.price) * matched;
      head.quantity -= matched;
      remaining -= matched;
      if (head.quantity === 0) queue.shift();
    }
  }

  return ok({ realizedPnl: realized, openLots: queue });
}
