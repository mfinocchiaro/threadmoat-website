---
id: S01
parent: M003
milestone: M003
provides:
  - Correct tier mapping for all product_ids
requires:
  []
affects:
  - S02
key_files:
  - lib/tiers.ts
key_decisions:
  - forge_annual → strategist (full platform access)
  - Red Keep naming convention retired, all 10 coupons deleted
patterns_established:
  - (none)
observability_surfaces:
  - none
drill_down_paths:
  - .gsd/milestones/M003/slices/S01/tasks/T01-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T07:44:34.424Z
blocker_discovered: false
---

# S01: Fix Tier Mapping & Clean Dead Coupons

**Fixed forge_annual \u2192 strategist tier mapping and retired Red Keep coupons.**

## What Happened

Fixed the tier mapping bug where forge_annual and red_keep_annual product_ids fell through to explorer (free tier) in getAccessTier(). forge_annual now maps to strategist. 10 Red Keep coupons deleted from production DB (0 active subscriptions). Two real users immediately gain correct strategist access on next login.

## Verification

Build passes. forge_annual in strategist case. 0 red_keep coupons in DB.

## Requirements Advanced

- TIER-01 — forge_annual added to strategist case, red_keep coupons deleted

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

None.

## Files Created/Modified

- `lib/tiers.ts` — Added forge_annual to strategist case, updated product ID comment
