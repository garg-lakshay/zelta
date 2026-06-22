import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function extractToken(req: NextRequest): string | null {
  const cookie = req.cookies.get("token")?.value;
  if (cookie) return cookie;
  const auth = req.headers.get("Authorization") ?? "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function proxy(req: NextRequest) {
  const token = extractToken(req);

  const deny = () =>
    NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  if (!token) return deny();

  const secret = process.env.JWT_SECRET;
  if (!secret) return deny();

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return deny();
  }
}

// Middleware only guards API routes.
// Page-level auth (/dashboard) is handled client-side in the layout.
export const config = {
  matcher: ["/api/upload", "/api/dashboard"],
};
