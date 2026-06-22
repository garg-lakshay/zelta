import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAuth(req);
    if (authResult instanceof NextResponse) return authResult;
    const { id: userId } = authResult;

    const analytics = await prisma.analytics.findUnique({
      where: { userId },
    });

    if (!analytics) {
      return NextResponse.json(
        {
          error: "No analytics found.",
          hint: "Please upload your trading history first.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ analytics }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data." },
      { status: 500 },
    );
  }
}
