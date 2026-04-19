import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  // Rate limit by IP — 5 signups per hour per IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rl = await rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  const { email } = parsed.data

  try {
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        subscribed_at TIMESTAMPTZ DEFAULT NOW(),
        source TEXT DEFAULT 'website'
      )
    `

    // Upsert — don't error on duplicate
    await sql`
      INSERT INTO newsletter_subscribers (email, source)
      VALUES (${email}, 'website')
      ON CONFLICT (email) DO NOTHING
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
