import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/admin";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 🔹 Include username or name in the response
    return NextResponse.json(
      {
        message: "Admin login successful",
        admin: {
          _id: admin._id,
          email: admin.email,
          name: admin.name,
          role: "admin",
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
