import "dotenv/config";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import fetch from "cross-fetch";
import type { PaginationInput } from "../generated/graphql";

// Environment variables
const API_URL = process.env.COSTLOCKER_API_URL;
const API_TOKEN = process.env.COSTLOCKER_API_TOKEN;
const REPORT_UUID = process.env.REPORT_UUID;

if (!API_TOKEN) {
  console.error("Error: COSTLOCKER_API_TOKEN environment variable is required");
  console.error("Please create a .env file based on .env.example");
  process.exit(1);
}

//GraphQL Query for report data by uuid
const REPORT_DATA_QUERY = gql`
  query reportData(
    $filter: ReportPayloadFilterInput
    $pagination: PaginationInput!
    $sorting: [ReportDataItemSortingInput!]
    $uuid: String!
  ) {
    reportData(
      filter: $filter
      pagination: $pagination
      sorting: $sorting
      uuid: $uuid
    ) {
      items
      totalItems
    }
  }
`;

type ReportDataResponse = {
  reportData: {
    items: any[];
    totalItems: number;
  };
};

/**
 * Initialize Apollo Client with authentication
 */
function createApolloClient() {
  const httpLink = createHttpLink({
    uri: API_URL,
    fetch,
  });

  const authLink = setContext((_: any, { headers }: any) => {
    return {
      headers: {
        ...headers,
        Authorization: `Static ${API_TOKEN}`,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}

/**
 * Fetch report data
 */
async function fetchReportData(
  client: ApolloClient<any>,
  uuid: string,
  filter?: any,
  pagination: PaginationInput = { page: 1, pageSize: 100 },
  sorting?: any[],
): Promise<{ items: any[]; totalItems: number }> {
  const result = await client.query<ReportDataResponse>({
    query: REPORT_DATA_QUERY,
    variables: {
      uuid,
      filter,
      pagination,
      sorting,
    },
    fetchPolicy: "no-cache",
  });

  const items = result.data.reportData.items || [];
  const totalItems = result.data.reportData.totalItems || 0;

  return {
    items,
    totalItems,
  };
}

/**
 * Main function
 */
async function main() {
  console.log("Fetching report data...\n");

  const client = createApolloClient();

  try {
    const reportUuid = process.env.REPORT_UUID || "";

    if (!reportUuid) {
      console.error("Error: REPORT_UUID environment variable is required");
      process.exit(1);
    }

    console.log(`Fetching report data for UUID: ${reportUuid}...\n`);

    const result = await fetchReportData(client, reportUuid);

    console.log("\n=== Report Data ===");
    console.log(`Total items: ${result.totalItems}`);
    console.log(`Items returned: ${result.items.length}`);
    console.log("\n=== Items ===");
    console.log(JSON.stringify(result.items, null, 2));
  } catch (error: any) {
    console.error("\nFatal error:", error.message);
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach((gqlError: any, index: number) => {
        console.error(`  GraphQL Error [${index + 1}]: ${gqlError.message}`);
        if (gqlError.extensions) {
          console.error(
            `    Extensions: ${JSON.stringify(gqlError.extensions)}`,
          );
        }
      });
    }
    process.exit(1);
  }
}

/**
 * Run the script
 */
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
