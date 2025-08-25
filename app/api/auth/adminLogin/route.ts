import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/admin";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // 🔹 Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // 🔹 Find admin by email
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" }, // Generic message for security
        { status: 401 }
      );
    }

    // 🔹 Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" }, // Generic message for security
        { status: 401 }
      );
    }

    // 🔹 Login success
    return NextResponse.json(
      {
        message: "Admin login successful",
        admin: {
          _id: admin._id, // ✅ include id
          email: admin.email, // ✅ include email
          role: "admin", // ✅ include role
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
