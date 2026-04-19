import { NextResponse } from 'next/server'
import { processDripEmails } from '@/lib/drip-emails'

// Vercel Cron or external cron hits this endpoint daily
// Protected by CRON_SECRET to prevent unauthorized triggers
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await processDripEmails()
    return NextResponse.json({
      ok: true,
      sent: result.sent,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[Cron] Drip email processing failed:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
