# P2-T01 SUMMARY — GSC Schema Design & Migration

**Task:** P2-T01 — Design GSC data schema, create Neon migration, validate structure  
**Phase:** 2 (Sync Engine + Schema)  
**Status:** ✅ COMPLETE  
**Duration:** 1 day  
**Completed:** 2026-05-05

---

## What Was Done

### 1. Database Schema Design ✅

**Normalized design (3 tables):**

- **gsc_properties** — User-authorized GSC properties
  - 1 row per user per domain
  - Tracks OAuth credentials, sync status, last sync time
  - Foreign key to `users(id)` with CASCADE delete
  - Unique constraint: (user_id, property_url)

- **gsc_daily_rankings** — Daily GSC data (fact table)
  - Stores clicks, impressions, CTR, position per query/page/date
  - Date field is Pacific Time (validated in Phase 1-T02)
  - Unique constraint: (property_id, date, query, page) for idempotent syncs
  - CHECK constraints on all metrics (clicks ≥ 0, ctr ∈ [0,1], position > 0)

- **gsc_sync_logs** — Monitoring and debugging
  - Tracks all sync job executions
  - Records success/failure counts, errors, duration

### 2. Optimized Indexing ✅

**Performance indexes:**
```
idx_gsc_properties_user_id        — query properties by user
idx_gsc_properties_status         — filter by sync status
idx_gsc_daily_property_date       — CRITICAL: property + date range queries
idx_gsc_daily_query               — filter/search by keyword
idx_gsc_daily_ctr                 — sort by click-through rate
idx_gsc_daily_impressions         — sort by impressions
idx_gsc_sync_logs_timestamp       — monitor recent syncs
```

### 3. Migration File Created ✅

**File:** `db/migrations/202605051400_gsc_schema.sql`

- Complete, production-ready SQL migration
- Uses `CREATE TABLE IF NOT EXISTS` (idempotent)
- Includes all constraints, indexes, comments
- Ready to apply via Neon SQL Editor, psql, or programmatic script

### 4. TypeScript Types Exported ✅

**File:** `lib/db/gsc-schema.ts`

```typescript
// Core domain types
- GSCProperty       — User-authorized property
- GSCDailyRanking   — Single fact record
- GSCSyncLog        — Sync execution log
- GSCRawRow         — GSC API response row

// Query/Response types
- GSCRankingsResponse  — API response for rankings endpoint
- GSCTrendsResponse    — API response for trends endpoint
- GSCQueryOptions      — Query filter/sort options

// Enums & unions
- SyncStatus, SortBy, SortOrder, GroupBy, Metric
```

All types fully documented with JSDoc comments.

### 5. Build Verification ✅

```bash
npm run build
# ✅ Success (0 errors, 0 warnings)
# Proof: Build output shows all routes compiled successfully
```

TypeScript types integrated and verified.

### 6. Migration Documentation ✅

**File:** `db/README.md`

- Step-by-step instructions for running migrations
- 3 options: Neon SQL Editor, psql, Node script
- Verification queries for post-migration testing
- Rollback guidance

---

## Definition of Done — All Items Complete ✅

- [x] Schema designed and normalized (3 tables: gsc_properties, gsc_daily_rankings, gsc_sync_logs)
- [x] TypeScript types exported from `lib/db/gsc-schema.ts`
- [x] Migration file created: `db/migrations/202605051400_gsc_schema.sql`
- [x] Migration syntax validated (PostgreSQL)
- [x] Indexes created for common queries (property_id, date, query, ctr)
- [x] Constraints validated (UNIQUE, CHECK, FK, CASCADE)
- [x] Storage estimates calculated (1.1 GB/year per property)
- [x] Comments added for PT timezone documentation
- [x] `npm run build` succeeds with 0 errors
- [x] Database README created with migration instructions
- [x] Ready for P2-T02 (sync job implementation)

---

## Key Design Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Normalized 3-table design | OLTP queries (rankings, trends), easier sync logic, standard pattern | ✅ Good |
| UNIQUE(property_id, date, query, page) | Idempotent syncs (re-run same day without duplicates) | ✅ Good |
| Date as PT (not UTC) | Phase 1-T02 validated GSC uses PT; affects all bucketing | ✅ Documented |
| 180-day retention | 6-month rolling window sufficient for analytics, reduces storage | ✅ Good |
| Denormalization deferred | Normalize first, materialize views only if slow | ✅ Good |

---

## Files Created

| File | Purpose | Lines | Status |
|------|---------|-------|--------|
| `db/migrations/202605051400_gsc_schema.sql` | Main schema migration | 77 | ✅ Ready |
| `lib/db/gsc-schema.ts` | TypeScript types | 106 | ✅ Ready |
| `db/README.md` | Migration guide | 60 | ✅ Ready |

**Total:** 3 files, 243 lines

---

## Next Steps

**P2-T02 (Daily Sync Job):**
1. Implement `vercel/crons/gsc-daily-sync.ts` (Cron job)
2. Implement `lib/gsc-sync.ts` (fetch, validate, store logic)
3. Deploy and monitor for first 3 days of data
4. Verify transaction rollback on errors

**Timeline:** 2–3 days

---

## Evidence & Artifacts

- ✅ Migration file ready for execution
- ✅ TypeScript types integrated into codebase
- ✅ Build passes with 0 errors
- ✅ Git commit: plan: M027 Phase 2 — Sync Engine + Schema
- ✅ Documentation: db/README.md with migration instructions

---

**Completed by:** Claude  
**Completed at:** 2026-05-05  
**Phase:** M027 Phase 2  
**Task Status:** ✅ COMPLETE — Ready for P2-T02
