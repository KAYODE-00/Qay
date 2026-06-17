import { getQayAdmin } from '../qay/lib/supabase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env manually
try {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const parts = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (parts) {
        const key = parts[1];
        let val = parts[2] || '';
        if (val.length > 0 && val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    });
  }
} catch (e) {
  console.error('Error loading .env file:', e);
}

async function run() {
  try {
    const admin = getQayAdmin();
    console.log('Deleting all custom designs from qay_section_designs...');
    const { data, error } = await admin
      .from('qay_section_designs')
      .delete()
      .neq('site_type', 'none'); // match everything

    if (error) {
      console.error('Error deleting designs:', error);
    } else {
      console.log('Successfully deleted all database-saved designs.');
    }
  } catch (error) {
    console.error('Exception running script:', error);
  }
}

run();
