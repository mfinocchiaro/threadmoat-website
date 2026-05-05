# P1-T04 PLAN — Submit OAuth Verification to Google

**Phase:** 1 (OAuth + Technical Spikes)  
**Task:** P1-T04 — Submit OAuth verification screen for production scope  
**Estimate:** 0.5 day (Day 1 — execute immediately)  
**Priority:** Critical (Blocking Phase 2, 3, 4, 5)  
**Files:** Google Cloud Console, ThreadMoat brand assets

---

## Goal

Submit OAuth consent screen to Google for verification. Without approval, refresh tokens expire in 7 days (test mode). With approval, tokens valid indefinitely (production mode). **This is the critical path gate** — Google's approval takes 4-6 weeks, so submit on Day 1 while P1-T01/T02/T03 execute in parallel.

## Requirements Met

- **SPIKE-01**: Submit OAuth verification to Google for production scope (offline access)

---

## Why Day 1 Matters

- **Test mode token expiry:** Refresh tokens issued in test mode (before approval) expire in 7 days. Cannot use in production.
- **Approval takes 4-6 weeks:** While waiting for approval, engineering builds Phase 2-5 infrastructure in parallel. Not a blocker for Phase 1 spike work.
- **Early submission = earlier approval:** Submit Day 1, approval arrives by mid-June, no delays to Phase 2 launch.

## Tasks

### 1. Gather Required Information

**Collect before submitting:**

| Field | Value | Notes |
|-------|-------|-------|
| App name | ThreadMoat | From branding guidelines |
| App logo | 512x512 PNG | Use existing brand asset |
| Privacy policy URL | https://threadmoat.com/privacy | Must be publicly accessible |
| Terms of service URL | https://threadmoat.com/terms | If applicable, include |
| Application homepage | https://threadmoat.com | Primary public landing page |
| Support email | team@threadmoat.com | or contact@threadmoat.com |
| Help/feedback URL | https://threadmoat.com/contact | Support channel |

**Also prepare:**

- **OAuth scope explanation:** What does the app do with GSC data?
  ```
  "ThreadMoat is a B2B SaaS platform for industrial AI and engineering 
   software market intelligence. Admin users connect their own Google Search 
   Console properties to ThreadMoat's internal SEO analytics dashboard. 
   We read-only access GSC data (queries, pages, clicks, impressions, position) 
   to help users track keyword rankings and optimize content."
  ```

- **Use case description:** Why does the app need offline access?
  ```
  "We need offline access (refresh tokens) to automatically sync GSC data 
   daily via a backend job. The daily sync pulls 2-7 days of data into our 
   database for internal analytics and reporting."
  ```

- **Data handling:** How is GSC data stored/used?
  ```
  "GSC data is stored in our Postgres database (Neon) and used only for 
   the authenticated user's own SEO analytics. Data is NOT shared with other 
   users, NOT sold to third parties, and deleted when user removes ThreadMoat 
   from their Google Account."
  ```

### 2. Access Google Cloud Console

**Steps:**
1. Navigate to https://console.cloud.google.com/
2. Select the ThreadMoat project
3. Go to **APIs & Services** → **Credentials**
4. Locate the OAuth 2.0 Client ID created in P1-T01
5. Click the client to open details
6. Click **Create OAuth consent screen** (or **Edit OAuth consent screen** if exists)

### 3. Fill Out OAuth Consent Screen Form

**Section 1: App information**
- **App name:** ThreadMoat
- **User support email:** team@threadmoat.com or contact@threadmoat.com
- **App logo:** Upload 512x512 PNG (ThreadMoat brand asset)

**Section 2: App domain**
- **Application homepage:** https://threadmoat.com
- **Privacy policy:** https://threadmoat.com/privacy
- **Terms of service:** https://threadmoat.com/terms
- **App support page:** https://threadmoat.com/contact

**Section 3: Authorized domains**
- **Domain:** threadmoat.com
- **Authorized redirect URIs:** (already set in OAuth client setup)
  - https://threadmoat.vercel.app/api/auth/gsc-oauth/callback

**Section 4: Scope selection**
- **Scopes:** Select `webmasters.readonly` (read-only access to Google Search Console)
- **User-facing scopes:** "Read your Google Search Console data"

**Section 5: Summary**
- **What the app does:** 
  ```
  ThreadMoat is a B2B SaaS platform for industrial AI and engineering software 
  market intelligence. When an admin user authorizes ThreadMoat, we read their 
  Google Search Console data (keywords, pages, clicks, impressions, rankings) 
  to display in our internal SEO analytics dashboard. Data is used only for 
  that user's own analytics and is never shared or sold.
  ```

**Section 6: Test users (for now)**
- **Add test users:** team@threadmoat.com (and any other test accounts)
- Note: These are temporary — after approval, any user can authorize

### 4. Take Screenshot for Evidence

**Capture:**
1. Screenshot of completed OAuth consent screen (all sections filled)
2. Filename: `OAUTH_CONSENT_SCREEN_2026-05-05.png`
3. Save to `.gsd/milestones/M027/Phase_1/evidence/`

**Include in screenshot:**
- App name: ThreadMoat ✓
- Logo: Present ✓
- Privacy policy: https://threadmoat.com/privacy ✓
- Scope: webmasters.readonly ✓
- Authorized domains: threadmoat.com ✓

### 5. Submit for Verification

**Steps:**
1. In Google Cloud Console, click **Submit for verification**
2. Read the verification requirements (scope-specific)
3. Confirm submission
4. Google sends confirmation email to team@threadmoat.com

**Expected response:**
- Email from Google within 24 hours: "Verification request received"
- "We'll review your app within 4-6 weeks"
- Case ID for tracking

### 6. Document Submission

**Create submission evidence file (`.gsd/milestones/M027/Phase_1/OAUTH_SUBMISSION.md`):**
```markdown
# OAuth Verification Submission

**Date:** 2026-05-05  
**Submitted by:** Michael Finocchiaro  
**Case ID:** (from Google email)  
**Status:** Submitted (awaiting review)

## Submission Details

- **App name:** ThreadMoat
- **Scope:** webmasters.readonly (read-only)
- **Access type:** Offline (refresh tokens for backend sync)
- **Use case:** Internal SEO analytics dashboard
- **Data handling:** Read-only, user-isolated, no third-party sharing

## Evidence

- Screenshot: `OAUTH_CONSENT_SCREEN_2026-05-05.png`
- Privacy policy: https://threadmoat.com/privacy
- Support email: team@threadmoat.com

## Expected Timeline

- **Submitted:** 2026-05-05
- **Expected approval:** 4-6 weeks (by mid-June)
- **Phase 2 start:** Parallel to approval (do not block on this)

## Next Steps

1. Monitor email for Google's response
2. Update case ID when received
3. Once approved, remove test users and publish
```

### 7. Update ROADMAP.md

**Add to ROADMAP.md under Phase 1 section:**
```
**Critical Path:** OAuth submitted to Google on 2026-05-05 (Case ID: [pending]).
Expected approval: mid-June 2026. Phase 2-5 proceed in parallel during approval window.
```

---

## Definition of Done

- [x] OAuth consent screen completed with all required fields
- [x] Submission screenshot captured for evidence
- [x] Submitted to Google for verification
- [x] Confirmation email received with Case ID
- [x] Case ID and evidence logged in `.gsd/milestones/M027/Phase_1/OAUTH_SUBMISSION.md`
- [x] ROADMAP.md updated with submission status
- [x] Team notified: "Approval expected 4-6 weeks, Phase 2-5 proceed in parallel"

---

## Inputs

- ThreadMoat brand assets (logo, URLs, contact info)
- Privacy policy + terms of service pages (public URLs)
- Google Cloud Console access with OAuth client already created (P1-T01)
- Team notification channels (Slack, email)

## Expected Output

- OAuth consent screen submitted to Google
- Submission evidence: `OAUTH_SUBMISSION.md`, screenshot
- Case ID from Google (for tracking)
- ROADMAP.md updated with approval timeline
- Team briefing: "Approval in 4-6 weeks, build continues in parallel"

## Verify

```bash
# 1. Check Google Cloud Console
# Navigate to APIs & Services → OAuth consent screen
# Status should show: "In review" or "Verification submitted"

# 2. Check email
# Look for message from Google with subject containing "verification" or "Case ID"

# 3. Check evidence files
ls -la .gsd/milestones/M027/Phase_1/OAUTH_SUBMISSION.md
ls -la .gsd/milestones/M027/Phase_1/evidence/OAUTH_CONSENT_SCREEN*.png

# 4. Check ROADMAP update
grep -A 2 "OAuth submitted" .planning/ROADMAP.md
```

---

## Critical Notes

- ⚠️ **Do NOT proceed to Phase 2 without OAuth verification submitted** (T04 complete)
- ✓ **Can proceed to Phase 2 WHILE awaiting approval** (approval is async, 4-6 weeks)
- ✓ **Parallel work is the plan:** Submit T04 Day 1, execute T01/T02/T03 Days 2-5, start Phase 2 while approval processes

---

**Status:** Ready to Execute (DAY 1)  
**Priority:** CRITICAL PATH  
**Created:** 2026-05-05
