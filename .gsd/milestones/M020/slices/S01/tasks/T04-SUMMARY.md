---
id: T04
parent: S01
milestone: M020
key_files:
  - app/api/newsletter/subscribe/route.ts
  - components/homepage/newsletter-signup.tsx
  - app/[locale]/page.tsx
  - app/[locale]/insights/page.tsx
key_decisions:
  - Store subscribers in Neon DB rather than Resend audience — simpler and keeps data in existing infra
  - Auto-create table on first use to avoid migration step
  - Rate limit by IP (5/hour) to prevent abuse
duration: 
verification_result: passed
completed_at: 2026-04-19T15:11:11.881Z
blocker_discovered: false
---

# T04: Built newsletter capture component with API endpoint, Neon DB storage, and Zod validation

**Built newsletter capture component with API endpoint, Neon DB storage, and Zod validation**

## What Happened

Created /api/newsletter/subscribe POST endpoint with Zod email validation, IP-based rate limiting (5/hour), and auto-creating newsletter_subscribers table in Neon DB. Upserts on duplicate email. Built NewsletterSignup client component with email input, loading spinner, success state with checkmark, and error toasts via useToast. Placed on homepage (above footer in a muted section) and blog index page.

## Verification

TypeScript compilation passes with zero errors.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit --pretty` | 0 | pass | 8000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `app/api/newsletter/subscribe/route.ts`
- `components/homepage/newsletter-signup.tsx`
- `app/[locale]/page.tsx`
- `app/[locale]/insights/page.tsx`
