// app/api/addBooth/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Booth from "@/models/Booth";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, location, installationDate, status } = await req.json();

    if (!name || !location || !installationDate) {
      return NextResponse.json(
        { error: "Name, location, and installation date are required" },
        { status: 400 }
      );
    }

    const date = new Date(installationDate);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid installation date format" },
        { status: 400 }
      );
    }

    const booth = await Booth.create({
      name,
      location,
      installationDate: date,
      status: status || "active",
    });

    return NextResponse.json(
      {
        message: "Booth added successfully",
        booth: {
          _id: booth._id, // MongoDB ObjectId is already unique
          name: booth.name,
          location: booth.location,
          installationDate: booth.installationDate,
          status: booth.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding booth:", error.message || error);
    return NextResponse.json({ error: "Failed to add booth" }, { status: 500 });
  }
}
