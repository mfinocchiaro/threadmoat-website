---
id: M001
title: "v1.1 UX & Data Polish"
status: complete
completed_at: 2026-03-29T19:14:25.557Z
key_decisions:
  - CompanyDataProvider wraps FilterProvider — company data available before filters
  - Provider hierarchy: PlanProvider > ScenarioProvider > CompanyDataProvider > FilterProvider > LayoutInner
  - Idempotent Stripe coupon creation with fixed ID (retrieve-or-create pattern)
  - Coupon is duration:once ($4,999 off first invoice only), applied only for strategist_annual
  - Best Available Valuation is the authoritative valuation source replacing Estimated Market Value
  - Companies array attached to SwotItem for optional drill-down with dotted underline signaling clickability
  - viz-filter-bar.tsx kept as deprecated reference, not deleted
key_files:
  - components/dashboard/filter-toolbar.tsx
  - components/dashboard/filter-toolbar-popover.tsx
  - components/dashboard/layout-client.tsx
  - components/dashboard/sidebar-shell.tsx
  - contexts/company-data-context.tsx
  - contexts/filter-context.tsx
  - app/actions/stripe.ts
  - messages/fr/about.json
  - messages/fr/pricing.json
  - messages/fr/report.json
  - lib/load-companies-server.ts
  - lib/company-data.ts
  - app/api/funding/route.ts
  - components/charts/swot-chart.tsx
lessons_learned:
  - Requirements must be inserted into the GSD database at milestone planning time, not just written in REQUIREMENTS.md — the gsd_requirement_update tool queries the DB, not the markdown file
  - Mechanical removal of a component from 45+ files benefits from a dedicated task to isolate risk from the creative/architectural tasks
  - Idempotent retrieve-or-create patterns for Stripe resources avoid manual dashboard setup and simplify deployment
---

# M001: v1.1 UX & Data Polish

**Polished v1.0 with a compact filter toolbar, Stripe upgrade coupon, French translation fixes, corrected valuation data, funding pipeline integration, and SWOT drill-down links.**

## What Happened

M001 delivered six slices across four domains — UX, monetization, i18n, and data quality — completing the planned v1.1 polish pass.

**Filter Toolbar Redesign (S01)** was the largest slice (3 tasks). It replaced the 565-line per-page VizFilterBar dialog with a compact sticky FilterToolbar at layout level. FilterProvider was lifted to DashboardLayoutClient, a new CompanyDataProvider was introduced for shared company data, and VizFilterBar was mechanically removed from all 45 dashboard pages. Active filter chips render as Badge components with X remove buttons. The provider hierarchy (PlanProvider > ScenarioProvider > CompanyDataProvider > FilterProvider > LayoutInner) ensures filter state persists across all navigation.

**Stripe Upgrade Coupon (S02)** added automatic $4,999 credit for Analyst-to-Strategist upgrades. The getUpgradeDiscounts() helper in stripe.ts queries the purchases table, and if a completed analyst_annual purchase exists, ensures a one-time Stripe coupon via an idempotent retrieve-or-create pattern. No manual Stripe dashboard setup required.

**French Translation Review (S03)** fixed 4 franglais calques across 3 translation files — replacing "scrapé" with "collecté automatiquement", "curée" with "sélectionnée", "scraping" with "collecte automatisée", and upgrading casual register ("Pas encore sûr" → "Pas encore convaincu").

**CSV Data Refresh (S04)** swapped the valuation source from the old heuristic "Estimated Market Value" to pipeline-verified "Best Available Valuation" in both the main company loader and funding API route.

**Funding & Valuation Data Integration (S05)** extended the Company interface with 4 pipeline metadata fields (valuationConfidence, financialConfidence, reportedValuation, reportedValuationYear) wired from the agentic pipeline's CSV columns.

**SWOT Drill-Down Links (S06)** made 4 quantified SWOT claims clickable — "Crowded segment", "N better-funded rivals", "N higher-scoring competitors", and "Above segment average" — each showing a drill-down panel listing the exact backing companies with investment list, country, funding, and weighted score.

## Success Criteria Results

- [x] **Compact sticky filter toolbar replaces dialog overlay** — FilterToolbar in sidebar-shell.tsx, zero VizFilterBar references remain. (S01)
- [x] **Active filter chips with remove buttons** — Badge chips with X in filter-toolbar.tsx, removeFilter/clearAllFilters in filter-context.tsx. (S01)
- [x] **Filter state persists across dashboard navigation** — FilterProvider lifted to layout-level DashboardLayoutClient. (S01)
- [x] **Single toolbar filters all charts via shared context** — One FilterToolbar instance consumed by 45+ dashboard pages. (S01)
- [x] **$4,999 Stripe upgrade coupon for Analyst→Strategist** — getUpgradeDiscounts() in stripe.ts with idempotent coupon. (S02)
- [x] **French translations reviewed and corrected** — 4 calques fixed across 3 files. (S03)
- [x] **Dashboard uses corrected valuation data** — Best Available Valuation column mapped in loader and API route. (S04)
- [x] **Funding pipeline metadata integrated** — 4 fields added to Company type and CSV loader. (S05)
- [x] **SWOT quantified claims are clickable drill-downs** — 4 items have companies[] arrays with drill-down panel. (S06)
- [x] **Build passes** — npm run build completes with zero errors.

## Definition of Done Results

- [x] All 6 slices complete with summaries and UAT checklists written
- [x] All 8 tasks complete with summaries
- [x] npm run build passes with zero errors
- [x] All 9 requirements promoted to validated with proof text
- [x] Milestone validation passed (needs-attention verdict, bookkeeping gap resolved)
- [x] No remediation slices required
- [x] Cross-slice integration verified: S04→S05 and S01→S06 boundaries clean

## Requirement Outcomes

All 9 requirements transitioned from **active → validated**:

| Requirement | Evidence |
|-------------|----------|
| UX-01 | FilterToolbar in sidebar-shell.tsx as compact sticky element |
| UX-02 | Badge chips with X remove buttons in filter-toolbar.tsx |
| UX-03 | FilterProvider at layout-level DashboardLayoutClient |
| UX-04 | Single FilterToolbar filters all 45+ dashboard pages via shared context |
| UX-05 | 4 quantified SWOT claims with companies[] drill-down in swot-chart.tsx |
| MON-01 | getUpgradeDiscounts() in stripe.ts with idempotent $4,999 coupon |
| I18N-06 | 4 franglais calques fixed across 3 French translation files |
| DATA-01 | estimatedMarketValue mapped to Best Available Valuation |
| DATA-02 | 4 pipeline metadata fields added to Company type and CSV loader |

Note: Requirements were initially hand-written in REQUIREMENTS.md but not inserted into the GSD database. During validation, all 9 were inserted into the DB and promoted to validated.

## Deviations

None.

## Follow-ups

None.
