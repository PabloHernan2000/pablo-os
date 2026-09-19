import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { enviroment } from "../config/enviroment.js";

export const pool = new Pool({
    connectionString: enviroment.DATABASE_URL!,
});

export const db = drizzle({ client: pool });