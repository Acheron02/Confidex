import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/admin";

export async function GET() {
  try {
    await dbConnect();
    const admins = await Admin.find({}, { password: 0 }); // exclude passwords
    return NextResponse.json({ admins }, { status: 200 });
  } catch (error) {
    console.error("Get admins error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
