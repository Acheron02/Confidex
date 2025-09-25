import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/transactions";
import { broadcast } from "@/server/wsServer"; // import the WS broadcast helper

// ✅ Create a new transaction
export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();

    // Ensure each item has a 'result' field
    const itemsWithResult = data.items.map((item: any) => ({
      ...item,
      result: item.result || "Pending",
    }));

    const transaction = await Transaction.create({
      user_id: data.user_id,
      status: data.status,
      items: itemsWithResult,
      purchasedDate: data.purchasedDate || new Date(),
    });

    broadcast({ type: "new_transaction", transaction });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}

// ✅ Fetch transactions with latest results
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: "user_id is required",
      });
    }

    const transactions = await Transaction.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user_id),
        },
      },
      {
        $lookup: {
          from: "results", // collection name for Result model
          let: { productIDs: "$items.productID", userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user_id", "$$userId"] },
                    { $in: ["$productID", "$$productIDs"] },
                  ],
                },
              },
            },
            { $sort: { testedDate: -1 } },
          ],
          as: "matchedResults",
        },
      },
      {
        $addFields: {
          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                name: "$$item.name",
                productID: "$$item.productID",
                result: {
                  $let: {
                    vars: {
                      matched: {
                        $filter: {
                          input: "$matchedResults",
                          cond: {
                            $eq: ["$$this.productID", "$$item.productID"],
                          },
                        },
                      },
                    },
                    in: {
                      $ifNull: [
                        { $arrayElemAt: ["$$matched.result", 0] },
                        "$$item.result", // fallback
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $sort: { purchasedDate: -1 } },
    ]);

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
