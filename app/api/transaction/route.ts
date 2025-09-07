import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/transactions";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // Expected data:
    // { user_id, status, items }

    const transaction = await Transaction.create({
      user_id: data.user_id,
      status: data.status,
      items: data.items,
      purchasedDate: data.purchasedDate || new Date(),
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("user_id");

  if (!user_id) {
    return NextResponse.json({ success: false, error: "user_id is required" });
  }

  const transactions = await Transaction.find({ user_id }).sort({
    createdAt: -1,
  });

  return NextResponse.json({ success: true, transactions });
}
