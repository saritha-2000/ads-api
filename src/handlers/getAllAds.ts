import { APIGatewayProxyHandler } from "aws-lambda";
import { getAllAds } from "../services/dynamo";
import { isAuthorized } from "../utils/auth";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log("requestId:", context.awsRequestId);

  if (!isAuthorized(event.headers)) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const ads = await getAllAds();

  return {
    statusCode: 200,
    body: JSON.stringify(ads),
  };
};
