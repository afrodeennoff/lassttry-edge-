import { ok } from "@/lib/http";

export async function GET() {
  return ok({ jobs: ["compute-trade-data", "renew-tradovate-token", "renewal-notice", "investing-events"] });
}
