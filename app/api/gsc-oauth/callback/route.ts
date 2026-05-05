import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken, storeRefreshToken, initializeGSCTable } from '@/lib/gsc-auth'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    // For development: allow testing without a ThreadMoat session
    // In production, this should require an authenticated user
    let userId = 'dev-test-user'

    const session = await auth()
    if (session?.user?.id) {
      userId = session.user.id
    }

    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    console.log('🔐 OAuth callback — received state from Google:', state)

    if (error) {
      return NextResponse.json({ error: `Google OAuth error: ${error}` }, { status: 400 })
    }

    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 })
    }

    const storedState = request.cookies.get('gsc_oauth_state')?.value
    console.log('🔐 OAuth callback — stored state from cookie:', storedState)
    console.log('🔐 OAuth callback — states match?', storedState === state)

    if (!storedState || storedState !== state) {
      return NextResponse.json({ error: 'Invalid state token (CSRF validation failed)' }, { status: 403 })
    }

    console.log('🔐 OAuth callback — initializing GSC table')
    await initializeGSCTable()
    console.log('✓ GSC table initialized')

    console.log('🔐 OAuth callback — exchanging code for tokens')
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`
    const tokens = await exchangeCodeForToken(code, baseUrl)
    console.log('✓ Tokens received, refresh_token exists?', !!tokens.refresh_token)

    if (!tokens.refresh_token) {
      return NextResponse.json({ error: 'No refresh token received' }, { status: 400 })
    }

    const propertyUrl = 'https://threadmoat.com/' // ThreadMoat's primary domain
    const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : new Date(Date.now() + 3600 * 1000)

    console.log('🔐 OAuth callback — storing refresh token for userId:', userId)
    await storeRefreshToken(userId, propertyUrl, tokens.refresh_token, expiresAt)
    console.log('✓ Refresh token stored successfully')

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
