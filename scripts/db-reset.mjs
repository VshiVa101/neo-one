/**
 * db-reset.mjs
 * Drops ALL tables in the Neon Postgres database.
 * DESTRUCTIVE — run only when data is expendable.
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dir = dirname(fileURLToPath(import.meta.url));

// Manually parse .env (no dotenv dependency needed)
const envContent = readFileSync(resolve(__dir, '../.env'), 'utf-8');
for (const line of envContent.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  const key = t.slice(0, eq).trim();
  const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
  if (!process.env[key]) process.env[key] = val;
}

const connectionString = process.env.DATABASE_URI;
if (!connectionString) {
  console.error('❌ DATABASE_URI not found in .env');
  process.exit(1);
}

console.log('🔌 Connecting to Neon Postgres...');
console.log('   Host:', connectionString.split('@')[1]?.split('/')[0] ?? '(hidden)');

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function run() {
  await client.connect();
  console.log('✅ Connected.\n');

  // List all tables in public schema
  const { rows: tables } = await client.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`
  );

  if (tables.length === 0) {
    console.log('⚠️  Database is already empty. Nothing to drop.');
    await client.end();
    return;
  }

  console.log(`📋 Found ${tables.length} tables to drop:`);
  tables.forEach(({ tablename }) => console.log(`   - ${tablename}`));

  // Drop all at once with CASCADE to handle foreign keys
  const list = tables.map(({ tablename }) => `"${tablename}"`).join(', ');
  console.log('\n🗑️  Dropping all tables with CASCADE...');
  await client.query(`DROP TABLE IF EXISTS ${list} CASCADE;`);

  // Confirm
  const { rows: after } = await client.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
  );

  if (after.length === 0) {
    console.log('✅ All tables dropped. Database is clean and ready for a fresh start.');
  } else {
    console.warn('⚠️  Some tables remain:', after.map(r => r.tablename).join(', '));
  }

  await client.end();
  console.log('🔒 Connection closed.\n');
  console.log('👉 Next step: run  pnpm dev  and Payload will recreate the full schema automatically.');
}

run().catch(err => {
  console.error('\n❌ Fatal error during DB reset:', err.message);
  process.exit(1);
});
