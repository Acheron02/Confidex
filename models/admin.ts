import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { collection: "admins" }
);

export default mongoose.models.Admin ||
  mongoose.model<IAdmin>("Admin", AdminSchema);
