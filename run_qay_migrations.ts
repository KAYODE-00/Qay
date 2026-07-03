// @ts-ignore
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

function loadEnvFile(fileName: string) {
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
  const connectionString = process.env.SUPABASE_CONNECTION_URL;
  if (!connectionString) {
    throw new Error('SUPABASE_CONNECTION_URL is not set in environment.');
  }

  console.log('Connecting to PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected successfully!');

  const migrationsDir = path.join(__dirname, 'qay', 'database', 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} SQL migrations to verify/run.`);

  for (const file of files) {
    console.log(`Running migration: ${file}...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    try {
      await client.query(sql);
      console.log(`Successfully completed migration: ${file}`);
    } catch (err) {
      console.error(`Error running migration ${file}:`, err);
    }
  }

  try {
    console.log('Notifying PostgREST to reload schema...');
    await client.query("NOTIFY pgrst, 'reload schema'");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('PostgREST notification sent successfully.');
  } catch (err) {
    console.error('Failed to notify PostgREST:', err);
  }

  await client.end();
}

main().catch((err) => {
  console.error('Migration runner failed:', err);
});
