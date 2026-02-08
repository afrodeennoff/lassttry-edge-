import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import type { BillingProvider, CheckoutInput, CheckoutOutput, WebhookProcessingResult } from "@/lib/billing/types";

function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2026-01-28.clover" });
}

export class StripeProvider implements BillingProvider {
  async createCheckout(input: CheckoutInput): Promise<CheckoutOutput> {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: input.plan, quantity: 1 }],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.email,
      metadata: { userId: input.userId, teamId: input.teamId ?? "", ...(input.metadata ?? {}) }
    });

    if (!session.url) {
      throw new Error("Stripe checkout URL not returned");
    }

    return { checkoutUrl: session.url };
  }

  async verifyAndParseWebhook(rawBody: string, headers: Headers) {
    const stripe = getStripeClient();
    const signature = headers.get("stripe-signature");
    if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing Stripe webhook signature configuration");
    }

    return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  }

  async processWebhook(event: unknown): Promise<WebhookProcessingResult> {
    const e = event as Stripe.Event;

    try {
      await prisma.processedWebhook.create({
        data: {
          provider: "STRIPE",
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
