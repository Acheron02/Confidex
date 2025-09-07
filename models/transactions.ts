import mongoose, { Schema, model, models } from "mongoose";

interface Item {
  name: string;
  productID: String;
  result: string;
}

interface ITransaction {
  user_id: mongoose.Types.ObjectId;
  status: string; // e.g., "completed", "failed"
  items: Item[];
  purchasedDate: Date;
}

const transactionSchema = new Schema<ITransaction>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      productID: { type: String, required: true },
      result: { type: String, required: true },
    },
  ],
  purchasedDate: { type: Date, default: Date.now },
});

// Avoid re-compiling the model
const Transaction =
  models.Transaction || model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
