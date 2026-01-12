import { S3 } from "aws-sdk";

const s3 = new S3();

// upload image to s3 and return url
export const uploadImage = async (adId: string, base64: string) => {
  const buffer = Buffer.from(base64, "base64");

  const key = `ads/${adId}.jpg`;

  await s3
    .putObject({
      Bucket: process.env.IMAGES_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    })
    .promise();

  return `https://${process.env.IMAGES_BUCKET}.s3.amazonaws.com/${key}`;
};