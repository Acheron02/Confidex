import mongoose, { Schema, model, models } from "mongoose";

export interface IResult {
  user_id: mongoose.Types.ObjectId;
  productID: string;
  result: string;
  testedDate: Date;
}

const resultSchema = new Schema<IResult>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  productID: { type: String, required: true },
  result: { type: String, required: true },
  testedDate: { type: Date, default: Date.now },
});

const Result = models.Result || model<IResult>("Result", resultSchema);

export default Result;
