import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import Papa from 'papaparse'
import { promises as fs } from 'fs'
import path from 'path'
import { rateLimit } from '@/lib/rate-limit'

// Cloud SaaS benchmark: $200K ARR/employee is the industry "good" threshold (Bessemer/BVP standard)
const CLOUD_ARR_BENCHMARK = 200_000

// Base cost per employee for burn rate estimation
const COST_PER_EMPLOYEE = 200_000

// Cloud infrastructure cost factor: SaaS/Cloud companies carry ~20% additional cloud infra costs
// (AWS/GCP/Azure, CI/CD, monitoring, data storage) on top of headcount-based OpEx.
// Traditional/Edge/HW companies carry ~5% (minimal hosting, build servers).
const CLOUD_COST_FACTORS: Record<string, number> = {
  'Cloud-Native': 0.25,   // 25% cloud premium (heavy compute, multi-region, HPC)
  'SaaS':         0.20,   // 20% (standard cloud SaaS infrastructure)
  'Hybrid':       0.15,   // 15% (partial cloud + on-prem)
  'Edge/HW':      0.05,   // 5% (minimal cloud, mostly edge/hardware)
  'Traditional':  0.03,   // 3% (build servers, minimal hosting)
  'No Data':      0.10,   // 10% (conservative default)
}

function normalizeCompanyName(name: string): string {
  return name.trim().replace(/[\u00A0\u2013\u2014]/g, ' ').replace(/\s+/g, ' ').toLowerCase()
}

function parseCurrency(value: string | undefined): number {
  if (!value) return 0
  const cleaned = value.replace(/[$,\s]/g, '')
  const match = cleaned.match(/^([0-9.]+)\s*([BMKbmk])?$/)
  if (!match) return 0
  const num = parseFloat(match[1])
  if (isNaN(num)) return 0
  const suffix = (match[2] || '').toUpperCase()
  if (suffix === 'B') return num * 1_000_000_000
  if (suffix === 'M') return num * 1_000_000
  if (suffix === 'K') return num * 1_000
  return num
}

function parseNum(value: string | undefined): number {
  if (!value) return 0
  const num = parseFloat(value)
  return isNaN(num) ? 0 : num
}

/**
 * Classify cloud delivery model from Operating Model Tags.
 * Priority: Cloud-Native > SaaS > Hybrid > Edge/HW > Traditional > Minimal
 * Every company with tags gets a real classification — no "Unknown".
 */
function classifyCloudModel(tags: string): string {
  if (!tags.trim()) return 'No Data'
  const set = new Set(tags.split(',').map(t => t.trim().toLowerCase()))
  // Cloud-Native: consumption/usage billing or cloud HPC workloads
  if (set.has('cloud-native') || set.has('usage-based') || set.has('consumption-based') || set.has('cloud hpc')) return 'Cloud-Native'
  // Hybrid: explicit hybrid tag, or has both cloud + on-prem/edge signals
  if (set.has('hybrid')) return 'Hybrid'
  const hasCloud = set.has('cloud') || set.has('saas') || set.has('paas') || set.has('b2b saas') || set.has('enterprise saas') || set.has('vertical saas')
  const hasOnPrem = set.has('on-premises') || set.has('on-premise') || set.has('on premise') || set.has('hw+sw') || set.has('edge')
  if (hasCloud && hasOnPrem) return 'Hybrid'
  // SaaS: subscription cloud delivery
  if (hasCloud) return 'SaaS'
  // Edge/HW: hardware-centric or edge-deployed without cloud
  if (set.has('edge') || set.has('hw+sw')) return 'Edge/HW'
  // Traditional: on-prem, perpetual license
  if (set.has('on-premises') || set.has('on-premise') || set.has('on premise') || set.has('perpetual license') || set.has('perpetual') || set.has('plugin/add-on')) return 'Traditional'
  // Fallback: has tags but nothing matched delivery model — classify by pricing
  if (set.has('subscription')) return 'SaaS'
  if (set.has('per-unit') || set.has('per-project')) return 'Traditional'
  return 'No Data'
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rl = await rateLimit(`api:funding:${session.user.id}`, 30, 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    // Load both CSVs in parallel
    const [financialContent, gridContent] = await Promise.all([
      fs.readFile(path.join(process.cwd(), 'data', 'Startups-Financial Health.csv'), 'utf-8'),
      fs.readFile(path.join(process.cwd(), 'data', 'Startups-Grid view.csv'), 'utf-8'),
    ])

    const stripBOM = (s: string) => s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s

    const financialRows = (Papa.parse(stripBOM(financialContent), { header: true, skipEmptyLines: true }).data as Record<string, string>[])
    const gridRows = (Papa.parse(stripBOM(gridContent), { header: true, skipEmptyLines: true }).data as Record<string, string>[])

    // Build a lookup: company name → operating model tags
    const tagsByCompany = new Map<string, string>()
    for (const row of gridRows) {
      const name = (row['Company'] || '').trim()
      if (name) tagsByCompany.set(normalizeCompanyName(name), row['Operating Model Tags'] || '')
    }

    const funding = financialRows
      .filter(row => (row['Company'] || '').trim())
      .map((row, index) => {
        const company = (row['Company'] || '').trim()
        const tags = tagsByCompany.get(normalizeCompanyName(company)) ?? ''
        const cloudModel = classifyCloudModel(tags)

        const headcount = parseInt(row['Estimated Headcount']) || 0
        const totalFunding = parseCurrency(row['Total Current Known Funding Level'])
        const estimatedRevenue = parseCurrency(row['Current Estimated Annual Revenue'])

        // ARR per employee: revenue / headcount
        const arrPerEmployee = headcount > 0 ? estimatedRevenue / headcount : 0

        // Cloud ARR efficiency: how many cents of ARR earned per dollar raised.
        // 100 = broke even on capital (ARR = total funding). Higher = more capital-efficient.
        const cloudArrEfficiency = totalFunding > 0 ? (estimatedRevenue / totalFunding) * 100 : 0

        // ARR/employee as % of $200K SaaS benchmark. 100 = at benchmark, 150 = 50% above, etc.
        const cloudArrVsBenchmark = arrPerEmployee > 0 ? (arrPerEmployee / CLOUD_ARR_BENCHMARK) * 100 : 0

        // ── Burn Rate Calculation ──
        // Base: Headcount × $200K/person/year (fully loaded cost: salary + benefits + office + tools)
        const baseBurn = headcount * COST_PER_EMPLOYEE
        // Cloud factor: additional % for cloud infrastructure (AWS/GCP/Azure, CI/CD, monitoring)
        const cloudFactor = CLOUD_COST_FACTORS[cloudModel] ?? 0.10
        const cloudCost = baseBurn * cloudFactor
        // Total annual burn = base OpEx + cloud infrastructure
        const annualBurnProxy = baseBurn + cloudCost

        // ── Runway Calculation ──
        // Net monthly burn = (annual burn - annual revenue) / 12
        // If revenue >= burn, company is cash-flow positive → runway is effectively infinite
        const netAnnualBurn = Math.max(0, annualBurnProxy - estimatedRevenue)
        const monthlyNetBurn = netAnnualBurn / 12
        // Runway = remaining funding / net monthly burn
        const runwayProxyMonths = monthlyNetBurn > 0 ? totalFunding / monthlyNetBurn : (totalFunding > 0 ? 999 : 0)

        // ── Runway Quality Classification ──
        let runwayQuality: string
        if (monthlyNetBurn <= 0 && estimatedRevenue > 0) runwayQuality = 'Cash-flow Positive'
        else if (runwayProxyMonths >= 36) runwayQuality = 'Very Strong'
        else if (runwayProxyMonths >= 24) runwayQuality = 'Healthy'
        else if (runwayProxyMonths >= 18) runwayQuality = 'Comfortable'
        else if (runwayProxyMonths >= 12) runwayQuality = 'Tight'
        else if (runwayProxyMonths >= 6) runwayQuality = 'High Risk'
        else if (runwayProxyMonths > 0) runwayQuality = 'Critical'
        else runwayQuality = 'No Data'

        // ── Net Burn Level Classification ──
        let netBurnLevel: string
        if (monthlyNetBurn <= 0 && estimatedRevenue > 0) netBurnLevel = 'Profitable'
        else if (annualBurnProxy === 0) netBurnLevel = 'No Data'
        else {
          const burnRatio = netAnnualBurn / totalFunding  // annual net burn as % of total funding
          if (burnRatio <= 0.05) netBurnLevel = 'Very Low'
          else if (burnRatio <= 0.15) netBurnLevel = 'Low'
          else if (burnRatio <= 0.25) netBurnLevel = 'Moderate'
          else if (burnRatio <= 0.40) netBurnLevel = 'Comfortable'
          else if (burnRatio <= 0.60) netBurnLevel = 'High'
          else if (burnRatio <= 0.80) netBurnLevel = 'Very High'
          else netBurnLevel = 'Critical'
        }

        return {
          id: String(index + 1),
          company,
          cloudModel,
          cloudFactor: Math.round(cloudFactor * 100),
          cloudArrEfficiency: Math.round(cloudArrEfficiency * 10) / 10,
          cloudArrVsBenchmark: Math.round(cloudArrVsBenchmark * 10) / 10,
          scoreFinancial: parseNum(row['Score Financial']),
          customerSignalScore: parseNum(row['Customer Signal Score']),
          estRevenueLabel: row['Est. Revenue by ARR or HC'] || '',
          weightedStartupQualityScore: parseNum(row['Weighted Startup Quality Score']),
          arrMultiple: parseNum(row['ARR Multiple']),
          estimatedValuation: parseCurrency(row['Estimated Valuation']),
          fundingFloor: parseCurrency(row['Funding Floor']),
          estimatedValueFinal: parseCurrency(row['Estimated Value Final']),
          arrPerEmployee,
          annualBurnProxy,
          runwayProxyMonths: Math.min(runwayProxyMonths, 999),
          startupSizeCategory: row['Startup Size Category'] || '',
          capitalEfficiency: (row['Capital Efficiency'] || '').replace(/^Unknown$/i, 'No Data'),
          runwayQuality,
          netBurnLevel,
          financialConfidence: row['Financial Confidence'] || '',
        }
      })

    return NextResponse.json({ success: true, count: funding.length, data: funding })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load funding data' },
      { status: 500 }
    )
  }
}
