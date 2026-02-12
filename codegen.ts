import type { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
  schema: process.env.COSTLOCKER_API_URL!,
  generates: {
    "./generated/graphql.ts": {
      plugins: ["typescript"],
    },
  },
};

export default config;
