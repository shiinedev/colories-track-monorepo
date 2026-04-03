import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<void> {
  try {
    if (env.MONGODB_URI) {
      await mongoose.connect(env.MONGODB_URI || "");
    }
  } catch (error) {
    console.error(error);
    throw new Error("MongoDB connection failed", { cause: error });
  }
}
