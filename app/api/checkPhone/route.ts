// app/api/auth/check-phone/route.ts
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const phone = String(body.phoneNumber || "").trim();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ phoneNumber: phone }).lean();

    if (!user) {
      return NextResponse.json(
        { error: "Phone number not registered" },
        { status: 404 }
      );
    }

    // ✅ Phone exists
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Check phone error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
