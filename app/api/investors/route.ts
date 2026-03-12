import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import Papa from 'papaparse'
import { promises as fs } from 'fs'
import path from 'path'
import { rateLimit } from '@/lib/rate-limit'
import { INVESTOR_META } from '@/lib/investor-meta'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rl = await rateLimit(`api:investors:${session.user.id}`, 30, 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const csvPath = path.join(process.cwd(), 'data', 'Investors-Grid view.csv')
    let csvContent = await fs.readFile(csvPath, 'utf-8')

    if (csvContent.charCodeAt(0) === 0xFEFF) {
      csvContent = csvContent.slice(1)
    }

    const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
    const rawData = parsed.data as Record<string, string>[]

    const EXCLUDED = ['undisclosed angel investors', 'bootstrapped', 'unknown', 'n/a', 'n a']

    // Investment Lists field contains quoted CSV values like:
    // "Factory Futures (MES, IIOT)",Streamlined Supply Chain (SCM)
    // Use Papa to parse each field as a CSV row, then deduplicate
    function parseNestedCsv(field: string): string[] {
      if (!field) return []
      const result = Papa.parse(field, { header: false })
      const values = (result.data[0] as string[] || []).map(s => s.trim()).filter(Boolean)
      return Array.from(new Set(values))
    }

    const investors = rawData
      .filter(row => {
        const name = (row['Name (Institution or Individual)'] || '').trim()
        return name && !EXCLUDED.includes(name.toLowerCase())
      })
      .map((row, i) => ({
        id: String(i + 1),
        name: (row['Name (Institution or Individual)'] || '').trim(),
        startupNames: parseNestedCsv(row['Company (from Associated Startups)'] || ''),
        startupCount: parseInt(row['Startup Count']) || 0,
        investmentLists: parseNestedCsv(row['Investment Lists'] || ''),
        linkedInProfile: (row['LinkedIn Profile'] || '').trim(),
        email: (row['Email'] || '').trim(),
        notes: (row['Notes'] || '').trim(),
        contacts: (row['Contacts'] || '').trim(),
        investorType: (row['Investor Type'] || '').trim(),
        hq: '',
        description: '',
      }))
      .map(inv => {
        const meta = INVESTOR_META[inv.name]
        if (meta) {
          inv.hq = meta.hq
          inv.description = meta.description
        }
        return inv
      })

    return NextResponse.json({ success: true, count: investors.length, data: investors })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load investor data' },
      { status: 500 }
    )
  }
}
