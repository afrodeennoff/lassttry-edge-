import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import type { BillingProvider, CheckoutInput, CheckoutOutput, WebhookProcessingResult } from "@/lib/billing/types";

type WhopEvent = { id: string; type: string; data: Record<string, unknown> };

async function getWhopClient() {
  if (!env.WHOP_API_KEY) {
    throw new Error("Missing WHOP_API_KEY");
  }
  const mod = await import("@whop/sdk");
  const Whop = mod.default;
  return new Whop({ apiKey: env.WHOP_API_KEY });
}

export class WhopProvider implements BillingProvider {
  async createCheckout(input: CheckoutInput): Promise<CheckoutOutput> {
    if (!env.WHOP_COMPANY_ID) {
      throw new Error("Missing WHOP_COMPANY_ID");
    }

    const whop = await getWhopClient();
    const checkout = await whop.checkoutConfigurations.create({
      company_id: env.WHOP_COMPANY_ID,
      plan_id: input.plan,
      metadata: { userId: input.userId, email: input.email, ...(input.metadata ?? {}) },
      redirect_url: input.successUrl
    });

    return { checkoutUrl: checkout.purchase_url };
  }

  async verifyAndParseWebhook(rawBody: string, headers: Headers): Promise<unknown> {
    const whop = await getWhopClient();
    const dataHeaders = Object.fromEntries(headers.entries());
    return whop.webhooks.unwrap(rawBody, { headers: dataHeaders });
  }

  async processWebhook(event: unknown): Promise<WebhookProcessingResult> {
    const e = event as WhopEvent;

    try {
      await prisma.processedWebhook.create({
        data: {
          provider: "WHOP",
          eventId: e.id,
          eventType: e.type,
          payload: e as unknown as object
        }
      });
    } catch {
      return { success: true, eventId: e.id, eventType: e.type, alreadyProcessed: true };
    }

    return { success: true, eventId: e.id, eventType: e.type };
  }
}
