import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const schemaUrl = process.env.COSTLOCKER_API_URL;

if (!schemaUrl) {
  // Fail fast with a helpful message so users know to set the env var.
  // graphql-codegen will otherwise report a generic "Invalid Codegen Configuration".
  console.error(
    "ERROR: COSTLOCKER_API_URL environment variable is not set.\nPlease set COSTLOCKER_API_URL in your environment or in a .env file (e.g. COSTLOCKER_API_URL='https://api.example.com/graphql') and retry."
  );
  // Exit with non-zero so calling process (e.g. npm script) fails fast.
  process.exit(1);
}

const config: CodegenConfig = {
  overwrite: true,
  schema: schemaUrl,
  generates: {
    "./generated/graphql.ts": {
      plugins: ["typescript"],
    },
  },
};

export default config;
