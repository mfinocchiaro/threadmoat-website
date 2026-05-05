import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken, storeRefreshToken, initializeGSCTable } from '@/lib/gsc-auth'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.redirect('/auth/login')
    }

    const userId = session.user.id

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.json({ error: `Google OAuth error: ${error}` }, { status: 400 })
    }

    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 })
    }

    const cookies = request.cookies.get('gsc_oauth_state')?.value
    if (!cookies || cookies !== state) {
      return NextResponse.json({ error: 'Invalid state token (CSRF validation failed)' }, { status: 403 })
    }

    await initializeGSCTable()

    const tokens = await exchangeCodeForToken(code)
    if (!tokens.refresh_token) {
      return NextResponse.json({ error: 'No refresh token received' }, { status: 400 })
    }

    const propertyUrl = 'https://search.google.com' // default; would be set by user later
    const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : new Date(Date.now() + 3600 * 1000)

    await storeRefreshToken(userId, propertyUrl, tokens.refresh_token, expiresAt)

    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    response.cookies.delete('gsc_oauth_state')

    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'OAuth callback failed' },
      { status: 500 }
    )
  }
}
