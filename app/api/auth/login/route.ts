import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import cookie from "cookie";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const phone = String(body.phoneNumber || "").trim();
    if (!phone) {
      return NextResponse.json(
        { error: "Phone number required" },
        { status: 400 }
      );
    }

    // Fetch all users (since phone is hashed, we can't query directly)
    const users = await User.find().lean();

    let matchedUser: any = null;
    for (const u of users) {
      const isMatch = await bcrypt.compare(phone, u.phoneNumber);
      if (isMatch) {
        matchedUser = u;
        break;
      }
    }

    if (!matchedUser) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ generate JWT with plain phone for session use
    const token = jwt.sign(
      { id: matchedUser._id.toString(), phone },
      JWT_SECRET,
      { expiresIn: "5m" }
    );

    // ✅ build response
    const res = NextResponse.json(
      {
        message: "Login successful",
        user: {
          _id: matchedUser._id,
          username: matchedUser.username,
          gender: matchedUser.gender,
          dob: matchedUser.dob,
          createdAt: matchedUser.createdAt,
        },
      },
      { status: 200 }
    );

    // ✅ attach session cookie
    res.headers.set(
      "Set-Cookie",
      cookie.serialize("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 60, // 5 minutes
        path: "/",
      })
    );

    return res;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
