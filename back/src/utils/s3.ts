import { createPresignedPost as createPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";

export async function createPresignedPost(fileName: string) {
  const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  return createPost(s3, {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `uploads/${Date.now()}-${fileName}`,
    Expires: 60,
  });
}
