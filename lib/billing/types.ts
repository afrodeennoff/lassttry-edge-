export type CheckoutInput = {
  userId: string;
  email: string;
  plan: string;
  teamId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

export type CheckoutOutput = {
  checkoutUrl: string;
};

export type WebhookProcessingResult = {
  success: boolean;
  eventId: string;
  eventType: string;
  alreadyProcessed?: boolean;
  error?: string;
};

export interface BillingProvider {
  createCheckout(input: CheckoutInput): Promise<CheckoutOutput>;
  verifyAndParseWebhook(rawBody: string, headers: Headers): Promise<unknown>;
  processWebhook(event: unknown): Promise<WebhookProcessingResult>;
}
