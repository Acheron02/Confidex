import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Result from "@/models/results";
import { broadcast } from "@/server/wsServer"; // Import WebSocket broadcast helper

// ✅ Add a new test result
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    const { user_id, productID, result } = data;

    if (!user_id || !productID || !result) {
      return NextResponse.json({
        success: false,
        error: "user_id, productID, and result are required",
      });
    }

    const newResult = await Result.create({
      user_id,
      productID,
      result,
      testedDate: new Date(),
    });

    // Broadcast the new result to all connected clients
    broadcast({ type: "new_result", result: newResult });

    return NextResponse.json({ success: true, result: newResult });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
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

    const results = await Result.find({ user_id: userId }).lean();
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
