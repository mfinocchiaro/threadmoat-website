---
id: T01
parent: S01
milestone: M002
provides: []
requires: []
affects: []
key_files: ["app/actions/auth.ts", "app/dashboard/layout.tsx"]
key_decisions: ["Login-time coupon fallback added to dashboard layout for users with unredeemed invite_code", "verifyEmail coupon redemption now retries once before falling back to Explorer trial", "If coupon redemption fails twice, invite_code is re-stored for login-time fallback to retry"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passes. James's subscription verified in production DB (friends_access, active, expires 2027-03-29)."
completed_at: 2026-03-29T22:16:25.284Z
blocker_discovered: false
---

# T01: Fixed James's missing subscription (coupon never redeemed) and added retry + login-time fallback for coupon redemption.

> Fixed James's missing subscription (coupon never redeemed) and added retry + login-time fallback for coupon redemption.

## What Happened
---
id: T01
parent: S01
milestone: M002
key_files:
  - app/actions/auth.ts
  - app/dashboard/layout.tsx
key_decisions:
  - Login-time coupon fallback added to dashboard layout for users with unredeemed invite_code
  - verifyEmail coupon redemption now retries once before falling back to Explorer trial
  - If coupon redemption fails twice, invite_code is re-stored for login-time fallback to retry
duration: ""
verification_result: passed
completed_at: 2026-03-29T22:16:25.284Z
blocker_discovered: false
---

# T01: Fixed James's missing subscription (coupon never redeemed) and added retry + login-time fallback for coupon redemption.

**Fixed James's missing subscription (coupon never redeemed) and added retry + login-time fallback for coupon redemption.**

## What Happened

Diagnosed James's onboarding issue. His account (james@barbosaconsulting.net) was created March 28 with invite code JAMES-FRIEND, email verified successfully, but coupon redemption during verifyEmail silently failed — leaving him with no subscription (used_count remained 0). The verifyEmail code had a non-fatal try/catch that swallowed the error.\n\nFixed James's account by manually creating a friends_access subscription (analyst tier, 1 year) and incrementing the coupon used_count.\n\nHardened the code in two ways: (1) verifyEmail now retries coupon redemption once, falls back to Explorer trial on failure, and re-stores invite_code for login-time retry. (2) Dashboard layout now checks for unredeemed invite_code on login and auto-redeems it — a belt-and-suspenders fallback that catches any future coupon redemption failures at verification time.

## Verification

npm run build passes. James's subscription verified in production DB (friends_access, active, expires 2027-03-29).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 22100ms |
| 2 | `node -e (verify James subscription in prod DB)` | 0 | ✅ pass — friends_access active until 2027-03-29 | 1200ms |


## Deviations

Root cause was not a sign-up form error but a failed coupon redemption during email verification. James's account existed and was verified, but the JAMES-FRIEND coupon was never redeemed — leaving him with no subscription (explorer tier). Fixed his account by manually redeeming the coupon, then hardened the code with retry logic and a login-time fallback. Combined T01+T02 since diagnosis and fix were straightforward.

## Known Issues

None.

## Files Created/Modified

- `app/actions/auth.ts`
- `app/dashboard/layout.tsx`


## Deviations
Root cause was not a sign-up form error but a failed coupon redemption during email verification. James's account existed and was verified, but the JAMES-FRIEND coupon was never redeemed — leaving him with no subscription (explorer tier). Fixed his account by manually redeeming the coupon, then hardened the code with retry logic and a login-time fallback. Combined T01+T02 since diagnosis and fix were straightforward.

## Known Issues
None.
