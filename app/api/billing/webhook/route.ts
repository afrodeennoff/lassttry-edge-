import { NextRequest, NextResponse } from "next/server";
import { getBillingProvider } from "@/lib/billing/provider-factory";

export async function POST(request: NextRequest) {
  try {
    const provider = await getBillingProvider();
    const rawBody = await request.text();
    const event = await provider.verifyAndParseWebhook(rawBody, request.headers);
    const result = await provider.processWebhook(event);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook verification failed" },
      { status: 400 }
    );
  }
}
