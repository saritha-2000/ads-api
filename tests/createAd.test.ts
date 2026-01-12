import { handler } from "../src/handlers/createAd";
import { APIGatewayProxyResult } from "aws-lambda";
import { putAd } from "../src/services/dynamo";
import { uploadImage } from "../src/services/s3";
import { isAuthorized } from "../src/utils/auth";

jest.mock("../src/services/dynamo");
jest.mock("../src/services/s3");
jest.mock("../src/utils/auth");

test("returns 401 when api key missing", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(false);
  const event = { headers: {}, body: "{}" } as any;
  const context = {} as any;
  const callback = () => {};
  
  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(401);
});

test("returns 201 when ad created successfully", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(true);
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
  (isAuthorized as jest.Mock).mockResolvedValue(true);
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

test("returns 400 when title is missing", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(true);

  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
    body: JSON.stringify({
      price: 100,
    }),
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(400);
  expect(res.body).toBe("Invalid input");
});

test("returns 400 when title is too short", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(true);

  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
    body: JSON.stringify({
      title: "AB",
      price: 100,
    }),
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(400);
  expect(res.body).toBe("Invalid input");
});

test("returns 400 when price is negative", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(true);

  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
    body: JSON.stringify({
      title: "Valid Title",
      price: -10,
    }),
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(400);
  expect(res.body).toBe("Invalid input");
});

test("returns 400 when title is empty string", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(true);

  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
    body: JSON.stringify({
      title: "",
      price: 100,
    }),
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(400);
  expect(res.body).toBe("Invalid input");
});

test("returns 400 when price is undefined", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(true);

  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
    body: JSON.stringify({
      title: "Valid Title",
    }),
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(400);
  expect(res.body).toBe("Invalid input");
});

test("handles null event body", async () => {
  (isAuthorized as jest.Mock).mockResolvedValue(true);

  const event = {
    headers: { "x-api-key": process.env.API_KEY! },
    body: null,
  } as any;
  const context = {} as any;
  const callback = () => {};

  const res = (await handler(event, context, callback)) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(400);
  expect(res.body).toBe("Invalid input");
});