// app/api/update_result/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Result from "@/models/results";
import { broadcast } from "@/server/wsServer";

// ✅ Add a new test result
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    const { user_id, productID, result, result_image } = data;

    if (!user_id || !productID || !result) {
      return NextResponse.json(
        {
          success: false,
          error: "user_id, productID, and result are required",
        },
        { status: 400 }
      );
    }

    // ✅ Ensure ObjectId type
    const userObjectId = new mongoose.Types.ObjectId(user_id);

    const newResult = await Result.create({
      user_id: userObjectId,
      productID,
      result,
      result_image: result_image || "", // fallback to empty string
      testedDate: new Date(),
    });

    // Broadcast the new result to all connected clients
    broadcast({ type: "new_result", result: newResult });

    return NextResponse.json({ success: true, result: newResult });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// ✅ Fetch all results for a user
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ✅ Ensure ObjectId type
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const results = await Result.find({ user_id: userObjectId }).lean();

    // Guarantee result_image field always exists
    const normalized = results.map((r) => ({
      ...r,
      result_image: r.result_image || "",
    }));

    return NextResponse.json(normalized, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
