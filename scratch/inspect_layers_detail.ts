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

  const { data: allLayers, error: layersErr } = await supabase.from('page_layers')
    .select('*');

  if (layersErr) {
    console.error('Error fetching layers:', layersErr);
  } else if (allLayers && allLayers.length > 0) {
    console.log('Available columns in page_layers:', Object.keys(allLayers[0]));
  }
  console.log('Total page layers found in DB:', allLayers?.length);
  const sitePages = await supabase.from('pages')
    .select('id, name, is_published')
    .contains('settings', { qay_site_id: siteId });

  console.log('Site pages:', sitePages.data);

  const sitePageIds = sitePages.data?.map((p: any) => p.id) || [];
  const siteLayers = allLayers?.filter((l: any) => sitePageIds.includes(l.page_id));

  console.log('Layers for this site:', siteLayers?.map((l: any) => ({
    id: l.id,
    page_id: l.page_id,
    is_published: l.is_published
  })));

  if (siteLayers && siteLayers.length > 0) {
    console.log('First layer content sample:', JSON.stringify(siteLayers[0].layers, null, 2));
  }
}

main().catch(console.error);
