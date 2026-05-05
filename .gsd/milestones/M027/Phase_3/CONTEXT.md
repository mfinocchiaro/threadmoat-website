# Phase 3 Context — Dashboard UI & Visualization

**Milestone:** M027 — Search Indexing & Analytics  
**Phase:** 3 (Dashboard UI & Visualization)  
**Duration:** 3-5 days  
**Blockers:** Phase 2 complete (schema, sync job, query APIs all working)

## Goal

Build the frontend dashboard to visualize GSC data: keyword rankings, traffic trends, and performance metrics over time. This is the user-facing interface for the internal SEO observability system.

## Why This Phase Matters

- **Phase 2 delivered APIs** — Query functions exist but no UI to consume them
- **Phase 3 builds observability** — Teams can now see search performance trends
- **First graph validates the pipeline** — End-to-end proof that data flows from GSC → Neon → API → UI

## Requirements Covered

| ID | Requirement | Task | Priority |
|----|-------------|------|----------|
| UI-01 | Rankings table with search, sort, pagination | P3-T01 | High |
| UI-02 | Trends chart (daily/weekly/monthly) | P3-T02 | High |
| UI-03 | Property selector + date range picker | P3-T01 | High |
| UI-04 | Keyword filter + landing page drill-down | P3-T01 | High |
| UI-05 | Performance metrics cards (total clicks, avg CTR, avg position) | P3-T02 | Medium |

## Phase Dependencies

**Depends on:** Phase 2 complete (APIs working with real synced data)

**Blocks:** Phase 4+ (monitoring, alerts, advanced analytics)

---

## Critical Path

```
Days 1-2: T01 (Dashboard page, property/date selector, rankings table with sorting/filtering)
Days 2-3: T02 (Trends chart, metric cards, date grouping UI)
Days 3-4: Integration testing, edge cases, performance optimization
Day 5: Polish, documentation, go-live
```

---

## Phase Success Criteria

1. ✅ Dashboard page at `/dashboard/gsc` (or similar)
2. ✅ Property selector dropdown (list all user's GSC properties)
3. ✅ Date range picker (single picker for start/end dates)
4. ✅ Rankings table: query, page, date, clicks, impressions, CTR, position
5. ✅ Ranking table features: sort by any column, filter by keyword, pagination
6. ✅ Trends chart: line/bar chart showing clicks/impressions/CTR/position over time
7. ✅ Trends grouping: daily/weekly/monthly toggle
8. ✅ Metric cards: display total clicks, total impressions, avg CTR, avg position
9. ✅ Loading states and error handling (API failures, no data)
10. ✅ Responsive design (mobile-friendly)

---

## Technology Stack

- **Framework**: Next.js 16 (existing)
- **UI**: React 19 (existing)
- **Charting**: Recharts (or similar lightweight library)
- **Styling**: Tailwind CSS (existing)
- **State Management**: React hooks + URL params (no Redux needed)
- **API Calls**: Fetch API or fetch wrapper (existing)

---

## Known Unknowns & De-risking

- Recharts API and performance with large datasets
  - → Validate with 3+ months of data (180 days)
- Data freshness / timezone handling in UI
  - → Display PT timezone indicator, refresh button
- Mobile responsiveness of charts
  - → Test on phone-sized viewport
- Performance with many keywords (10K+ rows)
  - → Use pagination, lazy loading

---

## Output Artifacts

- `.gsd/milestones/M027/Phase_3/P3-T01-PLAN.md` — Dashboard page + rankings table
- `.gsd/milestones/M027/Phase_3/P3-T02-PLAN.md` — Trends chart + metric cards
- `.gsd/milestones/M027/Phase_3/SUMMARY.md` — Phase completion report
- `app/dashboard/gsc/page.tsx` — Main dashboard page
- `app/components/gsc/` — Reusable components (table, chart, selectors)

---

**Phase Status:** Ready to Plan  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05
