import { DynamoDB } from "aws-sdk";
import { Ad } from "../types";

const db = new DynamoDB.DocumentClient();

// create or update an ad
export const putAd = async (item: any) => {
  await db
    .put({
      TableName: process.env.ADS_TABLE!,
      Item: item,
    })
    .promise();
};

// get all ads
export const getAllAds = async (): Promise<Ad[]> => {
  const result = await db
    .scan({
      TableName: process.env.ADS_TABLE!,
    })
    .promise();
  return (result.Items || []) as Ad[];
};

// delete ad by adId
export const deleteAd = async (adId: string): Promise<void> => {
  await db
    .delete({
      TableName: process.env.ADS_TABLE!,
      Key: { adId },
    })
    .promise();
};