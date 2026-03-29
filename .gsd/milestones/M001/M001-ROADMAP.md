# M001: M001: v1.1 UX & Data Polish

## Vision
Polish the shipped v1.0 product with a compact filter toolbar, Stripe upgrade coupon, French translation review, corrected CSV data refresh, and SWOT drill-down links.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Filter Toolbar Redesign | medium | — | ✅ | Compact sticky filter toolbar replaces the old dialog overlay; filter state persists across dashboard navigation via layout-level FilterProvider. |
| S02 | Stripe Upgrade Coupon | medium | — | ✅ | Existing Analyst (report) purchasers automatically receive a $4,999 credit when upgrading to a Strategist annual subscription. |
| S03 | French Translation Review — quality pass | low | — | ✅ | All French public pages reviewed for natural, professional B2B language with corrections committed. |
| S04 | CSV Data Refresh — swap corrected dataset | low | — | ⬜ | Dashboard charts render with fact-checked CSV data from the corrected dataset. |
| S05 | Funding & Valuation Data Integration | medium | S04 | ⬜ | Verified funding amounts, reported valuations, and structured funding fields (Latest Round Amount, Funding Confidence, Source Tier) flow from the agentic pipeline into the website's CSV data and dashboard charts. |
| S06 | SWOT & Report Drill-Down Links | low | S01 | ✅ | Quantified claims in the SWOT chart ("7 better-funded rivals", "12 higher-scoring competitors", "Crowded segment (45 competitors)") and scenario dashboard KPIs become clickable links showing the exact companies behind each number. |
