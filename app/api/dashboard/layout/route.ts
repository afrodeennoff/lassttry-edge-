import crypto from "node:crypto";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestUser } from "@/lib/auth";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({
  desktop: z.unknown(),
  mobile: z.unknown(),
  version: z.number().int().positive(),
  deviceId: z.string().min(1),
  changeType: z.string().default("manual")
});

function checksum(data: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const layout = await prisma.dashboardLayout.findUnique({ where: { userId: user.userId } });
  const history = await prisma.layoutVersion.findMany({ where: { userId: user.userId }, orderBy: { version: "desc" }, take: 25 });
  return ok({ layout, history });
}

export async function PUT(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) return fail("unauthorized", 401);

  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const current = await prisma.dashboardLayout.findUnique({ where: { userId: user.userId } });
  if (current && parsed.data.version <= current.version) {
    return fail("conflict: stale version", 409);
  }

  const nextChecksum = checksum({ desktop: parsed.data.desktop, mobile: parsed.data.mobile });

  const layout = await prisma.dashboardLayout.upsert({
    where: { userId: user.userId },
    update: {
      desktop: parsed.data.desktop as Prisma.InputJsonValue,
      mobile: parsed.data.mobile as Prisma.InputJsonValue,
      version: parsed.data.version,
      checksum: nextChecksum,
      deviceId: parsed.data.deviceId
    },
    create: {
      userId: user.userId,
      desktop: parsed.data.desktop as Prisma.InputJsonValue,
      mobile: parsed.data.mobile as Prisma.InputJsonValue,
      version: parsed.data.version,
      checksum: nextChecksum,
      deviceId: parsed.data.deviceId
    }
  });

  await prisma.layoutVersion.create({
    data: {
      userId: user.userId,
      layoutId: layout.id,
      version: parsed.data.version,
      desktop: parsed.data.desktop as Prisma.InputJsonValue,
      mobile: parsed.data.mobile as Prisma.InputJsonValue,
      checksum: nextChecksum,
      deviceId: parsed.data.deviceId,
      changeType: parsed.data.changeType
    }
  });

  return ok({ layout });
}
