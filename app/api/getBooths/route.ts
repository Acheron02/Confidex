// app/api/getBooths/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booth from "@/models/Booth";

export async function GET() {
  try {
    await dbConnect();

    const booths = await Booth.find().lean();

    return NextResponse.json({ booths }, { status: 200 });
  } catch (error) {
    console.error("Error fetching booths:", error);
    return NextResponse.json(
      { error: "Failed to fetch booths" },
      { status: 500 }
    );
  }
}
