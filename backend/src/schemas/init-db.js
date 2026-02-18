import dotenv from "dotenv";
import { Pool } from "pg";
import { schemaSQL } from "./schema-sql.js";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config({ path: ".env" });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  try {
    await pool.query(schemaSQL);
    console.log("Schema initialized successfully!");
  } catch (err) {
    console.error("Schema initialization failed!", err);
  } finally {
    await pool.end();
  }
}

init();
