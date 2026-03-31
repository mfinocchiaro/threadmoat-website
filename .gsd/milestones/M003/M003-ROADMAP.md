# M003: 

## Vision
Fix the tier mapping bug that gives forge_annual users free-tier access, add upgrade CTAs for trial expiry and tier upgrades, complete confidence metadata across all charts, and execute all outstanding UAT checklists.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Fix Tier Mapping & Clean Dead Coupons | medium | — | ✅ | forge_annual users see Strategist-level access. Red Keep coupons removed. getAccessTier handles all product_ids correctly. |
| S02 | Upgrade CTAs for Expired Explorer & Analyst→Strategist | low | S01 | ✅ | Expired explorer sees a clear upgrade CTA. Analyst user on a Strategist-only page sees Strategist upgrade nudge. |
| S03 | Complete Confidence Metadata in All Charts | low | — | ✅ | All charts displaying estimatedMarketValue show valuationConfidence in their tooltips. |
| S04 | Execute All UAT Checklists | low | S01, S02, S03 | ✅ | All M001 and M002 UAT checklists executed with pass/fail results documented. |
