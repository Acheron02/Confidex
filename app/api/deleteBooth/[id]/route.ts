import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booth from "@/models/Booth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params; // get ID from URL, NOT from req.json()

    const deleted = await Booth.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Booth not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booth deleted successfully" });
  } catch (err) {
    console.error("Delete booth error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
