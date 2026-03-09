import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import Papa from 'papaparse'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const csvPath = path.join(process.cwd(), 'public', 'data', 'Investors-Grid view.csv')
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
        startupNames: parseNestedCsv(row['Startups'] || ''),
        startupCount: parseInt(row['Startup Count']) || 0,
        investmentLists: parseNestedCsv(row['Investment Lists'] || ''),
        linkedInProfile: (row['LinkedIn Profile'] || '').trim(),
        email: (row['Email'] || '').trim(),
        notes: (row['Notes'] || '').trim(),
        contacts: (row['Contacts'] || '').trim(),
        investorType: (row['Investor Type'] || '').trim(),
      }))

    return NextResponse.json({ success: true, count: investors.length, data: investors })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load investor data' },
      { status: 500 }
    )
  }
}
