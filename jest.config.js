require("dotenv").config();

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.ts"],
    modulePathIgnorePatterns: ["<rootDir>/.aws-sam"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1"
    }
  };