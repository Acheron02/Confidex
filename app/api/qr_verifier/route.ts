import dbConnect from "@/lib/dbConnect";
import QrToken from "@/models/qrToken";
import User from "@/models/User";
import { NextResponse } from "next/server";

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

    // CASE 1: Generate a QR token (web dashboard)
    if (body.userId) {
      const user = (await User.findById(body.userId).lean()) as UserType | null;

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const token = Math.random().toString(36).substring(2, 12); // 10-char random
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await QrToken.create({
        token,
        userId: user._id,
        used: false,
        expiresAt,
      });

      return NextResponse.json({ token }, { status: 200 });
    }

    // CASE 2: Verify a scanned QR code (Pi or web)
    if (body.qrCode) {
      const qrRecord = await QrToken.findOne({ token: body.qrCode });
      if (!qrRecord) {
        return NextResponse.json({ error: "Invalid QR code" }, { status: 401 });
      }

      if (qrRecord.used || new Date() > qrRecord.expiresAt) {
        return NextResponse.json(
          { error: "QR code expired or already used" },
          { status: 401 }
        );
      }

      const user = (await User.findById(
        qrRecord.userId
      ).lean()) as UserType | null;
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      qrRecord.used = true;
      await qrRecord.save();

      return NextResponse.json({
        message: "Login successful",
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
