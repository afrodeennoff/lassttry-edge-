import { NextRequest } from "next/server";
import { getBillingProvider } from "@/lib/billing/provider-factory";
import { ok, fail } from "@/lib/http";

export async function POST(req: NextRequest) {
  try {
    const provider = await getBillingProvider();
    const rawBody = await req.text();
    const event = await provider.verifyAndParseWebhook(rawBody, req.headers);
    const result = await provider.processWebhook(event);
    return ok(result, result.success ? 200 : 500);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "invalid webhook", 400);
  }
}
