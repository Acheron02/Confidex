import dbConnect from "@/lib/dbConnect";
import QrToken from "@/models/qrToken";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { broadcast } from "@/server/wsServer";

type UserType = {
  _id: string;
  username: string;
  phoneNumber: string;
  gender: "male" | "female" | "other";
  dob: Date;
  createdAt: Date;
};

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // --------------------------
    // CASE 1: Generate QR token
    // --------------------------
    if (body.userId) {
      const user = (await User.findById(body.userId).lean()) as UserType | null;
      if (!user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      // ✅ Prefix the random string with "LOGIN-"
      const token = "LOGIN-" + Math.random().toString(36).substring(2, 12); // e.g. LOGIN-abc123defg
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5-minute expiry

      await QrToken.create({
        token,
        userId: user._id,
        used: false,
        expiresAt,
      });

      return NextResponse.json({ token }, { status: 200 });
    }

    // --------------------------
    // CASE 2: Verify QR code
    // --------------------------
    if (body.qrCode) {
      // ✅ Optional safety: only accept codes beginning with "LOGIN-"
      if (!body.qrCode.startsWith("LOGIN-")) {
        return NextResponse.json(
          { error: "Invalid QR code type" },
          { status: 401 }
        );
      }

      const qrRecord = await QrToken.findOne({ token: body.qrCode });
      if (!qrRecord)
        return NextResponse.json({ error: "Invalid QR code" }, { status: 401 });

      if (qrRecord.used || new Date() > qrRecord.expiresAt) {
        return NextResponse.json(
          { error: "QR code expired or already used" },
          { status: 401 }
        );
      }

      const user = (await User.findById(
        qrRecord.userId
      ).lean()) as UserType | null;
      if (!user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      // Mark token as used
      qrRecord.used = true;
      await qrRecord.save();

      // Broadcast to WS clients
      broadcast({
        type: "qr_scanned",
        userId: qrRecord.userId.toString(),
        token: qrRecord.token,
      });

      return NextResponse.json({
        message: "QR scanned successfully",
        user: {
          _id: user._id,
          username: user.username,
          gender: user.gender,
          dob: user.dob,
          phoneNumber: user.phoneNumber,
          createdAt: user.createdAt,
        },
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (err) {
    console.error("QR verifier error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
