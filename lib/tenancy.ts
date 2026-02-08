import { prisma } from "@/lib/prisma";

export async function assertAccountOwnership(userId: string, accountId: string): Promise<boolean> {
  const account = await prisma.account.findFirst({ where: { id: accountId, userId }, select: { id: true } });
  return Boolean(account);
}

export async function assertTeamAdmin(userId: string, teamId: string): Promise<boolean> {
  const membership = await prisma.teamMember.findFirst({ where: { teamId, userId, role: "ADMIN" }, select: { id: true } });
  return Boolean(membership);
}
