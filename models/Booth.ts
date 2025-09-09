import mongoose, { Schema, model, models } from "mongoose";

export interface IBooth {
  name: string;
  location: string;
  dateInstalled: string;
  status: "active" | "due for maintenance check" | "under maintenance";
}

const BoothSchema = new Schema<IBooth>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  dateInstalled: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "due for maintenance check", "under maintenance"],
    default: "active",
  },
});

const Booth = models.Booth || model<IBooth>("Booth", BoothSchema);

export default Booth;
