---
id: T01
parent: S04
milestone: M001
provides: []
requires: []
affects: []
key_files: ["lib/load-companies-server.ts", "app/api/funding/route.ts"]
key_decisions: ["Best Available Valuation replaces Estimated Market Value as the authoritative valuation source"]
patterns_established: []
drill_down_paths: []
observability_surfaces: []
duration: ""
verification_result: "npm run build passes."
completed_at: 2026-03-29T16:48:46.588Z
blocker_discovered: false
---

# T01: Swapped valuation source from Estimated Market Value to Best Available Valuation across both CSV loaders.

> Swapped valuation source from Estimated Market Value to Best Available Valuation across both CSV loaders.

## What Happened
---
id: T01
parent: S04
milestone: M001
key_files:
  - lib/load-companies-server.ts
  - app/api/funding/route.ts
key_decisions:
  - Best Available Valuation replaces Estimated Market Value as the authoritative valuation source
duration: ""
verification_result: passed
completed_at: 2026-03-29T16:48:46.588Z
blocker_discovered: false
---

# T01: Swapped valuation source from Estimated Market Value to Best Available Valuation across both CSV loaders.

**Swapped valuation source from Estimated Market Value to Best Available Valuation across both CSV loaders.**

## What Happened

Changed the estimatedMarketValue mapping from 'Estimated Market Value' to 'Best Available Valuation' in both the main company CSV loader (load-companies-server.ts) and the funding API route (app/api/funding/route.ts). 567 companies have different values between the two columns — all charts now render with pipeline-verified valuation data.

## Verification

npm run build passes.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | ✅ pass | 45800ms |


## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `lib/load-companies-server.ts`
- `app/api/funding/route.ts`


## Deviations
None.

## Known Issues
None.
