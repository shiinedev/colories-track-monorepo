import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;
export async function connectDB(): Promise<void> {
  try {
    if (isConnected) return;
    if (env.MONGODB_URI) {
      await mongoose.connect(env.MONGODB_URI || "");
      isConnected = true;
    }
  } catch (error) {
    console.error(error);
    throw new Error("MongoDB connection failed", { cause: error });
  }
}
