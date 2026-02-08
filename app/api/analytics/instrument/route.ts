import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { summarizeTrades } from "@/lib/analytics";
import { ok, fail } from "@/lib/http";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);
  const instrument = req.nextUrl.searchParams.get("instrument");
  if (!instrument) return fail("instrument is required", 400);

  const trades = await prisma.trade.findMany({ where: { userId: user.userId, instrument } });
  return ok({ instrument, summary: summarizeTrades(trades) });
}
