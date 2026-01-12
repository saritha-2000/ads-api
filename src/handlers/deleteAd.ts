import { APIGatewayProxyHandler } from "aws-lambda";
import { deleteAd } from "../services/dynamo";
import { isAuthorized } from "../utils/auth";

// delete ad by id
export const handler: APIGatewayProxyHandler = async (event, context) => {
  console.log("requestId:", context.awsRequestId);

  if (!isAuthorized(event.headers)) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const adId = event.pathParameters?.adId;

  // validate adId is provided
  if (!adId) {
    return { statusCode: 400, body: "Missing adId parameter" };
  }

  await deleteAd(adId);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Ad deleted successfully" }),
  };
};
