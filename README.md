# Ads API - AWS Serverless Application

A serverless REST API built with AWS Lambda, TypeScript, DynamoDB, and S3 for managing advertisements. The API allows creating, retrieving, and deleting ads with optional image uploads.

## Technologies Used

- **Runtime**: Node.js 18.x
- **Language**: TypeScript
- **Framework**: AWS SAM (Serverless Application Model)
- **Compute**: AWS Lambda
- **Database**: Amazon DynamoDB
- **Storage**: Amazon S3
- **API Gateway**: AWS API Gateway (REST API)
- **Secrets Management**: AWS Secrets Manager
- **Testing**: Jest
- **Build Tool**: esbuild

## Project Structure

```
ads-api/
├── src/
│   ├── handlers/          # Lambda function handlers
│   │   ├── createAd.ts   # POST /ads endpoint
│   │   ├── getAllAds.ts  # GET /ads endpoint
│   │   └── deleteAd.ts   # DELETE /ads/{adId} endpoint
│   ├── services/         # AWS service integrations
│   │   ├── dynamo.ts    # DynamoDB operations
│   │   └── s3.ts        # S3 image upload
│   ├── utils/           # Utility functions
│   │   └── auth.ts      # API key authentication
│   └── types.ts         # TypeScript type definitions
├── tests/               # Unit tests
├── template.yaml        # AWS SAM template
├── samconfig.toml       # SAM deployment configuration
├── jest.config.js       # Jest configuration
└── tsconfig.json        # TypeScript configuration
```

## Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **AWS CLI** configured with appropriate credentials
- **AWS SAM CLI** installed ([Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
- **AWS Account** with permissions to create Lambda, DynamoDB, S3, API Gateway, and Secrets Manager resources

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/saritha-2000/ads-api
cd ads-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure AWS Credentials

Ensure your AWS CLI is configured with appropriate credentials:

```bash
aws configure
```

### 4. Create API Key Secret in AWS Secrets Manager

Before deploying, create the API key secret in AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
    --name ads-api/api-key \
    --description "API Key for Ads API authentication" \
    --secret-string '{"apiKey":"your-api-key-here"}' \
    --region us-east-1
```

**Note**: Replace `your-api-key-here` with your desired API key and `us-east-1` with your preferred AWS region.

### 5. Build the Application

```bash
sam build
```

### 6. Deploy to AWS

```bash
sam deploy
```

Or deploy with guided prompts:

```bash
sam deploy --guided
```

The deployment will create:
- API Gateway REST API
- Three Lambda functions (Create, Get All, Delete)
- DynamoDB table for storing ads
- S3 bucket for storing ad images
- IAM roles and policies

## API Endpoints
**Headers:**
- `x-api-key`: It's in the env file as well as in the postman json export

### POST /ads
- https://ip0qkma8k9.execute-api.ap-south-1.amazonaws.com/Prod/ads

**Request Body:**
```json
{
  "title": "Product Name",
  "price": 99.99,
  "imageBase64": "base64-encoded-image-string"
}
```

**Validation:**
- `title`: Required, minimum 3 characters
- `price`: Required, must be non-negative number
- `imageBase64`: Optional, base64-encoded image string

**Response (201 Created):**
```json
{
  "adId": "uuid-generated-id"
}
```

### GET /ads
- https://ip0qkma8k9.execute-api.ap-south-1.amazonaws.com/Prod/ads

**Response (200 OK):**
```json
[
  {
    "adId": "uuid",
    "title": "Product Name",
    "price": 99.99,
    "imageUrl": "https://bucket.s3.amazonaws.com/ads/uuid.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### DELETE /ads/{adId}
- https://ip0qkma8k9.execute-api.ap-south-1.amazonaws.com/Prod/ads/{adId}

**Path Parameters:**
- `adId`: Advertisement ID (required)

**Response (200 OK):**
```json
{
  "message": "Ad deleted successfully"
}
```

## Postman Examples

Below are screenshots demonstrating testing endpoints in postman

<img width="1361" height="761" alt="Screenshot 2026-01-13 at 01 51 42" src="https://github.com/user-attachments/assets/8f080a33-a81b-4f2b-8aca-b678ed6cd0ad" />

<img width="1361" height="789" alt="Screenshot 2026-01-13 at 01 52 13" src="https://github.com/user-attachments/assets/e66831a2-a8b7-48c1-837f-830b392673dd" />

<img width="1361" height="789" alt="Screenshot 2026-01-13 at 01 52 29" src="https://github.com/user-attachments/assets/f2e0d859-96bd-40ce-9299-ad3b767e888d" />

## Running Unit Tests

Add provided .env file to the repository

### Run All Tests

```bash
npm test
```
### Run Specific Test File

```bash
npm test -- createAd.test.ts
```

## Test Coverage

The project includes unit tests for:
- ✅ API key authentication
- ✅ Ad creation with and without images
- ✅ Input validation with title length, price validation
- ✅ Error handling (unauthorized requests, missing parameters)

### Running Test Coverage

To generate a test coverage report:

```bash
npm run test:coverage
```

Or using the test command with coverage flag:

```bash
npm test -- --coverage
```

This will:
- Run all tests
- Generate a coverage report showing:

**Output:**

<img width="591" height="290" alt="Screenshot 2026-01-13 at 01 35 34" src="https://github.com/user-attachments/assets/5e86ab9f-0755-42a4-9e6b-22fb569ff1ce" />


## GitHub Actions Workflow

The project includes a GitHub Actions workflow (`.github/workflows/test.yml`) that:
- Runs on push and pull requests
- Installs dependencies
- Runs unit tests
- Validates TypeScript compilation

## Known Issues and Limitations

1. **Image Format**: Images are accepted as base64-encoded strings and stored in S3 with `.jpg` extension. The API does not validate the actual image format - any base64 string will be decoded and stored as JPEG.

2. **S3 Bucket**: The bucket is configured for public read access. Ensure this aligns with your security requirements.

3. **Rate Limiting**: No rate limiting is implemented.

4. **CORS**: CORS is not configured. Add CORS headers if accessing from web browsers.

5. **Image Size**: No validation for image size. Consider adding limits to prevent large uploads.

## Security

- API key is stored securely in AWS Secrets Manager
- IAM roles follow least privilege principle
- S3 bucket policy allows public read

### View Logs

Logs are stored in AWS CloudWatch. You can view logs directly in the AWS CloudWatch Console under the Log Groups for each Lambda function.

## Additional Features (Beyond Requirements)

The implementation includes additional features beyond the basic requirements:

- GET /ads endpoint to retrieve all ads
- DELETE /ads/{adId} endpoint to delete ads
- AWS Secrets Manager integration for secure API key storage

## Author

Saritha Indusal Dissanayake
