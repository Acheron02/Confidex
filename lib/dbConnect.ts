import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in .env.local");

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose || { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      dbName: "Confidex",
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}
