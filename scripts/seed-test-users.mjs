/**
 * Seed test users for free and paid tier testing.
 *
 * Usage: node scripts/seed-test-users.mjs
 *
 * Requires DATABASE_URL in .env.local
 */
import { readFileSync } from 'fs'
import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'

// Load .env.local manually (no dotenv dependency needed)
const envContent = readFileSync('.env.local', 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    const val = match[2].trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

const sql = neon(process.env.DATABASE_URL)

const TEST_PASSWORD = 'TestUser123!'
const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12)

const users = [
  {
    email: 'free@threadmoat-test.com',
    fullName: 'Free Test User',
    company: 'TestCorp',
    title: 'Analyst',
    profileType: 'vc_investor',
    subscription: null, // no subscription = free tier
  },
  {
    email: 'paid@threadmoat-test.com',
    fullName: 'Paid Test User',
    company: 'PremiumCorp',
    title: 'VP Strategy',
    profileType: 'oem_enterprise',
    subscription: 'active',
  },
]

for (const u of users) {
  console.log(`\nProcessing ${u.email}...`)

  // Clean up existing test user if present
  const existing = await sql`SELECT id FROM users WHERE email = ${u.email}`
  if (existing.length > 0) {
    const userId = existing[0].id
    await sql`DELETE FROM subscriptions WHERE user_id = ${userId}`
    await sql`DELETE FROM profiles WHERE id = ${userId}`
    await sql`DELETE FROM users WHERE id = ${userId}`
    console.log(`  Cleaned up existing user ${userId}`)
  }

  // Create user (already verified)
  const [user] = await sql`
    INSERT INTO users (email, password_hash, email_verified)
    VALUES (${u.email}, ${passwordHash}, true)
    RETURNING id
  `
  console.log(`  Created user ${user.id}`)

  // Create profile
  await sql`
    INSERT INTO profiles (id, full_name, company, title, profile_type)
    VALUES (${user.id}, ${u.fullName}, ${u.company}, ${u.title}, ${u.profileType})
  `
  console.log(`  Created profile`)

  // Create subscription if paid
  if (u.subscription) {
    const now = new Date()
    const oneYearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    await sql`
      INSERT INTO subscriptions (user_id, status, current_period_start, current_period_end)
      VALUES (${user.id}, ${u.subscription}, ${now.toISOString()}, ${oneYearFromNow.toISOString()})
    `
    console.log(`  Created ${u.subscription} subscription (expires ${oneYearFromNow.toISOString().split('T')[0]})`)
  } else {
    console.log(`  No subscription (free tier)`)
  }
}

console.log('\n--- Test Credentials ---')
console.log(`Free user:  free@threadmoat-test.com / ${TEST_PASSWORD}`)
console.log(`Paid user:  paid@threadmoat-test.com / ${TEST_PASSWORD}`)
console.log('------------------------\n')
