---
verdict: needs-attention
remediation_round: 0
---

# Milestone Validation: M001

## Success Criteria Checklist
- [x] **Compact sticky filter toolbar** — FilterToolbar component in sidebar-shell.tsx, FilterProvider at layout level in layout-client.tsx. Zero VizFilterBar references remain in app/dashboard/. (S01)
- [x] **Active filter chips with remove** — Badge chips with X buttons in filter-toolbar.tsx, clearAllFilters and removeFilter methods in filter-context.tsx. (S01)
- [x] **Filter state persists across navigation** — FilterProvider lifted to DashboardLayoutClient (layout level). UX-03 already validated. (S01)
- [x] **Single toolbar filters all charts** — One FilterToolbar instance in sidebar-shell.tsx consumed by all 45+ dashboard pages via shared context. (S01)
- [x] **$4,999 Stripe upgrade coupon** — getUpgradeDiscounts() in app/actions/stripe.ts with idempotent coupon creation, applied only for Analyst→Strategist upgrades. (S02)
- [x] **French translations reviewed and corrected** — 4 franglais calques fixed across 3 files: "collecté automatiquement", "Pas encore convaincu", "sélectionnée", "collecte automatisée". (S03)
- [x] **CSV data refresh with corrected dataset** — estimatedMarketValue reads "Best Available Valuation" in load-companies-server.ts and funding route.ts. (S04)
- [x] **Funding & valuation pipeline integration** — 4 new fields (valuationConfidence, financialConfidence, reportedValuation, reportedValuationYear) added to Company interface and CSV loader. (S05)
- [x] **SWOT drill-down links** — 4 quantified SWOT claims have companies[] arrays attached; clickable items with drill-down panel in swot-chart.tsx. (S06)
- [x] **Build passes** — npm run build completes with zero errors.

## Slice Delivery Audit
| Slice | Claimed Deliverable | Evidence | Verdict |
|-------|-------------------|----------|---------|
| S01 | Compact sticky filter toolbar replaces dialog overlay; filter state persists via layout-level FilterProvider | FilterProvider in layout-client.tsx, FilterToolbar in sidebar-shell.tsx, CompanyDataProvider exists, 0 VizFilterBar refs in dashboard, build passes | ✅ Delivered |
| S02 | Analyst purchasers receive $4,999 credit when upgrading to Strategist | getUpgradeDiscounts() in stripe.ts with idempotent coupon, conditional on analyst_annual purchase | ✅ Delivered |
| S03 | French pages reviewed for B2B language with corrections | 4 corrections across 3 files verified: collecté automatiquement, Pas encore convaincu, sélectionnée, collecte automatisée | ✅ Delivered |
| S04 | Dashboard charts render with corrected dataset | estimatedMarketValue mapped to "Best Available Valuation" in load-companies-server.ts and funding route | ✅ Delivered |
| S05 | Funding metadata fields flow from pipeline into data model | 4 fields (valuationConfidence, financialConfidence, reportedValuation, reportedValuationYear) in company-data.ts and load-companies-server.ts | ✅ Delivered |
| S06 | Quantified SWOT claims become clickable drill-down links | 4 SwotItems have companies[] arrays, clickable rendering with drill-down panel in swot-chart.tsx | ✅ Delivered |

## Cross-Slice Integration
**S04 → S05:** S05 consumes the "Best Available Valuation" column mapping established in S04. Both modify load-companies-server.ts. S05 adds 4 metadata fields on top of S04's valuation source swap. ✅ No boundary mismatch.

**S01 → S06:** S06's SWOT drill-down operates within the layout-level FilterProvider established by S01. S06 only modifies swot-chart.tsx and does not interfere with S01's filter architecture. ✅ No boundary mismatch.

**No cross-slice conflicts detected.** All slices touched non-overlapping files except the expected S04/S05 shared surface (load-companies-server.ts), which was properly sequenced via the S04 dependency.

## Requirement Coverage
| Requirement | Addressed By | Status in REQUIREMENTS.md | Should Be |
|-------------|-------------|--------------------------|-----------|
| UX-01 (compact sticky toolbar) | S01 | active | validated |
| UX-02 (filter chips with remove) | S01 | active | validated |
| UX-03 (filter state persists) | S01 | validated | validated ✅ |
| UX-04 (single toolbar filters all) | S01 | active | validated |
| MON-01 (Stripe upgrade coupon) | S02 | active | validated |
| I18N-06 (French translation review) | S03 | active | validated |
| DATA-01 (CSV data refresh) | S04 | active | validated |
| DATA-02 (funding pipeline integration) | S05 | active | validated |
| UX-05 (SWOT drill-down links) | S06 | active | validated |

**All 9 requirements are addressed by completed slices.** However, 8 of 9 remain at "active" status when they should be promoted to "validated" based on slice delivery evidence. UX-03 was correctly promoted. This is a bookkeeping gap — the functional work is complete.

**No unaddressed requirements remain.**


## Verdict Rationale
All 6 slices delivered their claimed outputs. Build passes. Cross-slice boundaries are clean. All 9 requirements are covered by completed slices.

The only gap is bookkeeping: 8 requirements remain at "active" status when slice evidence supports "validated". This does not represent a delivery gap — it's a status tracking oversight that can be corrected during milestone completion without remediation slices.

Additionally, the roadmap file lacks explicit success criteria, verification classes, and definition-of-done sections — validation was performed against slice "After this" claims and requirements. The lightweight roadmap format is acceptable for this polish milestone.

**Verdict: needs-attention** — all work delivered, minor requirement status bookkeeping needed during completion.
