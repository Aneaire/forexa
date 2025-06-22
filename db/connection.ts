import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "../config/env";
import * as schema from "./schema";

// Create postgres connection
const connectionString = config.databaseUrl;
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export for use in other files
export { client };
