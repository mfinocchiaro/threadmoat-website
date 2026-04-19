import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { sendDemoRequestNotification } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = (body.name as string || '').trim()
    const email = (body.email as string || '').trim().toLowerCase()
    const company = (body.company as string || '').trim()
    const message = (body.message as string || '').trim()

    if (!name || !email || !company) {
      return NextResponse.json({ error: 'Name, email, and company are required' }, { status: 400 })
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Rate limit: 3 demo requests per email per hour
    const rl = await rateLimit(`demo:${email}`, 3, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    await sendDemoRequestNotification(name, email, company, message)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[demo-request]', err)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}
