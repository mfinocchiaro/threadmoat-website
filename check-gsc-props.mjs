import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^"(.*)"$/, '$1');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

const sql = neon(process.env.DATABASE_URL);

async function check() {
  console.log('Checking GSC properties...');
  const properties = await sql`SELECT id, user_id, property_url, sync_status FROM gsc_properties`;
  console.log('All properties:', JSON.stringify(properties, null, 2));

  console.log('\nChecking users table...');
  const users = await sql`SELECT id, email FROM users LIMIT 1`;
  console.log('First user:', JSON.stringify(users[0], null, 2));
}

check().catch(console.error);
