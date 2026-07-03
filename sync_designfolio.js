const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function loadEnvFile(fileName) {
  try {
    const envPath = path.join(__dirname, fileName);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1);
          } else if (val.startsWith("'") && val.endsWith("'")) {
            val = val.substring(1, val.length - 1);
          }
          process.env[key] = val;
        }
      });
      console.log(`Loaded ${fileName}`);
    }
  } catch (e) {
    console.error(`Failed to parse ${fileName}`, e);
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

async function main() {
  let connectionString = process.env.SUPABASE_CONNECTION_URL;
  if (!connectionString) {
    throw new Error('SUPABASE_CONNECTION_URL is not set in environment.');
  }

  const password = process.env.SUPABASE_DB_PASSWORD || '';
  connectionString = connectionString.replace('[YOUR-PASSWORD]', encodeURIComponent(password));

  console.log('Connecting to PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected successfully!');

  // 1. Get owner ID
  const ownerRes = await client.query("SELECT owner_id FROM qay_sites LIMIT 1");
  if (ownerRes.rows.length === 0) {
    throw new Error('No sites found to extract owner_id.');
  }
  const ownerId = ownerRes.rows[0].owner_id;
  console.log('Using ownerId:', ownerId);

  // 2. Check if mirror site already exists
  const slug = 'template-designfolio-demo';
  let siteId = '';
  const siteCheck = await client.query("SELECT id FROM qay_sites WHERE slug = $1", [slug]);
  if (siteCheck.rows.length > 0) {
    siteId = siteCheck.rows[0].id;
    console.log('Found existing site:', siteId);
  } else {
    const siteRes = await client.query(
      "INSERT INTO qay_sites (owner_id, name, slug, publish_status, plan) VALUES ($1, $2, $3, 'published', 'pro') RETURNING id",
      [ownerId, 'Designfolio Demo', slug]
    );
    siteId = siteRes.rows[0].id;
    console.log('Created new site:', siteId);
    await client.query("INSERT INTO qay_site_ycode_link (qay_site_id) VALUES ($1)", [siteId]);
  }

  // 3. Fetch template insert SQL
  const templateUrl = 'https://templates-virid.vercel.app/api/templates/tpl-mp14wlx19az7n/apply';
  console.log('Fetching apply payload from template service...');
  const response = await fetch(templateUrl, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Failed to fetch apply payload: ${response.status}`);
  }
  const payload = await response.json();
  const insertSql = payload.sql.insert;

  // 4. Digest ucode -> qay
  console.log('Digesting template SQL (replacing ucode with qay)...');
  const cleanedSql = insertSql
    .replace(/ucode\.ms/g, 'qay.so')
    .replace(/ucode/g, 'qay')
    .replace(/Ucode/g, 'Qay')
    .replace(/UCODE/g, 'QAY');

  // 5. Execute transaction
  console.log('Applying template data to database...');
  await client.query('SET session_replication_role = replica');
  try {
    await client.query(cleanedSql);
    console.log('Template SQL applied successfully!');
  } finally {
    await client.query('SET session_replication_role = DEFAULT');
  }

  // 6. Tag imported pages & folders with site ID
  console.log('Tagging imported pages and folders...');
  await client.query(
    "UPDATE pages SET settings = coalesce(settings, '{}'::jsonb) || jsonb_build_object('qay_site_id', $1) WHERE settings->>'qay_site_id' IS NULL",
    [siteId]
  );
  await client.query(
    "UPDATE page_folders SET settings = coalesce(settings, '{}'::jsonb) || jsonb_build_object('qay_site_id', $1) WHERE settings->>'qay_site_id' IS NULL",
    [siteId]
  );

  // 7. Update homepage index slug
  console.log('Updating homepage index slug...');
  await client.query(
    "UPDATE pages SET slug = 'index-' || $1, is_index = true, is_published = true WHERE is_index = true AND page_folder_id IS NULL AND error_page IS NULL AND settings->>'qay_site_id' = $1",
    [siteId]
  );
  
  // Make all pages published for demo
  await client.query(
    "UPDATE pages SET is_published = true WHERE settings->>'qay_site_id' = $1",
    [siteId]
  );

  // 8. Register ready mirror record
  const previewUrl = `https://qay-theta.vercel.app/${slug}`;
  console.log('Registering template mirror as ready with previewUrl:', previewUrl);
  await client.query(`
    INSERT INTO qay_template_mirrors (source, source_template_id, source_template_name, qay_site_id, status, preview_url)
    VALUES ('ycode', 'tpl-mp14wlx19az7n', 'Designfolio', $1, 'ready', $2)
    ON CONFLICT (source, source_template_id)
    DO UPDATE SET qay_site_id = EXCLUDED.qay_site_id, status = 'ready', preview_url = EXCLUDED.preview_url, updated_at = now()
  `, [siteId, previewUrl]);

  console.log('All done! Sync successfully completed.');
  await client.end();
}

main().catch(async (err) => {
  console.error('Sync failed:', err);
});
