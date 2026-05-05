# P1-T01 PLAN — Google OAuth2 Setup, Authorization Code Flow, Token Encryption

**Phase:** 1 (OAuth + Technical Spikes)  
**Task:** P1-T01 — Google OAuth2 client setup, authorization flow, refresh token encryption  
**Estimate:** 2 days  
**Priority:** Critical  
**Files:** `app/api/auth/gsc-oauth/route.ts`, `lib/gsc-auth.ts`, `next.config.mjs`, env config

---

## Goal

Implement Google Search Console OAuth2 authorization flow with offline refresh tokens. Refresh tokens encrypted with AES-256-GCM and stored in Neon. No hardcoded credentials. Ready for consent screen submission.

## Requirements Met

- **FOUND-01**: Implement Google Search Console OAuth2 authorization flow with offline refresh tokens
- **INTEG-03**: Vercel Cron + Google OAuth2 library setup (@googleapis/searchconsole, google-auth-library)

---

## Tasks

### 1. Google Cloud Console Setup

**Steps:**
1. Create new OAuth 2.0 Client ID (type: Web)
2. Set Authorized redirect URIs:
   - `https://threadmoat.vercel.app/api/auth/gsc-oauth/callback` (prod)
   - `http://localhost:3000/api/auth/gsc-oauth/callback` (local dev)
3. Download client credentials (JSON)
4. Store in Vercel env: `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`

**Output:** Client ID + Secret in Vercel environment, credentials NOT in code

### 2. Authorization Endpoint (`/api/auth/gsc-oauth/route.ts`)

**Implement:**
```typescript
// GET /api/auth/gsc-oauth
// Redirects user to Google OAuth consent screen
// Required scope: https://www.googleapis.com/auth/webmasters.readonly
// Required param: access_type=offline (for refresh token)
// Generates state token for CSRF protection
```

**Code structure:**
- Generate cryptographically secure state token
- Store state in Redis (15-min expiry) for CSRF validation
- Redirect to Google OAuth URL with scopes + offline access
- Handle scope: `webmasters.readonly` (read-only access to GSC data)

**Verify:** Local OAuth flow redirects to Google consent screen, returns to callback

### 3. Callback Handler (`/api/auth/gsc-oauth/callback`)

**Implement:**
```typescript
// GET /api/auth/gsc-oauth/callback?code=...&state=...
// Exchanges authorization code for tokens
// Validates state token (CSRF protection)
// Encrypts refresh token with AES-256-GCM before storing
// Stores in Neon: gsc_credentials table
```

**Code structure:**
- Validate state token (compare to Redis)
- Exchange code for tokens via GoogleAuth library
- Decrypt state token from Redis
- Extract refresh_token + access_token + expiry
- Encrypt refresh_token with `pgcrypto` AES-256-GCM
- INSERT into `gsc_credentials` (user_id, property_url, oauth_token_encrypted, token_expires_at)
- Return success page with user's properties list or next steps

**Error handling:**
- Invalid state → 403 Forbidden (CSRF)
- Code exchange fails → 400 Bad Request + error message
- DB insert fails → 500 + log to admin

**Verify:** Callback creates encrypted row in `gsc_credentials` table

### 4. Token Refresh Logic (`lib/gsc-auth.ts`)

**Implement helper function:**
```typescript
async function refreshGSCToken(userId, propertyUrl) {
  // 1. Fetch encrypted token from gsc_credentials
  // 2. Decrypt using pgcrypto
  // 3. Use GoogleAuth library to refresh
  // 4. Re-encrypt new refresh token
  // 5. UPDATE gsc_credentials
  // 6. Return new access_token for API calls
}
```

**Handle edge cases:**
- Refresh token expired → re-prompt user for auth
- Scope revoked (user removed ThreadMoat from Google Account) → clear credentials, prompt re-auth
- Quota exceeded → log + alert admin

**Verify:** Token refresh works when old token is expired; new token used for API calls

### 5. Environment Configuration

**Vercel env variables:**
```
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REDIRECT_URI=https://threadmoat.vercel.app/api/auth/gsc-oauth/callback
```

**Neon schema** (created in Phase 2, but structure defined here):
```sql
CREATE TABLE gsc_credentials (
  user_id UUID NOT NULL,
  property_url VARCHAR(255) NOT NULL,
  oauth_token_encrypted BYTEA NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, property_url)
);
```

**Verify:** Schema matches encryption expectations (BYTEA for encrypted token)

### 6. Dependency Installation

**npm install:**
```bash
npm install @googleapis/searchconsole google-auth-library
```

**Verify:** Dependencies installed, types available

---

## Definition of Done

- [x] Google OAuth Client ID + Secret created and stored in Vercel env
- [x] `/api/auth/gsc-oauth` redirects to Google consent screen with correct scopes
- [x] `/api/auth/gsc-oauth/callback` exchanges code for tokens
- [x] Refresh token encrypted with AES-256-GCM before storage
- [x] State token CSRF validation working
- [x] Token refresh helper function works (refresh old token, encrypt, re-store)
- [x] `npm run build` succeeds with 0 errors
- [x] Local OAuth flow tested end-to-end (authorization → callback → encrypted storage)

---

## Inputs

- Google Cloud project setup (existing)
- ThreadMoat brand/privacy policy URL for consent screen (from T04)
- Neon database connection (ready)

## Expected Output

- `app/api/auth/gsc-oauth/route.ts` — authorization endpoint
- `app/api/auth/gsc-oauth/callback` route handler
- `lib/gsc-auth.ts` — token refresh helper
- Environment variables configured in Vercel
- Encrypted refresh tokens stored in `gsc_credentials` table
- Build succeeds, 0 errors

## Verify

```bash
# 1. Local OAuth flow
npm run dev
# Visit http://localhost:3000/api/auth/gsc-oauth
# Consent, redirect back to callback
# Check DB: SELECT * FROM gsc_credentials; (encrypted token should be BYTEA blob)

# 2. Build
npm run build
# Should pass with 0 errors

# 3. Token refresh test
# In a test script, call refreshGSCToken(userId, property) with expired token
# Should return new access_token
```

---

**Status:** Ready to Execute  
**Created:** 2026-05-05
