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
  const siteId = 'be28e0a7-d07f-4553-b847-30b1dec0db3b';
  
  const { data: sitePages, error: pagesErr } = await supabase
    .from('pages')
    .select('id, name, slug, settings, is_published')
    .contains('settings', { qay_site_id: siteId });

  const { data: siteFolders, error: foldersErr } = await supabase
    .from('page_folders')
    .select('id, name, settings, is_published')
    .contains('settings', { qay_site_id: siteId });

  if (pagesErr || foldersErr) {
    console.error('Error fetching pages or folders:', pagesErr || foldersErr);
    return;
  }

  console.log(`Site ${siteId} - Pages count:`, sitePages?.length);
  for (const page of (sitePages as any[]) || []) {
    console.log(`  Page: id=${page.id}, name="${page.name}", slug="${page.slug}", is_published=${page.is_published}`);
  }

  console.log(`Site ${siteId} - Folders count:`, siteFolders?.length);
  for (const folder of (siteFolders as any[]) || []) {
    console.log(`  Folder: id=${folder.id}, name="${folder.name}", is_published=${folder.is_published}`);
  }

  if (sitePages && sitePages.length > 0) {
    const pageIds = sitePages.map((p: any) => p.id);
    const { data: layers, error: layersErr } = await supabase
      .from('page_layers')
      .select('id, page_id, is_published')
      .in('page_id', pageIds);

    if (layersErr) {
      console.error('Error fetching page layers:', layersErr);
    } else {
      console.log(`Site ${siteId} - Page Layers count:`, layers?.length);
      for (const layer of (layers as any) || []) {
        console.log(`  Layer: id=${layer.id}, page_id=${layer.page_id}, is_published=${layer.is_published}`);
      }
    }
  }
}

main().catch(console.error);
