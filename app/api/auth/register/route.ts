// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcrypt";
import { sha256Phone } from "@/app/utils/hashPhone";
import { generateUniqueUsernameWithPhone } from "@/app/utils/generateUsername";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

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

    // 🔐 Use shared util for consistency
    const phoneHash = sha256Phone(phone); // deterministic for lookup
    const phoneBcrypt = await bcrypt.hash(phone, 10); // non-deterministic for secure storage

    // 🔎 Check if already exists by SHA256 hash
    const existingUser = await User.findOne({ phoneHash });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "Phone number already registered",
          username: existingUser.username,
        },
        { status: 409 }
      );
    }

    // ✅ Generate username
    const username = await generateUniqueUsernameWithPhone(phone);

    // ✅ Create user
    const user = await User.create({
      phoneHash,
      phoneNumber: phoneBcrypt,
      gender,
      dob,
      username,
    });

    // 🎟️ JWT contains only safe info
    const token = jwt.sign({ id: user._id.toString(), phoneHash }, JWT_SECRET, {
      expiresIn: "5m",
    });

    // ✅ Response
    const response = NextResponse.json(
      {
        user: {
          _id: user._id.toString(),
          username: user.username,
          gender: user.gender,
          dob: user.dob,
          createdAt: user.createdAt,
        },
        token,
      },
      { status: 201 }
    );

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
