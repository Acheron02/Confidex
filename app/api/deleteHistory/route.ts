import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import Transaction from "@/models/transactions";

export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Convert string to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    const result = await Transaction.deleteMany({ user_id: objectId });

    return NextResponse.json({ deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete transactions" },
      { status: 500 }
    );
  }
}
