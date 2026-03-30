---
id: S01
parent: M002
milestone: M002
provides:
  - Hardened auth flow with coupon retry and login-time fallback
requires:
  []
affects:
  []
key_files:
  - app/actions/auth.ts
  - app/dashboard/layout.tsx
key_decisions:
  - Login-time coupon fallback ensures unredeemed invite codes are eventually redeemed
  - verifyEmail retries coupon redemption once before falling back to Explorer trial
  - On double failure, invite_code is re-stored for login-time retry
patterns_established:
  - Login-time fallback for deferred operations that may fail during email verification
observability_surfaces:
  - Console log on coupon redemption success/failure in verifyEmail with attempt number
  - Console log on login-time coupon fallback in dashboard layout
drill_down_paths:
  - .gsd/milestones/M002/slices/S01/tasks/T01-SUMMARY.md
  - .gsd/milestones/M002/slices/S01/tasks/T02-SUMMARY.md
  - .gsd/milestones/M002/slices/S01/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-29T22:18:02.490Z
blocker_discovered: false
---

# S01: Fix Sign-Up & Onboarding Flow

**Fixed James's missing coupon redemption and hardened the verification + login flows with retry and fallback mechanisms.**

## What Happened

Investigated James's onboarding issue. Found his account (james@barbosaconsulting.net) existed and was verified but had no subscription — the JAMES-FRIEND coupon's used_count was still 0. The verifyEmail function's coupon redemption had silently failed. Manually redeemed the coupon (friends_access, analyst tier, 1 year). Hardened the code: verifyEmail now retries once and falls back to Explorer trial on failure. Dashboard layout now checks for unredeemed invite_code on every login as a belt-and-suspenders fallback. Also noted James is in ADMIN_EMAILS, so his dashboard access was never actually blocked.

## Verification

Sign-up form tested in browser. npm run build passes. James's production DB state verified. Code hardened with retry + fallback.

## Requirements Advanced

- ONBOARD-01 — Hardened coupon redemption with retry + login-time fallback, verified sign-up flow locally

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Root cause was coupon redemption failure during verifyEmail, not a sign-up form crash. James was also in ADMIN_EMAILS so his access wasn't actually blocked by the missing subscription.

## Known Limitations

Exact error James saw unknown — cannot access iMessage attachment or Vercel function logs from CLI.

## Follow-ups

Cannot access iMessage screenshots from terminal — need user to share James's error screenshot directly. Vercel logs would confirm exact error.

## Files Created/Modified

- `app/actions/auth.ts` — Added retry logic for coupon redemption in verifyEmail, re-stores invite_code on failure for login-time retry
- `app/dashboard/layout.tsx` — Added login-time coupon fallback: auto-redeems unredeemed invite_code for users without subscription
