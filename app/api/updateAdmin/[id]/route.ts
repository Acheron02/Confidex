import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/admin";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const { name, email, password } = await req.json();

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { name, email, ...(password ? { password } : {}) },
      { new: true }
    );

    if (!updatedAdmin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ admin: updatedAdmin });
  } catch (err) {
    console.error("Update admin error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
