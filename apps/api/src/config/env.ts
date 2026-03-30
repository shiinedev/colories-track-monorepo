import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

export const env = {
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/colorie-track",
  env: process.env.NODE_ENV,
  PORT: process.env.PORT || 9000,
  FRONT_END_URL: process.env.FRONT_END_URL || "http://localhost:3000",
  jwt: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  },
  r2: {
    BUCKET_NAME: process.env.R2_BUCKET_NAME || "",
    ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || "",
    ACCESS_SECRET_KEY: process.env.R2_ACCESS_SECRET_KEY || "",
    ACCOUNT_ID: process.env.R2_ACCOUNT_ID || "",
    API_URL: process.env.R2_PUBLIC_URL || "",
  },
  openApiKey: process.env.OPENAI_API_KEY || "",
};
