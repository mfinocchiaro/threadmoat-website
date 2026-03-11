import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { loadCompaniesFromCSV } from '@/lib/load-companies-server'
import { rateLimit } from '@/lib/rate-limit'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rl = await rateLimit(`api:companies:${session.user.id}`, 30, 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const companies = await loadCompaniesFromCSV()
    return NextResponse.json({ success: true, count: companies.length, data: companies })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to load company data' },
      { status: 500 }
    )
  }
}
