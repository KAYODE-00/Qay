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
  const supabase = getQayAdmin() as any;
  const siteId = 'be28e0a7-d07f-4553-b847-30b1dec0db3b';
  const siteSettings = { qay_site_id: siteId };
  const now = new Date().toISOString();

  console.log('=== Fixing Designfolio mirror site ===');

  // 1. Fetch all draft pages for this site
  const { data: draftPages, error: pagesErr } = await supabase
    .from('pages')
    .select('*')
    .contains('settings', siteSettings)
    .eq('is_published', false)
    .is('deleted_at', null);

  if (pagesErr) {
    console.error('Error fetching draft pages:', pagesErr);
    return;
  }
  console.log(`Found ${draftPages?.length || 0} draft pages`);

  // 2. Fetch all draft page_folders for this site
  const { data: draftFolders, error: foldersErr } = await supabase
    .from('page_folders')
    .select('*')
    .contains('settings', siteSettings)
    .eq('is_published', false)
    .is('deleted_at', null);

  if (foldersErr) {
    console.error('Error fetching draft folders:', foldersErr);
    return;
  }
  console.log(`Found ${draftFolders?.length || 0} draft folders`);

  // 3. Publish folders first
  if (draftFolders && draftFolders.length > 0) {
    const publishedFolders = draftFolders.map((folder: any) => ({
      ...folder,
      is_published: true,
      updated_at: now,
    }));
    for (const f of publishedFolders) {
      delete f.created_at;
    }
    const { error: folderUpsertErr } = await supabase
      .from('page_folders')
      .upsert(publishedFolders, { onConflict: 'id,is_published' });
    if (folderUpsertErr) {
      console.error('Error upserting published folders:', folderUpsertErr);
      return;
    }
    console.log(`Published ${publishedFolders.length} folders`);
  }

  // 4. Publish pages
  if (draftPages && draftPages.length > 0) {
    const publishedPages = draftPages.map((page: any) => ({
      ...page,
      is_published: true,
      updated_at: now,
    }));
    for (const p of publishedPages) {
      delete p.created_at;
    }
    const { error: pageUpsertErr } = await supabase
      .from('pages')
      .upsert(publishedPages, { onConflict: 'id,is_published' });
    if (pageUpsertErr) {
      console.error('Error upserting published pages:', pageUpsertErr);
      return;
    }
    console.log(`Published ${publishedPages.length} pages`);

    // 5. Publish page_layers
    const pageIds = draftPages.map((p: any) => p.id);
    const { data: draftLayers, error: layersErr } = await supabase
      .from('page_layers')
      .select('*')
      .in('page_id', pageIds)
      .eq('is_published', false)
      .is('deleted_at', null);

    if (layersErr) {
      console.error('Error fetching draft layers:', layersErr);
      return;
    }
    console.log(`Found ${draftLayers?.length || 0} draft page_layers`);

    if (draftLayers && draftLayers.length > 0) {
      const publishedLayers = draftLayers.map((layer: any) => ({
        ...layer,
        is_published: true,
        updated_at: now,
      }));
      for (const l of publishedLayers) {
        delete l.created_at;
      }
      const { error: layerUpsertErr } = await supabase
        .from('page_layers')
        .upsert(publishedLayers, { onConflict: 'id,is_published' });
      if (layerUpsertErr) {
        console.error('Error upserting published layers:', layerUpsertErr);
        return;
      }
      console.log(`Published ${publishedLayers.length} page_layers`);
    }
  }

  // 6. Fix site live_url (remove localhost)
  const productionUrl = 'https://qay-theta.vercel.app/template-designfolio-dbfd5a';
  const { error: siteUpdateErr } = await supabase
    .from('qay_sites')
    .update({
      live_url: productionUrl,
      publish_status: 'published',
      updated_at: now,
    })
    .eq('id', siteId);

  if (siteUpdateErr) {
    console.error('Error updating site:', siteUpdateErr);
    return;
  }
  console.log(`Updated site live_url to: ${productionUrl}`);

  // 7. Fix mirror preview_url (remove localhost)
  const { error: mirrorUpdateErr } = await supabase
    .from('qay_template_mirrors')
    .update({
      preview_url: productionUrl,
      updated_at: now,
    })
    .eq('qay_site_id', siteId);

  if (mirrorUpdateErr) {
    console.error('Error updating mirror:', mirrorUpdateErr);
    return;
  }
  console.log(`Updated mirror preview_url to: ${productionUrl}`);

  // 8. Verify
  const { data: verifyPages } = await supabase
    .from('pages')
    .select('id, name, is_published')
    .contains('settings', siteSettings)
    .eq('is_published', true);

  const { data: verifyLayers } = await supabase
    .from('page_layers')
    .select('id, page_id, is_published')
    .eq('is_published', true)
    .in('page_id', draftPages?.map((p: any) => p.id) || []);

  console.log(`\n=== Verification ===`);
  console.log(`Published pages: ${verifyPages?.length || 0}`);
  console.log(`Published layers: ${verifyLayers?.length || 0}`);
  console.log('Done!');
}

main().catch(console.error);
