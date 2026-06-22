import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export type AuthUser = { id: string; name: string; email: string };

/**
 * Verifies the Bearer token in the Authorization header.
 *
 * Returns an AuthUser on success.
 * Returns a NextResponse (401) on any auth failure — the caller must return it:
 *
 *   const result = await verifyAuth(req);
 *   if (result instanceof NextResponse) return result;
 *   const user = result; // AuthUser
 */
export async function verifyAuth(
  req: NextRequest,
): Promise<AuthUser | NextResponse> {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 },
    );
  }

  const userId = decoded.userId as string | undefined;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return user;
}
