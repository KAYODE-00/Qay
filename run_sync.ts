import Module from 'module';
import * as path from 'path';
import * as fs from 'fs';

// Mock server-only and handle alias resolution for @/
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'server-only') {
    return {};
  }
  // Mock migrations-loader to avoid Webpack require.context error in node environment
  if (id.endsWith('migrations-loader') || id.includes('migrations-loader')) {
    const migrationsDir = path.join(__dirname, 'database/migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.ts'))
      .sort();
    
    const migrations = files.map(file => {
      const filePath = path.join(migrationsDir, file);
      const migration = originalRequire.call(this, filePath);
      return {
        name: file,
        up: migration.up,
        down: migration.down,
      };
    });
    return { migrations };
  }
  if (id.startsWith('@/')) {
    const resolvedPath = path.join(__dirname, id.substring(2));
    return originalRequire.call(this, resolvedPath);
  }
  return originalRequire.apply(this, arguments as any);
};

import { ensureQayTemplateMirror } from './qay/lib/template-mirror-sync';
import { getQayAdmin } from './qay/lib/supabase-admin';

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
  const templateId = 'tpl-mp14wlx19az7n';
  const ownerId = '9baedf4e-12b4-4919-a841-9dee9b29a8d2';
  console.log('Using ownerId:', ownerId);
  
  if (!process.env.QAY_TEMPLATE_MIRROR_SYNC_SECRET) {
    process.env.QAY_TEMPLATE_MIRROR_SYNC_SECRET = process.env.QAY_WEBHOOK_SECRET || 'dtyy5r76rihut6dgityuhutyiipi0t6e5yftftd5dyft5';
  }
  console.log('Using QAY_TEMPLATE_MIRROR_SYNC_SECRET:', process.env.QAY_TEMPLATE_MIRROR_SYNC_SECRET);

  const origin = 'http://localhost:3002'; // Local dev server port
  console.log('Starting ensureQayTemplateMirror...');
  
  try {
    const result = await ensureQayTemplateMirror({
      templateId,
      ownerId,
      origin,
    });
    console.log('Success result:', result);
  } catch (error) {
    console.error('Error during ensureQayTemplateMirror:', error);
  }
}

main().catch(console.error);
