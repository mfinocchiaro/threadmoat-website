import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
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

async function applyMigration() {
  try {
    console.log('Applying GSC schema migration...');

    const migrationPath = path.join(__dirname, 'db/migrations/202605051400_gsc_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      await sql.query(statement);
    }

    console.log('✓ Migration applied successfully!');
  } catch (error) {
    console.error('Error applying migration:', error.message);
    process.exit(1);
  }
}

applyMigration();
