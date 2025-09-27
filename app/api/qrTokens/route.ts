// app/api/qrTokens/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import QrToken from "@/models/qrToken";

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { userId, token } = body;

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "userId required" },
      { status: 400 }
    );
  }

  const newToken = await QrToken.create({
    userId,
    token: token ?? Math.random().toString(36).substring(2, 10).toUpperCase(),
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
    used: false,
  });

  return NextResponse.json({ success: true, qrToken: newToken });
}
