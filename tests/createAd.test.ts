import { handler } from "../src/handlers/createAd";
import { APIGatewayProxyResult } from "aws-lambda";
import { putAd } from "../src/services/dynamo";
import { uploadImage } from "../src/services/s3";

jest.mock("../src/services/dynamo");
jest.mock("../src/services/s3");

test("returns 401 when api key missing", async () => {
  const event = { headers: {}, body: "{}" } as any;
  const context = {} as any;
  const callback = () => {};
  
  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(401);
});

test("returns 201 when ad created successfully", async () => {
  (putAd as jest.Mock).mockResolvedValue(undefined);

  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
    body: JSON.stringify({
      title: "Test Ad Title",
      price: 100,
    }),
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(201);
  const responseBody = JSON.parse(res.body);
  expect(responseBody).toHaveProperty("adId");
  expect(typeof responseBody.adId).toBe("string");
  expect(putAd).toHaveBeenCalledWith(
    expect.objectContaining({
      title: "Test Ad Title",
      price: 100,
      adId: expect.any(String),
      createdAt: expect.any(String),
    })
  );
});

test("returns 201 when ad created successfully with image", async () => {
  (putAd as jest.Mock).mockResolvedValue(undefined);
  (uploadImage as jest.Mock).mockResolvedValue("https://example.com/image.jpg");

  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
    body: JSON.stringify({
      title: "Test Ad with Image",
      price: 200,
      imageBase64: "base64encodedimage",
    }),
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(201);
  const responseBody = JSON.parse(res.body);
  expect(responseBody).toHaveProperty("adId");
  expect(uploadImage).toHaveBeenCalled();
  expect(putAd).toHaveBeenCalledWith(
    expect.objectContaining({
      title: "Test Ad with Image",
      price: 200,
      imageUrl: "https://example.com/image.jpg",
      adId: expect.any(String),
      createdAt: expect.any(String),
    })
  );
});