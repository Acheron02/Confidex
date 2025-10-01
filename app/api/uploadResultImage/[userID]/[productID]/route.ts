// app/api/uploadResultImage/[userID]/[productID]/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import dbConnect from "@/lib/dbConnect";
import Result from "@/models/results";
import { broadcast } from "@/server/wsServer";

const RESULTS_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "analyzed_kits"
);

// ✅ Ensure the folder exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userID: string; productID: string } }
) {
  try {
    await dbConnect();
    const { userID, productID } = params;

    if (!userID || !productID) {
      return NextResponse.json(
        { error: "Missing userID or productID" },
        { status: 400 }
      );
    }

    // ✅ Parse form data for file
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Save file into public/uploads/analyzed_kits
    const fileExt = path.extname(file.name) || ".jpg";
    const fileName = `${userID}_${productID}${fileExt}`;
    const filePath = path.join(RESULTS_DIR, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // ✅ Relative URL for frontend (Next.js will serve it from /public)
    const relativeUrl = `/uploads/analyzed_kits/${fileName}`;

    // ✅ Update MongoDB result doc
    const updatedResult = await Result.findOneAndUpdate(
      { user_id: userID, productID },
      { result_image: relativeUrl },
      { new: true, upsert: true } // create if not exists
    );

    // ✅ Broadcast update to clients
    broadcast({
      type: "new_result",
      result: updatedResult,
    });

    return NextResponse.json({
      success: true,
      imageUrl: relativeUrl,
      result: updatedResult,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload result image" },
      { status: 500 }
    );
  }
}
