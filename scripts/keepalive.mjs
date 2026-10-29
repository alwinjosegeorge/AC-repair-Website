import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_jxL51pNhIfZr@ep-fragrant-hill-a138a91s-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(connectionString);

async function keepAlive() {
  const startTime = Date.now();
  try {
    const res = await sql`SELECT 1 as keepalive, NOW() as server_time;`;
    const elapsed = Date.now() - startTime;
    console.log(`[Neon KeepAlive] ✓ Database active & warm (${elapsed}ms) - Server Time: ${res[0].server_time}`);
  } catch (err) {
    console.error(`[Neon KeepAlive] ✗ Ping failed:`, err?.message || err);
    process.exit(1);
  }
}

keepAlive();
