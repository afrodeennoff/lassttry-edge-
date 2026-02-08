import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getBillingProvider } from "@/lib/billing/provider-factory";
import { checkRateLimit } from "@/lib/security";

const schema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  plan: z.string().min(1),
  teamId: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request);
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Rate limited" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } }
      );
    }

    const body = await request.json().catch(() => null);
    const payload = schema.safeParse(body);
    if (!payload.success) {
      return NextResponse.json({ error: payload.error.flatten() }, { status: 400 });
    }

    const provider = await getBillingProvider();
    const checkout = await provider.createCheckout({
      ...payload.data,
      successUrl: `${request.nextUrl.origin}/dashboard/billing?status=success`,
      cancelUrl: `${request.nextUrl.origin}/dashboard/billing?status=cancel`
    });

    return NextResponse.json(checkout);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
