#!/usr/bin/env node
/**
 * Authenticated Lighthouse testing for dashboard pages.
 *
 * Usage:
 *   PERF_TEST_EMAIL=user@example.com PERF_TEST_PASSWORD=secret node scripts/lighthouse-dashboard.mjs
 *
 * Or with .env.local:
 *   node -e "require('fs').readFileSync('.env.local','utf8').split('\\n').forEach(l=>{const[k,...v]=l.split('=');if(k&&!k.startsWith('#'))process.env[k.trim()]=v.join('=').trim()})" -e "import('./scripts/lighthouse-dashboard.mjs')"
 *
 * Prerequisites:
 *   - Dev server running on localhost:3000 (npx next dev)
 *   - npm install --save-dev puppeteer lighthouse
 */

import puppeteer from 'puppeteer'
import lighthouse from 'lighthouse'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// ─── Configuration ───────────────────────────────────────────────────────────

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const EMAIL = process.env.PERF_TEST_EMAIL
const PASSWORD = process.env.PERF_TEST_PASSWORD
const OUTPUT_DIR = join(process.cwd(), '.gsd', 'lighthouse')

/** Dashboard pages to test — add/remove as needed */
const PAGES = [
  '/dashboard',
  '/dashboard/bubbles',
  '/dashboard/heatmap',
  '/dashboard/periodic-table',
  '/dashboard/investor-stats',
  '/dashboard/landscape',
  '/dashboard/market-momentum',
  '/dashboard/co-investment',
  '/dashboard/reports',
  '/dashboard/tab/financial',
]

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!EMAIL || !PASSWORD) {
    console.error('❌ Set PERF_TEST_EMAIL and PERF_TEST_PASSWORD environment variables')
    console.error('   Example: PERF_TEST_EMAIL=you@example.com PERF_TEST_PASSWORD=secret node scripts/lighthouse-dashboard.mjs')
    process.exit(1)
  }

  mkdirSync(OUTPUT_DIR, { recursive: true })

  console.log('🚀 Launching browser...')
  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-gpu'],
  })

  try {
    // Step 1: Authenticate
    console.log('🔐 Logging in...')
    const page = await browser.newPage()
    await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle2', timeout: 30000 })

    // Fill login form
    await page.type('input[type="email"]', EMAIL)
    await page.type('input[type="password"]', PASSWORD)
    await page.click('button[type="submit"]')

    // Wait for redirect to dashboard
    try {
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 })
    } catch {
      // Sometimes signIn does a hard window.location redirect, not a navigation event
    }

    // Verify we landed on dashboard
    const currentUrl = page.url()
    if (!currentUrl.includes('/dashboard')) {
      console.error(`❌ Login failed — landed on ${currentUrl} instead of /dashboard`)
      console.error('   Check credentials and ensure the account is verified.')
      process.exit(1)
    }
    console.log(`✅ Logged in successfully — at ${currentUrl}`)

    // Extract cookies for Lighthouse
    const cookies = await page.cookies()
    await page.close()

    // Step 2: Run Lighthouse on each page
    const results = []
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

    for (const pagePath of PAGES) {
      const url = `${BASE_URL}${pagePath}`
      const pageName = pagePath.replace(/\//g, '-').replace(/^-/, '') || 'dashboard'

      console.log(`\n📊 Testing: ${pagePath}`)

      try {
        // Create a new page with cookies injected
        const testPage = await browser.newPage()
        await testPage.setCookie(...cookies)

        // Run Lighthouse using the browser's CDP connection
        const { lhr } = await lighthouse(url, {
          port: new URL(browser.wsEndpoint()).port,
          output: 'json',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          formFactor: 'desktop',
          screenEmulation: { disabled: true },
          throttling: {
            // Light throttling for dev server — real production perf differs
            cpuSlowdownMultiplier: 1,
            rttMs: 40,
            throughputKbps: 10240,
          },
          maxWaitForLoad: 45000,
        })

        await testPage.close()

        const scores = {
          performance: Math.round((lhr.categories.performance?.score || 0) * 100),
          accessibility: Math.round((lhr.categories.accessibility?.score || 0) * 100),
          bestPractices: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
          seo: Math.round((lhr.categories.seo?.score || 0) * 100),
        }

        // Check for runtime errors
        if (lhr.runtimeError?.code) {
          console.log(`  ⚠️  Runtime error: ${lhr.runtimeError.message}`)
          results.push({ page: pagePath, error: lhr.runtimeError.message, scores: null })
          continue
        }

        console.log(`  Performance: ${scores.performance} | A11y: ${scores.accessibility} | BP: ${scores.bestPractices} | SEO: ${scores.seo}`)

        results.push({ page: pagePath, scores, error: null })

        // Save individual report
        const reportPath = join(OUTPUT_DIR, `${pageName}_${timestamp}.json`)
        writeFileSync(reportPath, JSON.stringify(lhr, null, 2))

      } catch (err) {
        console.log(`  ❌ Failed: ${err.message}`)
        results.push({ page: pagePath, error: err.message, scores: null })
      }
    }

    // Step 3: Summary
    console.log('\n' + '═'.repeat(70))
    console.log('  LIGHTHOUSE DASHBOARD RESULTS')
    console.log('═'.repeat(70))
    console.log(`  ${'Page'.padEnd(35)} Perf  A11y   BP   SEO`)
    console.log('─'.repeat(70))

    for (const r of results) {
      if (r.scores) {
        const perf = String(r.scores.performance).padStart(4)
        const a11y = String(r.scores.accessibility).padStart(4)
        const bp = String(r.scores.bestPractices).padStart(4)
        const seo = String(r.scores.seo).padStart(4)
        console.log(`  ${r.page.padEnd(35)} ${perf}  ${a11y}  ${bp}  ${seo}`)
      } else {
        console.log(`  ${r.page.padEnd(35)} ❌ ${r.error?.slice(0, 30)}`)
      }
    }
    console.log('═'.repeat(70))

    // Save summary
    const summaryPath = join(OUTPUT_DIR, `summary_${timestamp}.json`)
    writeFileSync(summaryPath, JSON.stringify({ timestamp, baseUrl: BASE_URL, results }, null, 2))
    console.log(`\n📄 Summary saved: ${summaryPath}`)
    console.log(`📁 Reports: ${OUTPUT_DIR}/`)

    // Exit with error if any page failed
    const failures = results.filter(r => r.error)
    if (failures.length > 0) {
      console.log(`\n⚠️  ${failures.length}/${results.length} pages had errors`)
      process.exit(1)
    }

  } finally {
    await browser.close()
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
