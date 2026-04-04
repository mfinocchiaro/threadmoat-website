# Requirements

This file is the explicit capability and coverage contract for the project.

## Validated

### DATA-01 — CSV data refresh from corrected dataset (swap file when available)
- Class: core-capability
- Status: validated
- Description: CSV data refresh from corrected dataset (swap file when available)
- Source: inferred
- Primary owning slice: S04
- Validation: S04 swapped estimatedMarketValue to Best Available Valuation column in load-companies-server.ts and funding route.

### DATA-02 — Verified funding amounts and reported valuations integrated from agentic pipeline
- Class: core-capability
- Status: validated
- Description: Verified funding amounts and reported valuations integrated from agentic pipeline
- Source: explicit
- Primary owning slice: S05
- Validation: S05 added 4 pipeline metadata fields (valuationConfidence, financialConfidence, reportedValuation, reportedValuationYear) to Company type and CSV loader.

### I18N-06 — French translation review and corrections (manual review by Michael)
- Class: core-capability
- Status: validated
- Description: French translation review and corrections (manual review by Michael)
- Source: inferred
- Primary owning slice: S03
- Validation: S03 fixed 4 franglais calques across 3 French translation files. Professional B2B language verified.

### MON-01 — Stripe coupon for $4,999 credit when report purchaser upgrades to Strategist subscription
- Class: core-capability
- Status: validated
- Description: Stripe coupon for $4,999 credit when report purchaser upgrades to Strategist subscription
- Source: inferred
- Primary owning slice: S02
- Validation: S02 delivered getUpgradeDiscounts() in stripe.ts with idempotent $4,999 coupon for Analyst-to-Strategist upgrades.

### R019 — Dashboard page view and interaction analytics — lightweight, privacy-respecting event tracking for dashboard usage patterns
- Class: functional
- Status: validated
- Description: Dashboard page view and interaction analytics — lightweight, privacy-respecting event tracking for dashboard usage patterns
- Why it matters: Need to understand which dashboard pages and charts users visit most, where they drop off, and which features drive engagement to inform product decisions
- Source: M012
- Primary owning slice: M012/S01
- Supporting slices: M012/S02
- Validation: analytics_events table live in Neon with 3 indexes; POST /api/analytics/event returns 401 without auth; usePageViewTracker covers 52 dashboard routes; 5 interaction event types instrumented; build passes zero errors

### R020 — Investor analysis pages — co-investment heatmap and side-by-side investor portfolio comparison
- Class: functional
- Status: validated
- Description: Investor analysis pages — co-investment heatmap and side-by-side investor portfolio comparison
- Why it matters: M&A strategists need to understand co-investment patterns and compare investor portfolios to identify deal flow overlaps and competitive dynamics
- Source: M013
- Primary owning slice: M013/S01
- Supporting slices: M013/S02
- Validation: Co-investment heatmap at /dashboard/co-investment and investor comparison at /dashboard/investor-compare both built, sidebar wired, build passes (107 routes, zero errors)

### R021 — Repeatable Lighthouse performance testing pipeline for authenticated dashboard pages
- Class: operational
- Status: validated
- Description: Repeatable Lighthouse performance testing pipeline for authenticated dashboard pages
- Why it matters: Dashboard pages are auth-gated — standard Lighthouse gets 404s. Need a scripted approach to capture performance baselines and detect regressions.
- Source: M014
- Primary owning slice: M014/S01
- Supporting slices: M014/S02
- Validation: scripts/lighthouse-dashboard.mjs captures scores for 10 auth-gated pages; JSON reports saved to .gsd/lighthouse/; DASHBOARD-BASELINE.md documents all results

### UX-01 — Compact sticky filter toolbar visible at top of dashboard content area
- Class: core-capability
- Status: validated
- Description: Compact sticky filter toolbar visible at top of dashboard content area
- Source: inferred
- Primary owning slice: S01
- Validation: S01 delivered FilterToolbar in sidebar-shell.tsx as compact sticky element. Build passes.

### UX-02 — Filter toolbar shows active filters as pills/chips with remove buttons
- Class: core-capability
- Status: validated
- Description: Filter toolbar shows active filters as pills/chips with remove buttons
- Source: inferred
- Primary owning slice: S01
- Validation: S01 delivered Badge chips with X remove buttons in filter-toolbar.tsx. removeFilter and clearAllFilters in filter-context.tsx.

### UX-03 — Filter state persists across chart navigation within the dashboard
- Class: core-capability
- Status: validated
- Description: Filter state persists across chart navigation within the dashboard
- Source: inferred
- Primary owning slice: S01
- Validation: S01 lifted FilterProvider to layout-level DashboardLayoutClient. Filter state persists across all dashboard navigation.

### UX-04 — Filter toolbar applies to all visible charts simultaneously
- Class: core-capability
- Status: validated
- Description: Filter toolbar applies to all visible charts simultaneously
- Source: inferred
- Primary owning slice: S01
- Validation: S01 delivered single FilterToolbar at layout level filtering all 45+ dashboard charts via shared FilterProvider context.

### UX-05 — SWOT comparative claims link to the specific companies behind each number
- Class: core-capability
- Status: validated
- Description: SWOT comparative claims link to the specific companies behind each number
- Source: explicit
- Primary owning slice: S06
- Validation: S06 attached companies[] arrays to 4 quantified SWOT claims with clickable drill-down panel in swot-chart.tsx.

## Traceability

| ID | Class | Status | Primary owner | Supporting | Proof |
|---|---|---|---|---|---|
| DATA-01 | core-capability | validated | S04 | none | S04 swapped estimatedMarketValue to Best Available Valuation column in load-companies-server.ts and funding route. |
| DATA-02 | core-capability | validated | S05 | none | S05 added 4 pipeline metadata fields (valuationConfidence, financialConfidence, reportedValuation, reportedValuationYear) to Company type and CSV loader. |
| I18N-06 | core-capability | validated | S03 | none | S03 fixed 4 franglais calques across 3 French translation files. Professional B2B language verified. |
| MON-01 | core-capability | validated | S02 | none | S02 delivered getUpgradeDiscounts() in stripe.ts with idempotent $4,999 coupon for Analyst-to-Strategist upgrades. |
| R019 | functional | validated | M012/S01 | M012/S02 | analytics_events table live in Neon with 3 indexes; POST /api/analytics/event returns 401 without auth; usePageViewTracker covers 52 dashboard routes; 5 interaction event types instrumented; build passes zero errors |
| R020 | functional | validated | M013/S01 | M013/S02 | Co-investment heatmap at /dashboard/co-investment and investor comparison at /dashboard/investor-compare both built, sidebar wired, build passes (107 routes, zero errors) |
| R021 | operational | validated | M014/S01 | M014/S02 | scripts/lighthouse-dashboard.mjs captures scores for 10 auth-gated pages; JSON reports saved to .gsd/lighthouse/; DASHBOARD-BASELINE.md documents all results |
| UX-01 | core-capability | validated | S01 | none | S01 delivered FilterToolbar in sidebar-shell.tsx as compact sticky element. Build passes. |
| UX-02 | core-capability | validated | S01 | none | S01 delivered Badge chips with X remove buttons in filter-toolbar.tsx. removeFilter and clearAllFilters in filter-context.tsx. |
| UX-03 | core-capability | validated | S01 | none | S01 lifted FilterProvider to layout-level DashboardLayoutClient. Filter state persists across all dashboard navigation. |
| UX-04 | core-capability | validated | S01 | none | S01 delivered single FilterToolbar at layout level filtering all 45+ dashboard charts via shared FilterProvider context. |
| UX-05 | core-capability | validated | S06 | none | S06 attached companies[] arrays to 4 quantified SWOT claims with clickable drill-down panel in swot-chart.tsx. |

## Coverage Summary

- Active requirements: 0
- Mapped to slices: 0
- Validated: 12 (DATA-01, DATA-02, I18N-06, MON-01, R019, R020, R021, UX-01, UX-02, UX-03, UX-04, UX-05)
- Unmapped active requirements: 0
