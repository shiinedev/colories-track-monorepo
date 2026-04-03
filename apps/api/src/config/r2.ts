import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";
import dotenv from "dotenv";

dotenv.config();

const r2Client = new S3Client({
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_ACCESS_SECRET_KEY,
  },
  region: "auto",
});

export const r2Config = {
  client: r2Client,
  bucket: env.R2_BUCKET_NAME,
  publicUrl: env.R2_PUBLIC_URL,
};
