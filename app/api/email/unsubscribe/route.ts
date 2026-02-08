import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/http";

export async function POST(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return fail("email is required", 400);

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, active: false },
    update: { active: false }
  });

  return ok({ unsubscribed: true });
}
