import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import QrToken from "@/models/qrToken";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { token, userId } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const now = new Date();

    // Find a valid, unused token (optionally for a specific user)
    const query: Record<string, any> = {
      token,
      used: false,
      expiresAt: { $gt: now },
    };
    if (userId) query.userId = userId;

    // Atomically mark as used
    const qrToken = await QrToken.findOneAndUpdate(
      query,
      { used: true },
      { new: true }
    );

    if (!qrToken) {
      return NextResponse.json({ success: true, valid: false });
    }

    return NextResponse.json({ success: true, valid: true });
  } catch (error) {
    console.error("QR validation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate QR token" },
      { status: 500 }
    );
  }
}

// Optional: handle GET or other methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: "GET method not allowed" },
    { status: 405 }
  );
}
