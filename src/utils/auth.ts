import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({});

let cachedApiKey: string | null = null;

// uses caching to minimize Secrets Manager API calls
const getApiKey = async (): Promise<string> => {
  if (cachedApiKey) {
    return cachedApiKey;
  }

  const secretName = process.env.API_KEY_SECRET_NAME;
  if (!secretName) {
    throw new Error("API_KEY_SECRET_NAME environment variable is not set");
  }

  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);
    
    if (!response.SecretString) {
      throw new Error("Secret value is empty");
    }

    const secret = JSON.parse(response.SecretString);
    cachedApiKey = secret.apiKey;
    
    if (!cachedApiKey) {
      throw new Error("apiKey not found in secret");
    }

    return cachedApiKey;
  } catch (error) {
    console.error("Error retrieving API key from Secrets Manager:", error);
    throw error;
  }
};

export const isAuthorized = async (headers: any): Promise<boolean> => {
  const apiKey = headers["x-api-key"];
  if (!apiKey) {
    return false;
  }

  try {
    const expectedApiKey = await getApiKey();
    return apiKey === expectedApiKey;
  } catch (error) {
    console.error("Authorization failed:", error);
    return false;
  }
};