import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/gsc-auth'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const state = crypto.randomBytes(32).toString('hex')
    console.log('🔐 OAuth init — state generated:', state)
    console.log('🔐 OAuth init — setting cookie with path: /')

    // Get the correct base URL for redirect (localhost in dev, threadmoat.com in prod)
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`
    console.log('🔐 OAuth init — using baseUrl:', baseUrl)

    const authUrl = getGoogleAuthUrl(state, baseUrl)

    const response = NextResponse.redirect(authUrl)
    response.cookies.set('gsc_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 900,
      path: '/',
    })

    console.log('🔐 OAuth init — redirecting to Google:', authUrl)
    return response
  } catch (error) {
    console.error('OAuth error:', error)
    return NextResponse.json({ error: 'OAuth initialization failed' }, { status: 500 })
  }
}
