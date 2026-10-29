import { neon, neonConfig } from "@neondatabase/serverless";

// Fallback to pooler connection string if environment variable is not explicitly injected
const DEFAULT_NEON_URL =
  "postgresql://neondb_owner:npg_jxL51pNhIfZr@ep-fragrant-hill-a138a91s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

export const DATABASE_URL =
  (typeof process !== "undefined" && process.env?.DATABASE_URL) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_DATABASE_URL) ||
  DEFAULT_NEON_URL;

/**
 * Neon Serverless SQL Client instance
 */
export const sql = neon(DATABASE_URL);

/**
 * Health check helper to test database connectivity
 */
export async function checkDatabaseHealth(): Promise<{
  ok: boolean;
  timestamp?: string;
  version?: string;
  error?: string;
}> {
  try {
    const rows = await sql`SELECT NOW() as now, version() as version;`;
    if (rows && rows.length > 0) {
      return {
        ok: true,
        timestamp: String(rows[0].now),
        version: String(rows[0].version),
      };
    }
    return { ok: false, error: "Empty query response" };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || String(err),
    };
  }
}
