import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Basic validation
    const phone = String(body.phoneNumber || "").trim();
    const gender = String(body.gender || "")
      .trim()
      .toLowerCase();
    const dobStr = String(body.dob || "").trim(); // 👈 use dob

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

    // Optional: check if exists
    const exists = await User.findOne({ phoneNumber: phone }).lean();
    if (exists) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 409 }
      );
    }

    const user = await User.create({
      phoneNumber: phone,
      gender: gender,
      dob: dob, // 👈 match schema exactly
    });

    return NextResponse.json(
      {
        _id: user._id,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        dob: user.dob, 
        createdAt: user.createdAt,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
