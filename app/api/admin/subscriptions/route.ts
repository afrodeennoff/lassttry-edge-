import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    const teamId = request.nextUrl.searchParams.get("teamId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const membership = await prisma.teamMember.findFirst({
      where: { userId, ...(teamId ? { teamId } : {}) }
    });

    if (!membership || membership.role !== "ADMIN") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load subscriptions" },
      { status: 500 }
    );
  }
}
