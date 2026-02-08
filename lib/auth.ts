import { NextRequest } from "next/server";

export type RequestUser = {
  userId: string;
  email?: string;
};

export function getRequestUser(req: NextRequest): RequestUser | null {
  const userId = req.headers.get("x-user-id") ?? req.nextUrl.searchParams.get("userId");
  if (!userId) return null;
  const email = req.headers.get("x-user-email") ?? undefined;
  return { userId, email };
}
