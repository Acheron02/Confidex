import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
}

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { collection: "admins" }); 


// force mongoose to use the "admins" collection
export default mongoose.models.admins ||
  mongoose.model<IAdmin>("admins", AdminSchema);
