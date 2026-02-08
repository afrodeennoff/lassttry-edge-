import { ok } from "@/lib/http";
import { providers } from "@/lib/imports/adapters";

export async function GET() {
  return ok({ providers });
}
