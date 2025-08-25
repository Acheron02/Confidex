import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Basic validation
    const phone = String(body.phoneNumber || "").trim();
    const gender = String(body.gender || "")
      .trim()
      .toLowerCase();
    const dobStr = String(body.dob || "").trim();

    if (!phone || !gender || !dobStr) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) {
      return NextResponse.json(
        { error: "Invalid date of birth" },
        { status: 400 }
      );
    }

    // Check if exists
    const exists = await User.findOne({ phoneNumber: phone }).lean();
    if (exists) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 409 }
      );
    }

    // Create new user
    const user = await User.create({
      phoneNumber: phone,
      gender: gender,
      dob: dob,
    });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), phone: user.phoneNumber },
      JWT_SECRET,
      { expiresIn: "5mins" }
    );

    // ✅ Build response
    // ✅ Build response
    const response = NextResponse.json(
      {
        user: {
          _id: user._id.toString(),
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          dob: user.dob,
          createdAt: user.createdAt,
        },
        token,
      },
      { status: 201 }
    );

    // ✅ Attach cookie
    response.headers.append(
      "Set-Cookie",
      cookie.serialize("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 60,
        path: "/",
      })
    );

    return response;
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
