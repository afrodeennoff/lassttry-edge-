import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createTradeSchema = z.object({
  userId: z.string().min(1),
  accountId: z.string().min(1),
  instrument: z.string().min(1),
  side: z.string().min(1),
  quantity: z.number().int().positive(),
  entryPrice: z.number(),
  closePrice: z.number(),
  entryAt: z.string().datetime(),
  closeAt: z.string().datetime(),
  commission: z.number().default(0),
  note: z.string().optional(),
  mood: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { closeAt: "desc" },
      take: 500
    });

    return NextResponse.json({ trades });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch trades" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = createTradeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const input = parsed.data;
    const account = await prisma.account.findFirst({
      where: { id: input.accountId, userId: input.userId },
      select: { id: true }
    });

    if (!account) {
      return NextResponse.json({ error: "account not found for user" }, { status: 403 });
    }

    const pnl = (input.closePrice - input.entryPrice) * input.quantity - input.commission;
    const trade = await prisma.trade.create({
      data: {
        ...input,
        entryAt: new Date(input.entryAt),
        closeAt: new Date(input.closeAt),
        pnl,
        riskReward: input.entryPrice !== 0 ? Number((input.closePrice / input.entryPrice).toFixed(4)) : null,
        efficiency: null
      }
    });

    return NextResponse.json({ trade }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create trade" },
      { status: 500 }
    );
  }
}
