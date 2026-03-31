import dotenv from "dotenv";
dotenv.config();
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// export const env = {
//   MONGODB_URI:
//     process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/colorie-track",
//   env: process.env.NODE_ENV,
//   PORT: process.env.PORT || 9000,
//   FRONT_END_URL: process.env.FRONT_END_URL || "http://localhost:3000",
//   jwt: {
//     SECRET: process.env.JWT_SECRET,
//     EXPIRES_IN: process.env.JWT_EXPIRES_IN,
//   },
//   r2: {
//     BUCKET_NAME: process.env.R2_BUCKET_NAME || "",
//     ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "",
//     ACCESS_SECRET_KEY: process.env.R2_ACCESS_SECRET_KEY || "",
//     ACCOUNT_ID: process.env.R2_ACCOUNT_ID || "",
//     API_URL: process.env.R2_PUBLIC_URL || "",
//   },
//   openApiKey: process.env.OPENAI_API_KEY || "",
// };

export const env = createEnv({
  server: {
    MONGODB_URI: z.string("MONGODB_URI is required").min(1),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.number().default(9000),
    FRONT_END_URL: z
      .string("FRONT_END_URL is required")
      .min(1)
      .default("http://localhost:3000"),
    JWT_SECRET: z.string("JWT_SECRET is required").min(1),
    JWT_EXPIRES_IN: z.string("JWT_EXPIRES_IN is required").min(1),
    R2_BUCKET_NAME: z.string("R2_BUCKET_NAME is required").min(1),
    R2_ACCESS_KEY_ID: z.string("R2_ACCESS_KEY_ID is required").min(1),
    R2_ACCESS_SECRET_KEY: z.string("R2_ACCESS_SECRET_KEY is required").min(1),
    R2_ACCOUNT_ID: z.string("R2_ACCOUNT_ID is required").min(1),
    R2_PUBLIC_URL: z.string("R2_PUBLIC_URL is required").min(1),
    OPENAI_API_KEY: z.string("OPENAI_API_KEY is required").min(1),
  },
  runtimeEnv: process.env,
});
