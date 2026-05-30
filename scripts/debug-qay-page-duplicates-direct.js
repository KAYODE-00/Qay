/* global require, process, console */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function readEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function main() {
  const env = readEnv(path.join(process.cwd(), '.env'));
  const connectionUrl = String(env.SUPABASE_CONNECTION_URL || '').replace('[YOUR-PASSWORD]', env.SUPABASE_DB_PASSWORD || '');

  const client = new Client({
    connectionString: connectionUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const result = await client.query(`
    select
      slug,
      is_published,
      coalesce(page_folder_id, '00000000-0000-0000-0000-000000000000'::uuid) as folder_key,
      coalesce(error_page, 0) as error_key,
      coalesce(settings->>'qay_site_id', '__ycode_global__') as site_key,
      count(*) as duplicate_count,
      array_agg(id order by created_at asc, id asc) as ids,
      array_agg(name order by created_at asc, id asc) as names,
      array_agg(created_at order by created_at asc, id asc) as created_ats
    from pages
    where deleted_at is null
    group by 1,2,3,4,5
    having count(*) > 1
    order by duplicate_count desc, site_key, error_key, slug
  `);

  console.log(JSON.stringify(result.rows, null, 2));
  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
