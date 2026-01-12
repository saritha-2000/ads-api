import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { putAd } from "../services/dynamo";
import { uploadImage } from "../services/s3";
import { isAuthorized } from "../utils/auth";

// create a new ad
export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log("requestId:", context.awsRequestId);

  if (!(await isAuthorized(event.headers))) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const body = JSON.parse(event.body || "{}");
  const { title, price, imageBase64 } = body;

  // title must be at least 3 chars, price must be non negative
  if (!title || title.length < 3 || price < 0) {
    return { statusCode: 400, body: "Invalid input" };
  }

  const adId = uuidv4();
  let imageUrl;

  // upload image if provided
  if (imageBase64) {
    imageUrl = await uploadImage(adId, imageBase64);
  }

  await putAd({
    adId,
    title,
    price,
    imageUrl,
    createdAt: new Date().toISOString(),
  });

  return {
    statusCode: 201,
    body: JSON.stringify({ adId }),
  };
};