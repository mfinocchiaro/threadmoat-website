import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { refreshGSCToken, getRefreshToken } from '@/lib/gsc-auth'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const propertyUrl = 'https://search.google.com'

    // Get and refresh token
    const refreshToken = await getRefreshToken(userId, propertyUrl)
    if (!refreshToken) {
      return NextResponse.json({ error: 'No GSC credentials found. Connect Google Search Console first.' }, { status: 400 })
    }

    const accessToken = await refreshGSCToken(userId, propertyUrl)

    // Fetch last 7 days of GSC data
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)

    const endDateStr = endDate.toISOString().split('T')[0]
    const startDateStr = startDate.toISOString().split('T')[0]

    const authClient = new google.auth.OAuth2()
    authClient.setCredentials({ access_token: accessToken })

    const searchconsole = google.searchconsole('v1')
    const report = await searchconsole.searchanalytics.query({
      siteUrl: propertyUrl,
      requestBody: {
        startDate: startDateStr,
        endDate: endDateStr,
        dimensions: ['date'],
        dataState: 'final',
        rowLimit: 30,
      },
      auth: authClient,
    })

    // Analyze timezone
    const ptFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

    const ptDateNow = ptFormatter.format(new Date())
    const [ptMonth, ptDay, ptYear] = ptDateNow.split('/')
    const ptDateStr = `${ptYear}-${ptMonth}-${ptDay}`

    const rows = report.data.rows || []
    const gscDates = rows.map((row: any) => row.keys[0])
    const gscHasToday = gscDates.includes(ptDateStr)
    const mostRecentGscDate = gscDates[gscDates.length - 1] || 'N/A'

    return NextResponse.json({
      testDate: new Date().toISOString(),
      ptDateNow,
      ptDateStr,
      gscDataFetched: {
        startDate: startDateStr,
        endDate: endDateStr,
        rowCount: rows.length,
      },
      gscDates: gscDates,
      gscHasTodaysPTData: gscHasToday,
      mostRecentGscDate,
      conclusion: gscHasToday
        ? '✅ GSC uses Pacific Time (PT dates match expected PT date)'
        : '❌ GSC may use UTC or different timezone (PT date not found in results)',
      rows: rows.slice(0, 5), // First 5 rows for inspection
    })
  } catch (error) {
    console.error('Timezone test error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Timezone test failed' },
      { status: 500 }
    )
  }
}
