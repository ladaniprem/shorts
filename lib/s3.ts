import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { randomUUID } from "crypto"

const getBucketName = () =>
    process.env.AWS_S3_BUCKET_NAME ||
    process.env.AWS_BUCKET_NAME ||
    process.env.S3_BUCKET_NAME ||
    ""

let s3ClientInstance: S3Client | null = null;
const getS3Client = () => {
    if (!s3ClientInstance) {
        s3ClientInstance = new S3Client({
            region: process.env.AWS_REGION || "",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
            }
        });
    }
    return s3ClientInstance;
};

export async function uploadToS3(buffer: Buffer, fileName: string, contentType: string) {
  const bucketName = getBucketName();
  if (!bucketName) throw new Error("Missing S3 bucket name")

  const key = `${randomUUID()}-${fileName}`
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })

  await getS3Client().send(command)
  
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}
