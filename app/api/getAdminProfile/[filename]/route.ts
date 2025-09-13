import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET(
  req: Request,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const filePath = path.join(process.cwd(), "uploads", filename);
    const file = await fs.readFile(filePath);

    let contentType = "application/octet-stream";
    if (filename.endsWith(".jpg") || filename.endsWith(".jpeg"))
      contentType = "image/jpeg";
    if (filename.endsWith(".png")) contentType = "image/png";
    if (filename.endsWith(".gif")) contentType = "image/gif";

    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
