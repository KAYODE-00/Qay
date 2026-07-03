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

import { YCODE_EXTERNAL_API_URL } from './lib/config';

async function main() {
  const templateId = 'tpl-mp14wlx19az7n';
  const url = `${YCODE_EXTERNAL_API_URL}/api/templates/${encodeURIComponent(templateId)}/apply`;
  console.log('Fetching template from URL:', url);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    throw new Error(`Failed: ${response.status}`);
  }
  const data = await response.json();
  console.log('API response keys:', Object.keys(data));
  const sql = data.sql?.insert || '';
  console.log('SQL insert statement length:', sql.length);
  
  // Find instances of "ucode" or "ycode" in sql
  const ucodeMatches = sql.match(/ucode/gi);
  const ycodeMatches = sql.match(/ycode/gi);
  console.log('Ucode matches count:', ucodeMatches ? ucodeMatches.length : 0);
  console.log('Ycode matches count:', ycodeMatches ? ycodeMatches.length : 0);

  // Let's print some sample lines containing ucode or ycode
  const lines = sql.split('\n');
  let count = 0;
  for (const line of lines) {
    if (line.toLowerCase().includes('ucode') || line.toLowerCase().includes('ycode')) {
      console.log(`Line matches: ${line.substring(0, 180)}...`);
      count++;
      if (count > 25) break;
    }
  }
}

main().catch(console.error);
