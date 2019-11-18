import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  logger.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
} else if (fs.existsSync(".env.example")) {
  logger.debug(
    "Using .env.example file to supply config environment variables"
  );
  dotenv.config({ path: ".env.example" });
} else {
  logger.error("No .env file. Create a .env file in project root.");
}

export const ENVIRONMENT = process.env.NODE_ENV!;
const prod = ENVIRONMENT === "production";

export const API_KEY = prod ? process.env["API_PK"] : process.env["API_TK"];

if (!API_KEY) {
  logger.error("No client secret. Set API_KEY environment variable.");
  process.exit(1);
}

export const PORT = process.env["PORT"];

if (!PORT) {
  logger.error("No port specified. Set PORT environmental varible.");
  process.exit(1);
}
