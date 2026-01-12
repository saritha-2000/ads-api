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
- https://ity25v0f5a.execute-api.us-east-1.amazonaws.com/Prod/ads

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
- https://ity25v0f5a.execute-api.us-east-1.amazonaws.com/Prod/ads

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
- https://ity25v0f5a.execute-api.us-east-1.amazonaws.com/Prod/ads/{adId}

**Path Parameters:**
- `adId`: Advertisement ID (required)

**Response (200 OK):**
```json
{
  "message": "Ad deleted successfully"
}
```

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
- Create a `coverage/` directory with detailed HTML reports

The coverage report will be displayed in the terminal and also generated as HTML files in the `coverage/` directory. You can open `coverage/lcov-report/index.html` in your browser to view a detailed, interactive coverage report with visual indicators.

**Output:**

## Local Development

### Run Tests Locally

```bash
npm test
```

### Build TypeScript

```bash
npm run build
```


## GitHub Actions Workflow

The project includes a GitHub Actions workflow (`.github/workflows/test.yml`) that:
- Runs on push and pull requests
- Installs dependencies
- Runs unit tests
- Validates TypeScript compilation

## Known Issues and Limitations

1. **Image Format**: Currently supports JPEG images only. Images are automatically converted and stored as `.jpg` files.

2. **S3 Bucket**: The bucket is configured for public read access. Ensure this aligns with your security requirements.

3. **Rate Limiting**: No rate limiting is implemented.

4. **CORS**: CORS is not configured. Add CORS headers if accessing from web browsers.

5. **Image Size**: No validation for image size. Consider adding limits to prevent large uploads.

## Security

- API key is stored securely in AWS Secrets Manager
- IAM roles follow least privilege principle
- S3 bucket policy allows public read

## Cost Estimation

Approximate monthly costs (varies by usage):
- Lambda: $0.20 per 1M requests
- DynamoDB: On-demand pricing (~$1.25 per million requests)
- S3: $0.023 per GB storage + $0.0004 per 1,000 requests
- API Gateway: $3.50 per million requests
- Secrets Manager: $0.40 per secret per month

### View Logs

Logs are stored in AWS CloudWatch. You can view logs directly in the AWS CloudWatch Console under the Log Groups for each Lambda function.

## Additional Features (Beyond Requirements)

The implementation includes additional features beyond the basic requirements:

- ✅ GET /ads endpoint to retrieve all ads
- ✅ DELETE /ads/{adId} endpoint to delete ads
- ✅ AWS Secrets Manager integration for secure API key storage
- ✅ Comprehensive unit test coverage
- ✅ TypeScript type safety throughout
- ✅ Structured logging with request IDs


## Author

Saritha Indusal Dissanayake