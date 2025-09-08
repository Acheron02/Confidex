import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    phoneHash: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, index: true },
    phoneNumber: { type: String, required: true, unique: true, index: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    dob: { type: Date, required: true }, // store as Date
    // You can add role, createdAt via timestamps
  },
  { timestamps: true }
);

// Avoid recompiling model on hot reload
const User = models.User || model("User", UserSchema);
export default User;
