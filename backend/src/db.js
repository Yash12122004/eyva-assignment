import { Pool } from "pg";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
