import { handler } from "../src/handlers/getAllAds";
import { APIGatewayProxyResult } from "aws-lambda";
import { getAllAds } from "../src/services/dynamo";
import { isAuthorized } from "../src/utils/auth";

jest.mock("../src/services/dynamo");
jest.mock("../src/utils/auth");

test("returns 401 when api key missing", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(false);
  const event = { headers: {} } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(401);
});

test("returns 200 with ads when authorized", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(true);
  const mockAds = [
    {
      adId: "123",
      title: "Test Ad",
      price: 100,
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  ];

  (getAllAds as jest.Mock).mockResolvedValue(mockAds);

  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(200);
  expect(JSON.parse(res.body)).toEqual(mockAds);
});
