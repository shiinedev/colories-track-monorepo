import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";
import dotenv from "dotenv";

dotenv.config();

const r2Client = new S3Client({
  endpoint: `https://${env.r2.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.r2.ACCESS_KEY_ID,
    secretAccessKey: env.r2.ACCESS_SECRET_KEY,
  },
  region: "auto",
});

export const r2Config = {
  client: r2Client,
  bucket: env.r2.BUCKET_NAME,
  publicUrl: env.r2.API_URL,
};
