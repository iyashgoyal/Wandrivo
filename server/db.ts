import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Safe to log a masked version of the connection string
const dbUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@');
console.log(`Connecting to database: ${dbUrl}`);

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Test database connectivity
(async () => {
  try {
    // Simple query to test connection
    const result = await pool.query('SELECT COUNT(*) FROM packages');
    console.log(`✅ Database connection successful! Found ${result.rows[0].count} packages.`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
})();
