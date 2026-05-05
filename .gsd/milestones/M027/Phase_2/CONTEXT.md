# Phase 2 Context — Sync Engine + Schema

**Milestone:** M027 — Search Indexing & Analytics  
**Phase:** 2 (Sync Engine + Schema)  
**Duration:** 5-7 days  
**Blockers:** Phase 1 complete (OAuth working, timezone validated, Cron reliability confirmed)

## Goal

Build the sync infrastructure to pull Google Search Console data daily into Neon and expose it via API. This is the foundation for the SEO analytics dashboard.

## Why This Phase Matters

- **Phase 1 validated assumptions**: OAuth approval in progress, timezone confirmed (PT), Cron reliable for 50K+ rows
- **Phase 2 builds operational system**: Real daily syncs, data persistence, error recovery
- **Critical before Phase 3**: Dashboard cannot exist without data — sync must be solid first

## Requirements Covered (INTEG-04, INTEG-05, DATA-01, DATA-02, DATA-03)

| ID | Requirement | Task | Priority |
|----|-------------|------|----------|
| INTEG-04 | GSC data schema in Neon (daily snapshots per property, retention policy) | P2-T01 | Critical |
| INTEG-05 | Daily sync job: fetch → validate → store (with transaction rollback on error) | P2-T02 | Critical |
| DATA-01 | Query API: rankings by date/query/page (sorted by CTR desc) | P2-T03 | High |
| DATA-02 | Query API: traffic trends (clicks/impressions/position over time) | P2-T03 | High |
| DATA-03 | Error handling: malformed API response, partial failure, token expiry recovery | P2-T02 | High |

## Phase Dependencies

**Depends on:** Phase 1 complete (OAuth tokens working, assumptions validated)

**Blocks:** Phase 3 (Dashboard UI) — awaiting query APIs + sample data

## Critical Path

```
Day 1: T01 (Schema design + migration) — MUST COMPLETE
       T02 (Sync job skeleton) — IN PARALLEL
Days 2-3: T02 (Sync job implementation + error handling)
Days 4-5: T03 (Query APIs + testing)
Days 6-7: Integration testing, data validation, edge cases
```

**Go-no-go gate:** Day 5 — all tasks code-complete, first 3 days of synced data in DB, queries working

---

## Phase Success Criteria

1. ✅ Schema created: `gsc_rankings`, `gsc_impressions` (or unified `gsc_daily_data`)
2. ✅ Sync job deployed to Vercel Cron, runs daily at 06:00 UTC
3. ✅ First 3 days of real GSC data synced and validated
4. ✅ Query API working: `/api/admin/gsc/rankings` (filters by date, query, property)
5. ✅ Error recovery: token expiry, API failures, partial syncs handled gracefully
6. ✅ Data retention: at least 180 days (6 months rolling window)
7. ✅ Monitoring: Cron logs captured, sync success/failure tracked

---

## Known Unknowns (De-risked by Phase 1, Addressed in Phase 2)

- GSC API response format (pagination, field names) → documented in T02
- Sync latency with real data (Phase 1 tested with test data) → measured in T02
- Storage requirements per property (1-7 days of data) → calculated in T01
- Error patterns in production (API rate limits, token refresh failures) → handled in T02

---

## Output Artifacts

- `.gsd/milestones/M027/Phase_2/P2-T01-PLAN.md` — Schema design + migration
- `.gsd/milestones/M027/Phase_2/P2-T02-PLAN.md` — Sync job + error handling
- `.gsd/milestones/M027/Phase_2/P2-T03-PLAN.md` — Query APIs
- `.gsd/milestones/M027/Phase_2/SUMMARY.md` — Phase completion report
- `db/migrations/M027_*.sql` — Schema migrations (Neon)
- `app/api/admin/gsc/` — Query endpoints

---

**Phase Status:** Ready to Plan  
**Created:** 2026-05-05  
**Last Updated:** 2026-05-05
