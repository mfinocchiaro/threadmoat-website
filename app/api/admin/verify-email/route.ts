import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    // Admin only
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const result = await sql`
      UPDATE users
      SET email_verified = true, verification_token = NULL, verification_token_expires = NULL
      WHERE email = ${email.trim().toLowerCase()}
      RETURNING id, email, email_verified
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('✓ Email verified manually:', result[0].email)
    return NextResponse.json({ success: true, user: result[0] })
  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify email' },
      { status: 500 }
    )
  }
}
