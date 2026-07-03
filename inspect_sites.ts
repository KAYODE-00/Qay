import Module from 'module';
import * as path from 'path';
import * as fs from 'fs';

// Mock server-only and handle alias resolution for @/
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'server-only') {
    return {};
  }
  if (id.startsWith('@/')) {
    const resolvedPath = path.join(__dirname, id.substring(2));
    return originalRequire.call(this, resolvedPath);
  }
  return originalRequire.apply(this, arguments as any);
};

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

import { getQayAdmin } from './qay/lib/supabase-admin';

async function main() {
  const supabase = getQayAdmin();
  const { data: sites, error } = await supabase
    .from('qay_sites')
    .select('*')
    .ilike('name', '%Designfolio%');

  if (error) {
    console.error('Error fetching sites:', error);
  } else {
    console.log('Designfolio sites count:', sites?.length);
    console.log('Sites:', sites);
  }
}

main().catch(console.error);
