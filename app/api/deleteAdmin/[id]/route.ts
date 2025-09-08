import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/admin";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params; // get ID from URL, NOT from req.json()

    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Delete admin error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
