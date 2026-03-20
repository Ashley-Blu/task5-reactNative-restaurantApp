// backend/src/db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Database Host:", process.env.DB_HOST);

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection on startup
pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("❌ DATABASE ERROR (Supabase):", err.message);
  } else {
    console.log("✅ CLOUD CONNECTED: Database is running on Supabase.");
  }
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

