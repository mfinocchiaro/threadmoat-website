import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/gsc-auth'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const state = crypto.randomBytes(32).toString('hex')
    const authUrl = getGoogleAuthUrl(state)

    const response = NextResponse.redirect(authUrl)
    response.cookies.set('gsc_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 900,
    })

    return response
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.json({ error: 'OAuth initialization failed' }, { status: 500 })
  }
}
