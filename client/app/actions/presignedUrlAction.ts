"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/minioClient";
export async function generatePresignedUrl(fileName: string, fileType: string) {
  const bucketName = process.env.MINIO_BUCKET_NAME;
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const cleanFileName = `wts-${uniqueSuffix}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "")}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: cleanFileName,
    ContentType: fileType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  const publicEndpoint =
    process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT;
  const objectUrl = `${publicEndpoint}/${bucketName}/${cleanFileName}`;
  return { presignedUrl, objectUrl };
}
