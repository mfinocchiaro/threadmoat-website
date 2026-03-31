---
id: M003
title: "v1.3 Tier Fixes, Upgrade CTAs & UAT Completion"
status: complete
completed_at: 2026-03-31T08:11:51.849Z
key_decisions:
  - forge_annual → strategist (user decision)
  - Red Keep naming retired, 10 coupons deleted
  - min_records guard on Airtable sync (100 for startups, 50 for investors)
  - CompanyHoverCard is the shared source for confidence metadata across charts
key_files:
  - lib/tiers.ts
  - components/dashboard/free-user-guard.tsx
  - components/ui/company-hover-card.tsx
  - components/charts/parallel-coords-chart.tsx
  - components/charts/slope-chart.tsx
  - scripts/fetch_airtable_csv.py
lessons_learned:
  - External data syncs need minimum record count guards to prevent partial API responses from overwriting good data
  - Product ID → tier mapping must cover every product_id used in coupons, not just Stripe products
  - CompanyHoverCard as shared component is the most efficient place to add metadata that should appear across multiple charts
---

# M003: v1.3 Tier Fixes, Upgrade CTAs & UAT Completion

**Fixed tier mapping bug, added $4,999 upgrade CTAs, completed confidence metadata, and added Airtable sync safety guard.**

## What Happened

M003 fixed a real access bug, improved conversion paths, completed data surfacing, and hardened the data pipeline.\n\nS01 fixed a critical bug: forge_annual product_id fell through to explorer (free) tier in getAccessTier(). Two real users were affected. Also retired the Red Keep naming convention and deleted 10 unused coupons.\n\nS02 enhanced the PaywallBlock with tier-specific upgrade CTAs. Analyst users on strategist-gated pages now see their $4,999 upgrade credit prominently.\n\nS03 completed confidence metadata coverage by adding valuationConfidence to parallel-coords, slope chart, and CompanyHoverCard (shared across periodic table, landscape, and other charts). Total: 8 components now surface pipeline data.\n\nS04 executed UAT checklists and discovered the Airtable sync was pushing a 3-row stub CSV hourly, overwriting the full dataset. Added a min_records safety guard to the sync script to prevent this.

## Success Criteria Results

- [x] forge_annual maps to strategist\n- [x] Red Keep coupons removed\n- [x] Upgrade CTAs with $4,999 credit\n- [x] Confidence metadata in 8 components\n- [x] UAT executed\n- [x] Sync guard deployed\n- [x] Build passes

## Definition of Done Results

- [x] forge_annual and red_keep_annual map to correct access tiers\n- [x] Red Keep coupons cleaned from DB\n- [x] Expired Explorer users see upgrade CTA (already existed)\n- [x] Analyst users on Strategist-gated pages see $4,999 credit CTA\n- [x] All charts using estimatedMarketValue show confidence metadata (8 components)\n- [x] M001 and M002 UAT checklists executed\n- [x] npm run build passes

## Requirement Outcomes

TIER-01: validated — forge_annual → strategist, red_keep removed\nUX-06: validated — $4,999 credit in analyst paywall\nDATA-04: validated — 8 components show valuationConfidence\nQA-02: validated — UAT items verified\nAIRTABLE-01: surfaced — sync guard in place, root cause deferred to Airtable investigation

## Deviations

None.

## Follow-ups

None.
