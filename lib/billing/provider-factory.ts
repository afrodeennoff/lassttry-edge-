import { env } from "@/lib/env";
import type { BillingProvider } from "@/lib/billing/types";

export async function getBillingProvider(): Promise<BillingProvider> {
  if (env.BILLING_PROVIDER === "stripe") {
    const mod = await import("@/lib/billing/stripe-provider");
    return new mod.StripeProvider();
  }
  const mod = await import("@/lib/billing/whop-provider");
  return new mod.WhopProvider();
}
