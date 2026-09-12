import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.MINIO_REGION as string | "us-east-1",
  endpoint: process.env.MINIO_ENDPOINT as string | "http://localhost:9000",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY as string,
    secretAccessKey: process.env.MINIO_SECRET_KEY as string,
  },
  forcePathStyle: true,
});
