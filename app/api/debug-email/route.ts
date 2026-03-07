import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  // Admin-only diagnostic endpoint
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())
  if (!adminEmails.includes(session.user.email.toLowerCase())) {
    return NextResponse.json({ error: 'Not admin' }, { status: 403 })
  }

  const hasKey = !!process.env.RESEND_API_KEY
  const keyPrefix = process.env.RESEND_API_KEY?.slice(0, 6) || 'NOT SET'
  const fromEmail = process.env.FROM_EMAIL || 'NOT SET (will use default: ThreadMoat <noreply@threadmoat.com>)'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'NOT SET'

  // Try sending a real test email if key exists
  let sendResult: unknown = null
  if (hasKey) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      const from = process.env.FROM_EMAIL || 'ThreadMoat <noreply@threadmoat.com>'
      const { data, error } = await resend.emails.send({
        from,
        to: session.user.email,
        subject: 'ThreadMoat Email Test',
        html: '<p>If you see this, Resend is working correctly.</p>',
      })
      sendResult = error ? { error } : { success: true, id: data?.id }
    } catch (err) {
      sendResult = { error: err instanceof Error ? err.message : String(err) }
    }
  }

  return NextResponse.json({
    resend_api_key_set: hasKey,
    resend_api_key_prefix: keyPrefix,
    from_email: fromEmail,
    base_url: baseUrl,
    test_send: sendResult,
  })
}
