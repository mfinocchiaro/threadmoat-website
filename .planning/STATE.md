---
status: milestone_complete
last_activity: 2026-03-24
current_phase: null
current_plan: null
milestone: v1.0
---

# ThreadMoat Website — Project State

## Status

v1.0 milestone complete. Ready for next milestone planning.

## Current Position

All v1.0 phases complete. No active work.

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-24)

**Core value:** Converting visitors into paying dashboard subscribers
**Current focus:** Planning v1.1 milestone

## Accumulated Context

### Decisions

- Tiers: Recon (free) → Analyst ($4,999) → Strategist (€18,999/yr) → Advisory (custom)
- intlMiddleware runs outside auth() wrapper to prevent redirect issues on Vercel
- React Email + Resend for all transactional emails
- Admin purchase notification for watermarked report delivery workflow

### Blockers

None.

### Notes

- Staging branch available for pre-production testing
- French and Portuguese translations pending native speaker review
- Filter bar UX redesign queued for v1.1 (dialog → sticky toolbar)
- Stripe upgrade coupon ($4,999 credit) needed for report→subscription upgrades
- Funding CSV data audit corrections pending (Buildots, Campfire, BeyondMath, etc.)
