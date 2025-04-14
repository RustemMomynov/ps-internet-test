import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

const s3 = new AWS.S3();

export const uploadToS3 = async (
  buffer: Buffer,
  filename: string,
  mimetype: string
): Promise<string> => {
  const key = `${Date.now()}-${uuidv4()}-${filename}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
    ACL: "public-read",
  };

  const result = await s3.upload(params).promise();
  return result.Location; // Публичный URL
};
