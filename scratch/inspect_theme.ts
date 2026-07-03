import Module from 'module';
import * as path from 'path';
import * as fs from 'fs';

// Mock server-only and handle alias resolution for @/
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'server-only') return {};
  if (id.startsWith('@/')) {
    return originalRequire.call(this, path.join(__dirname, '../qay', id.substring(2)));
  }
  return originalRequire.apply(this, arguments as any);
};

// Load env
const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const envLocalPath = path.join(rootDir, '.env.local');

function loadEnv(p: string) {
  if (fs.existsSync(p)) {
    const lines = fs.readFileSync(p, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }
}
loadEnv(envPath);
loadEnv(envLocalPath);

import { getQayAdmin } from '../qay/lib/supabase-admin';

async function main() {
  const supabase = getQayAdmin() as any;
  const siteId = 'be28e0a7-d07f-4553-b847-30b1dec0db3b';

  const { data: site } = await supabase.from('qay_sites').select('*').eq('id', siteId).single();
  console.log('Site Theme Settings:', site?.theme);

  const { data: pages } = await supabase.from('pages')
    .select('id, name, slug, settings')
    .contains('settings', { qay_site_id: siteId })
    .eq('is_published', true);

  console.log('\nPublished Pages:');
  console.log(JSON.stringify(pages, null, 2));

  const { data: layers } = await supabase.from('page_layers')
    .select('id, page_id, name, content')
    .eq('is_published', true)
    .in('page_id', pages?.map((p: any) => p.id) || []);

  console.log('\nLayers (subset of content styles):');
  for (const layer of (layers || [])) {
    console.log(`Page: ${pages?.find((p: any) => p.id === layer.page_id)?.name}, Layer: ${layer.name}`);
    if (layer.content?.html) {
      // Find classes containing bg-
      const bgClasses = layer.content.html.match(/class="[^"]*bg-[^"]*"/g);
      if (bgClasses) {
        console.log('  Bg classes:', bgClasses);
      }
    }
  }
}

main().catch(console.error);
