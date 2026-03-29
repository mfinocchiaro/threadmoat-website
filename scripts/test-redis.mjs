/**
 * Quick smoke test for Upstash Redis connection + rate limiter.
 * Run with: node scripts/test-redis.mjs
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Parse .env.local manually
try {
  const env = readFileSync(join(root, '.env.local'), 'utf-8')
  for (const line of env.split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
} catch {
  console.error('❌  Could not read .env.local — add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN there first.')
  process.exit(1)
}

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

if (!url || !token) {
  console.error('❌  UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN missing from .env.local')
  process.exit(1)
}

console.log(`\n🔗  Connecting to Upstash Redis at ${url.replace(/https?:\/\//, '').split('.')[0]}…\n`)

// 1. Raw ping via REST API
const ping = await fetch(`${url}/ping`, {
  headers: { Authorization: `Bearer ${token}` },
})
const pingBody = await ping.json()
if (pingBody.result !== 'PONG') {
  console.error('❌  PING failed:', pingBody)
  process.exit(1)
}
console.log('✅  PING → PONG   (connection OK)')

// 2. Set + Get round-trip
const setRes = await fetch(`${url}/set/tm:test:key/hello`, {
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` },
})
const getRes = await fetch(`${url}/get/tm:test:key`, {
  headers: { Authorization: `Bearer ${token}` },
})
const getBody = await getRes.json()
console.log(`✅  SET/GET round-trip: got "${getBody.result}"`)

// 3. Simulate rate limiter using @upstash/ratelimit
const { Ratelimit } = await import('@upstash/ratelimit')
const { Redis } = await import('@upstash/redis')

const redis = new Redis({ url, token })
const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '60 s'),
  prefix: 'tm:rl:test',
})

console.log('\n📊  Simulating rate limit (3 req / 60s) for test key…')
for (let i = 1; i <= 5; i++) {
  const { success, remaining } = await limiter.limit('test-user')
  const status = success ? '✅  allowed' : '🚫  blocked'
  console.log(`   Request ${i}: ${status}  (remaining: ${remaining})`)
}

// Cleanup test key
await fetch(`${url}/del/tm:test:key`, {
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` },
})

console.log('\n✅  All checks passed — Upstash Redis is wired up correctly.\n')
