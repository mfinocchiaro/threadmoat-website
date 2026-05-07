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

async function populateTestData() {
  try {
    console.log('Creating test GSC property...');

    // First, get a user ID (we'll use the admin user or the first user)
    const users = await sql`SELECT id FROM users LIMIT 1`;
    if (!users.length) {
      console.error('No users found in database. Please create a user first.');
      process.exit(1);
    }

    const userId = users[0].id;
    console.log('Using user ID:', userId);

    // Create a test GSC property
    const propertyUrl = 'https://threadmoat.com';

    const result = await sql`
      INSERT INTO gsc_properties (user_id, property_url, sync_status, created_at, updated_at)
      VALUES (${userId}, ${propertyUrl}, 'success', now(), now())
      ON CONFLICT (user_id, property_url) DO UPDATE SET updated_at = now()
      RETURNING id
    `;

    const propertyId = result[0].id;

    console.log('✓ Created test property:', propertyId);

    // Insert 30 days of test rankings data
    console.log('Inserting 30 days of test rankings data...');

    const queries = [];
    const keywords = [
      'industrial ai',
      'ai manufacturing',
      'manufacturing analytics',
      'production optimization',
      'predictive maintenance',
      'supply chain ai',
      'quality control automation',
      'factory automation',
    ];

    const pages = [
      'https://threadmoat.com/',
      'https://threadmoat.com/reports/industrial-ai',
      'https://threadmoat.com/insights/manufacturing',
      'https://threadmoat.com/companies',
    ];

    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
      const date = new Date();
      date.setDate(date.getDate() - dayOffset);
      const dateStr = date.toISOString().split('T')[0];

      // Create 4-5 random rankings per day
      const numRankings = 4 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numRankings; i++) {
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        const page = pages[Math.floor(Math.random() * pages.length)];
        const clicks = Math.floor(Math.random() * 100) + 5;
        const impressions = clicks * (8 + Math.random() * 4);
        const ctr = clicks / impressions;
        const position = 2 + Math.random() * 8;

        queries.push(
          sql`
            INSERT INTO gsc_daily_rankings (
              property_id, date, query, page, clicks, impressions, ctr, position, synced_at
            ) VALUES (
              ${propertyId}, ${dateStr}, ${keyword}, ${page},
              ${clicks}, ${Math.floor(impressions)}, ${ctr}, ${position}, now()
            )
            ON CONFLICT (property_id, date, query, page)
            DO UPDATE SET
              clicks = EXCLUDED.clicks,
              impressions = EXCLUDED.impressions,
              ctr = EXCLUDED.ctr,
              position = EXCLUDED.position,
              synced_at = EXCLUDED.synced_at
          `
        );
      }
    }

    // Execute queries in batches to avoid connection issues
    const batchSize = 10;
    for (let i = 0; i < queries.length; i += batchSize) {
      const batch = queries.slice(i, i + batchSize);
      await Promise.all(batch);
      console.log(`  Inserted ${Math.min(i + batchSize, queries.length)}/${queries.length} records...`);
    }
    console.log(`✓ Inserted ${queries.length} test ranking records`);

    // Create sync log entry
    await sql`
      INSERT INTO gsc_sync_logs (
        synced_at, properties_synced, properties_failed, total_rows, errors, duration
      ) VALUES (
        now(), 1, 0, ${queries.length}, '[]', 5000
      )
    `;

    console.log('✓ Created sync log entry');
    console.log('\n✅ Test data populated successfully!');
    console.log(`Property ID: ${propertyId}`);
    console.log(`Property URL: ${propertyUrl}`);
    console.log('\nNow visit: http://localhost:3000/dashboard/gsc');
    console.log('Select the property and you should see the trends chart!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

populateTestData();
