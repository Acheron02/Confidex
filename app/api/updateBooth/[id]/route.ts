import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booth from "@/models/Booth";

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    await dbConnect();

    const id = context.params.id;
    const data = await req.json();

    const { name, location, installationDate, status } = data;

    const parsedDate = installationDate
      ? new Date(installationDate)
      : undefined;

    const updatedBooth = await Booth.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(location && { location }),
        ...(parsedDate && { dateInstalled: parsedDate }),
        ...(status && { status }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedBooth) {
      return NextResponse.json({ error: "Booth not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Booth updated successfully",
      booth: updatedBooth,
    });
  } catch (err) {
    console.error("Update booth error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
