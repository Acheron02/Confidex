import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/admin";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    const normalizedEmail = String(email).toLowerCase().trim();

    // Find admin by email
    let admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      
      return NextResponse.json(
        { message: "Admin not found!", admin: { email: normalizedEmail }, 
        error: "Invalid email or password" },
        { status: 404 }
        );
        }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Login success
    return NextResponse.json(
      { message: "Admin login successful", admin: { email: admin.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
