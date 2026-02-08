import { NextRequest } from "next/server";
import { z } from "zod";
import { getBillingProvider } from "@/lib/billing/provider-factory";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  plan: z.string().min(1),
  teamId: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const provider = await getBillingProvider();
  const checkout = await provider.createCheckout({
    ...parsed.data,
    metadata: { scope: "team", teamId: parsed.data.teamId },
    successUrl: `${req.nextUrl.origin}/teams/manage?billing=success`,
    cancelUrl: `${req.nextUrl.origin}/teams/manage?billing=cancel`
  });

  return ok(checkout, 201);
}
