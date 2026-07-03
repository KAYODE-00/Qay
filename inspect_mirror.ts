import { getQayAdmin } from './qay/lib/supabase-admin';
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
  const supabase = getQayAdmin();
  const { data: mirror, error } = await supabase
    .from('qay_template_mirrors')
    .select('*')
    .eq('source_template_id', 'tpl-mp14wlx19az7n')
    .maybeSingle();

  if (error) {
    console.error('Error fetching mirror:', error);
  } else {
    console.log('Mirror Record:', mirror);
  }
}

main().catch(console.error);
