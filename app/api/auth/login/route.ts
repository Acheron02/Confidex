import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const phone = String(body.phoneNumber || "").trim();

    const user = (await User.findOne({ phoneNumber: phone }).lean()) as {
      _id: string;
      phoneNumber: string;
      gender?: string;
      dob?: string;
      createdAt?: string;
    } | null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), phone: user.phoneNumber },
      JWT_SECRET,
      { expiresIn: "5m" }
    );

    // ✅ build response first
    const res = NextResponse.json(
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

    // ✅ attach cookie to response
    res.headers.set(
      "Set-Cookie",
      cookie.serialize("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 60,
        path: "/",
      })
    );

    return res;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
