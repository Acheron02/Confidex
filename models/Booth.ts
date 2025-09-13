import mongoose, { Schema, model, models } from "mongoose";

export interface IBooth {
  name: string;
  location: string;
  installationDate: Date; // use Date instead of string
  status: "active" | "due for maintenance check" | "under maintenance";
}

const BoothSchema = new Schema<IBooth>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  installationDate: { type: Date, required: true }, // corrected to Date
  status: {
    type: String,
    enum: ["active", "due for maintenance check", "under maintenance"],
    default: "active",
  },
});

const Booth = models.Booth || model<IBooth>("Booth", BoothSchema);

export default Booth;
