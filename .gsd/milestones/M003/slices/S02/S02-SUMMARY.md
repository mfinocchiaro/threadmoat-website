---
id: S02
parent: M003
milestone: M003
provides:
  - Tier-appropriate upgrade CTAs in paywall
requires:
  - slice: S01
    provides: Correct tier mapping
affects:
  - S04
key_files:
  - components/dashboard/free-user-guard.tsx
key_decisions:
  - Analyst-specific strategist upgrade CTA mentions $4,999 credit
patterns_established:
  - Tier-specific paywall messaging based on accessTier prop
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M003/slices/S02/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T07:46:56.640Z
blocker_discovered: false
---

# S02: Upgrade CTAs for Expired Explorer & Analyst\u2192Strategist

**Added $4,999 credit mention to analyst\u2192strategist upgrade CTAs.**

## What Happened

Enhanced the PaywallBlock with tier-specific upgrade CTAs. Analyst users on strategist pages now see their $4,999 upgrade credit prominently. Explorer users see the generic strategist pitch. Expired explorer flow already had a clear upgrade CTA — no changes needed.

## Verification

Build passes. PaywallBlock shows $4,999 credit for analyst tier.

## Requirements Advanced

- UX-06 — Analyst users see $4,999 credit in strategist paywall

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

Expired explorer flow already had a good CTA — no changes needed. Focused on analyst→strategist credit mention.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `components/dashboard/free-user-guard.tsx` — Split strategist nudge by tier, added $4,999 credit for analyst users, added credit mention in paywall body
