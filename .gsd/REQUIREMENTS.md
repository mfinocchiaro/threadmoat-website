# Requirements

This file is the explicit capability and coverage contract for the project.

## Active

### R023 — Free preview tier — permanent Recon access (no 30-day expiry) with top 50 companies by weighted score visible across search, profiles, and the 3 existing free charts. Upgrade CTAs and 'Showing X of 500+' indicators on gated content.
- Class: functional
- Status: active
- Description: Free preview tier — permanent Recon access (no 30-day expiry) with top 50 companies by weighted score visible across search, profiles, and the 3 existing free charts. Upgrade CTAs and 'Showing X of 500+' indicators on gated content.
- Why it matters: Enables the content marketing flywheel — LinkedIn posts drive signups, free tier builds habit and email list, upgrade CTAs convert to paid. Removes trial expiry friction that kills retention.
- Source: go-to-market strategy
- Primary owning slice: M019/S01

### R024 — Smooth plan transitions — Strategist expiry falls back to Analyst (if prior purchase) or Recon. Subscription expiry banners. Pricing page messaging reflects permanent free tier and tier value propositions.
- Class: functional
- Status: active
- Description: Smooth plan transitions — Strategist expiry falls back to Analyst (if prior purchase) or Recon. Subscription expiry banners. Pricing page messaging reflects permanent free tier and tier value propositions.
- Why it matters: Users who downgrade or let subscriptions expire need a graceful experience that maintains trust and keeps the door open for re-subscription. Bad downgrade UX creates resentment.
- Source: go-to-market strategy
- Primary owning slice: M019/S02

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

### R022 — Company search bar with fuzzy type-ahead and curated company profile pages
- Class: functional
- Status: validated
- Description: Company search bar with fuzzy type-ahead — search by name, category, subcategory, investors. Results open a curated company profile with expandable sections (hero card, financials, scores, investors, customers, tags, AI narrative).
- Why it matters: Users who already know which companies they want to explore need a direct path without navigating through charts. Makes the platform a reference tool, not just an exploration tool.
- Source: user-feedback
- Primary owning slice: M018/S01
- Validation: M018/S01 delivered fuzzy search in topbar + company profile page at /dashboard/company/[id] with hero, financials, scores, investors, customers, tags, and AI narrative sections. Live on threadmoat.com.

### R025 — Scenario-aware narrative thread with per-chart annotations and guided journey
- Class: functional
- Status: validated
- Description: Scenario-aware narrative thread — each of the 4 focus scenarios (Competitive Moat, Investment Thesis, White Space, Acquisition Radar) gets contextual guidance: an intro narrative explaining the analytical journey, per-chart annotations explaining what to look for and why this chart matters for that scenario, and a suggested chart order / "next step" flow.
- Why it matters: Without narrative thread, the dashboard is a random collection of charts. Users (especially first-time) don't know what to look at, in what order, or what insights to extract. Scenario-aware guidance turns the product from a toolbox into a guided analysis experience — critical for justifying premium pricing and reducing churn.
- Source: user-feedback (James)
- Primary owning slice: M018/S04
- Validation: M018/S04 delivered scenario-narrative.tsx (intro narratives for 4 scenarios on dashboard landing) and chart-annotation.tsx (per-chart annotations with suggested next-step links). Live on threadmoat.com.

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
| R022 | functional | validated | M018/S01 | none | M018/S01 delivered fuzzy search in topbar + company profile page at /dashboard/company/[id]. Live on threadmoat.com. |
| R023 | functional | active | M019/S01 | none | pending — mapped to M019 |
| R024 | functional | active | M019/S02 | none | pending — mapped to M019 |
| R025 | functional | validated | M018/S04 | none | M018/S04 delivered scenario-narrative.tsx and chart-annotation.tsx. Live on threadmoat.com. |
| UX-01 | core-capability | validated | S01 | none | S01 delivered FilterToolbar in sidebar-shell.tsx as compact sticky element. Build passes. |
| UX-02 | core-capability | validated | S01 | none | S01 delivered Badge chips with X remove buttons in filter-toolbar.tsx. removeFilter and clearAllFilters in filter-context.tsx. |
| UX-03 | core-capability | validated | S01 | none | S01 lifted FilterProvider to layout-level DashboardLayoutClient. Filter state persists across all dashboard navigation. |
| UX-04 | core-capability | validated | S01 | none | S01 delivered single FilterToolbar at layout level filtering all 45+ dashboard charts via shared FilterProvider context. |
| UX-05 | core-capability | validated | S06 | none | S06 attached companies[] arrays to 4 quantified SWOT claims with clickable drill-down panel in swot-chart.tsx. |

## Coverage Summary

- Active requirements: 2 (R023, R024)
- Mapped to slices: 2 (M019/S01, M019/S02)
- Validated: 14 (DATA-01, DATA-02, I18N-06, MON-01, R019, R020, R021, R022, R025, UX-01, UX-02, UX-03, UX-04, UX-05)
- Unmapped active requirements: 0
