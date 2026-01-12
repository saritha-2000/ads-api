export const isAuthorized = (headers: any): boolean => {
    const apiKey = headers["x-api-key"];
    const expectedApiKey = process.env.API_KEY;
    return apiKey !== undefined && expectedApiKey !== undefined && apiKey === expectedApiKey;
  };