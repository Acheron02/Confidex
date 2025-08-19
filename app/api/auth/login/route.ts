import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const phone = String(body.number || "").trim();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ phoneNumber: phone }).lean() as {
      _id: string;
      phoneNumber: string;
      gender?: string;
      dob?: string;
      createdAt?: string;
      [key: string]: any;
    } | null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          _id: user._id,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          dob: user.dob,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
