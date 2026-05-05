import { sql } from './db'
import { OAuth2Client } from 'google-auth-library'
import crypto from 'crypto'

// Create OAuth client without initial redirectUri — will be set per request
const createGoogleAuth = (redirectUri: string) => new OAuth2Client({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri,
})

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!
const ENCRYPTION_IV = process.env.ENCRYPTION_IV!

export async function initializeGSCTable() {
  try {
    // Drop and recreate to fix BYTEA → TEXT column type
    await sql`DROP TABLE IF EXISTS gsc_credentials`

    await sql`
      CREATE TABLE IF NOT EXISTS gsc_credentials (
        user_id UUID NOT NULL,
        property_url VARCHAR(255) NOT NULL,
        oauth_token_encrypted TEXT NOT NULL,
        token_expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        PRIMARY KEY (user_id, property_url)
      )
    `
    console.log('✓ GSC table initialized with correct schema')
  } catch (error) {
    console.error('Error creating gsc_credentials table:', error)
    throw error
  }
}

function encryptToken(token: string): string {
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(ENCRYPTION_IV, 'hex'))
  let encrypted = cipher.update(token, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag()
  return `${encrypted}:${authTag.toString('hex')}`
}

function decryptToken(encrypted: string): string {
  const [encryptedData, authTag] = encrypted.split(':')
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(ENCRYPTION_IV, 'hex'))
  decipher.setAuthTag(Buffer.from(authTag, 'hex'))
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

export async function storeRefreshToken(userId: string, propertyUrl: string, refreshToken: string, expiresAt: Date) {
  const encryptedToken = encryptToken(refreshToken)

  try {
    await sql`
      INSERT INTO gsc_credentials (user_id, property_url, oauth_token_encrypted, token_expires_at)
      VALUES (${userId}, ${propertyUrl}, ${encryptedToken}, ${expiresAt})
      ON CONFLICT (user_id, property_url)
      DO UPDATE SET
        oauth_token_encrypted = ${encryptedToken},
        token_expires_at = ${expiresAt},
        updated_at = now()
    `
  } catch (error) {
    console.error('Error storing refresh token:', error)
    throw error
  }
}

export async function getRefreshToken(userId: string, propertyUrl: string): Promise<string | null> {
  try {
    const result = await sql`
      SELECT oauth_token_encrypted FROM gsc_credentials
      WHERE user_id = ${userId} AND property_url = ${propertyUrl}
    `

    if (result.length === 0) {
      console.log('No GSC credentials found for userId:', userId, 'propertyUrl:', propertyUrl)
      return null
    }

    const encryptedToken = result[0].oauth_token_encrypted
    if (!encryptedToken) {
      console.warn('Stored token is null/undefined for userId:', userId)
      return null
    }

    console.log('Decrypting token for userId:', userId)
    return decryptToken(encryptedToken as string)
  } catch (error) {
    console.error('Error retrieving refresh token:', error)
    throw error
  }
}

export async function refreshGSCToken(userId: string, propertyUrl: string): Promise<string> {
  try {
    const refreshToken = await getRefreshToken(userId, propertyUrl)
    if (!refreshToken) throw new Error('No refresh token found')

    const googleAuth = createGoogleAuth('https://threadmoat.com/api/gsc-oauth/callback')
    googleAuth.setCredentials({ refresh_token: refreshToken })
    const { credentials } = await googleAuth.refreshAccessToken()

    if (!credentials.access_token) throw new Error('Failed to get access token')

    const newRefreshToken = credentials.refresh_token || refreshToken
    const expiresAt = credentials.expiry_date ? new Date(credentials.expiry_date) : new Date(Date.now() + 3600 * 1000)

    await storeRefreshToken(userId, propertyUrl, newRefreshToken, expiresAt)

    return credentials.access_token
  } catch (error) {
    console.error('Error refreshing GSC token:', error)
    throw error
  }
}

export function getGoogleAuthUrl(state: string, baseUrl: string = process.env.GOOGLE_OAUTH_REDIRECT_URI!): string {
  // Extract the base URL and construct the redirect URI
  const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/gsc-oauth/callback`
  const googleAuth = createGoogleAuth(redirectUri)

  return googleAuth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
    state,
    prompt: 'consent',
  })
}

export async function exchangeCodeForToken(code: string, baseUrl: string = process.env.GOOGLE_OAUTH_REDIRECT_URI!): Promise<any> {
  const redirectUri = `${baseUrl.replace(/\/$/, '')}/api/gsc-oauth/callback`
  const googleAuth = createGoogleAuth(redirectUri)
  const { tokens } = await googleAuth.getToken(code)
  return tokens
}
