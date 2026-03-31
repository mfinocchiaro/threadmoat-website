# S01: Fix Tier Mapping & Clean Dead Coupons

**Goal:** Fix the tier mapping bug where forge_annual and red_keep_annual fall through to explorer. Map forge_annual to strategist. Clean up Red Keep coupons from DB.
**Demo:** After this: forge_annual users see Strategist-level access. Red Keep coupons removed. getAccessTier handles all product_ids correctly.

## Tasks
- [x] **T01: Fixed forge_annual tier mapping to strategist and deleted 10 Red Keep coupons from DB.** — Add forge_annual to the strategist case in getAccessTier(). Remove red_keep_annual coupons from DB. Remove red_keep_annual from any code references. Update the tier comment header to document all product_ids.
  - Estimate: 15min
  - Files: lib/tiers.ts
  - Verify: npm run build passes. getAccessTier('forge_annual', false) === 'strategist'. DB has 0 red_keep_annual coupons.
