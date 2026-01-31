import { NextRequest, NextResponse } from "next/server";
import { webhookService } from "@/server/webhook-service";
import { whop } from "@/lib/whop";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
    const requestBodyText = await req.text();
    const headers = Object.fromEntries(req.headers);

    let event;
    try {
        event = whop.webhooks.unwrap(requestBodyText, { headers });
    } catch (err) {
        logger.error('[Webhook] Signature verification failed', { err });
        return NextResponse.json(
            { message: `Webhook Error: ${err}` },
            { status: 400 }
        );
    }

    logger.info('[Webhook] Event received', { eventType: event.type, eventId: event.id });

    const result = await webhookService.processWebhook(event);

    if (result.success) {
        return NextResponse.json({ message: "Received" }, { status: 200 });
    } else {
        return NextResponse.json(
            { message: result.error || "Processing failed" },
            { status: 500 }
        );
    }
}
