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

    const rows = (report.data.rows as any[]) || []
    const gscDates = rows
      .map((row: any) => {
        if (Array.isArray(row.keys) && row.keys.length > 0) {
          return String(row.keys[0])
        }
        return null
      })
      .filter((date): date is string => date !== null)

    const gscHasToday = gscDates.includes(ptDateStr)
    const mostRecentGscDate = gscDates.length > 0 ? gscDates[gscDates.length - 1] : 'N/A'

    return NextResponse.json({
      testDate: new Date().toISOString(),
      ptDateNow,
      ptDateStr,
      gscDataFetched: {
        startDate: startDateStr,
        endDate: endDateStr,
        rowCount: rows.length,
      },
      gscDates,
      gscHasTodaysPTData: gscHasToday,
      mostRecentGscDate,
      conclusion: gscHasToday
        ? '✅ GSC uses Pacific Time (PT dates match expected PT date)'
        : '❌ GSC may use UTC or different timezone (PT date not found in results)',
      sampleRows: rows.slice(0, 3).map((row: any) => ({
        date: row.keys?.[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Timezone test error:', errorMessage)
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    )
  }
}
