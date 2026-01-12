import { handler } from "../src/handlers/deleteAd";
import { APIGatewayProxyResult } from "aws-lambda";
import { deleteAd } from "../src/services/dynamo";
import { isAuthorized } from "../src/utils/auth";

jest.mock("../src/services/dynamo");
jest.mock("../src/utils/auth");

test("returns 401 when api key missing", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(false);
  const event = { headers: {}, pathParameters: { adId: "123" } } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(401);
});

test("returns 400 when adId missing", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(true);
  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
    pathParameters: {},
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(400);
});

test("returns 200 when ad deleted successfully", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(true);
  (deleteAd as jest.Mock).mockResolvedValue(undefined);

  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
    pathParameters: { adId: "123" },
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(200);
  expect(deleteAd).toHaveBeenCalledWith("123");
  expect(JSON.parse(res.body)).toEqual({ message: "Ad deleted successfully" });
});
