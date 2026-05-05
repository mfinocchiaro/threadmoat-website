# Roadmap: ThreadMoat Website

## Milestones

- ✅ **v1.0 Production Launch** — Phases 14, 1-5 (shipped 2026-03-24)
- 🚧 **v1.1 UX & Data Polish** — Phases 6-9 (in progress)

<details>
<summary>✅ v1.0 Production Launch (Phases 14, 1-5) — SHIPPED 2026-03-24</summary>

See: `milestones/v1.0-ROADMAP.md` for full details.

</details>

## Phases

### 🚧 v1.1 UX & Data Polish (In Progress)

- [ ] Phase 6: Filter Toolbar Redesign — compact sticky toolbar for dashboard
  - **Goal:** Replace the large filter dialog overlay with a compact sticky toolbar at the top of the dashboard content area that filters all charts simultaneously
  - **Requirements:** UX-01, UX-02, UX-03, UX-04
  - **Depends on:** None
  - **Plans:** 3 plans
    - [x] 06-01-PLAN.md — Lift FilterProvider to layout level, create CompanyDataProvider
    - [ ] 06-02-PLAN.md — Build compact sticky FilterToolbar component and wire into layout
    - [ ] 06-03-PLAN.md — Remove VizFilterBar from all 45 dashboard page files
  - **Success criteria:**
    1. Sticky toolbar visible at top of dashboard, never blocks content
    2. Active filters shown as removable pills/chips
    3. Changing filters updates the current chart immediately
    4. Filter state persists when navigating between charts
    5. Toolbar collapses to minimal height when no filters active

- [ ] Phase 7: Stripe Upgrade Coupon — credit report purchasers on upgrade
  - **Goal:** Create and wire a Stripe coupon that credits $4,999 when an Analyst (report) purchaser upgrades to Strategist subscription
  - **Requirements:** MON-01
  - **Depends on:** None
  - **Plans:** 1 plan
    - [ ] 07-01-PLAN.md — Create coupon, detect Analyst purchase, apply discount in Strategist checkout
  - **Success criteria:**
    1. Coupon exists in Stripe dashboard with $4,999 one-time discount
    2. Upgrade flow detects existing Analyst purchase and applies coupon automatically
    3. Strategist checkout shows discounted price

- [ ] Phase 8: French Translation Review — quality pass
  - **Goal:** Review and correct French translations across all public pages
  - **Requirements:** I18N-06
  - **Depends on:** None
  - **Success criteria:**
    1. All French pages reviewed for natural, professional B2B language
    2. Corrections committed and deployed

- [ ] Phase 9: CSV Data Refresh — swap corrected dataset
  - **Goal:** Replace current CSV data files with fact-checked versions from the separate GSD project
  - **Requirements:** DATA-01
  - **Depends on:** External (other GSD project must complete)
  - **Success criteria:**
    1. New CSV files swapped in
    2. All charts render correctly with updated data
    3. No broken references or missing fields

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|---------------|--------|-----------|
| 6. Filter Toolbar | v1.1 | 1/3 | In Progress | - |
| 7. Upgrade Coupon | v1.1 | 0/1 | Not started | - |
| 8. French Review | v1.1 | 0/? | Not started | - |
| 9. CSV Refresh | v1.1 | 0/? | Not started | - |

---

## 🚧 M027: Search Indexing & Analytics (In Progress)

**Vision:** Build internal SEO observability for ThreadMoat. Integrate Google Search Console data with daily syncs, position tracking, and striking distance opportunity scoring to surface high-impact keyword optimization targets.

**Success Criteria:**
1. ✅ OAuth verification submission to Google (4-6 week approval window)
2. ✅ Daily Vercel Cron sync pulling GSC data (50K rows/day cap handled)
3. ✅ Core dashboard with query/page lists, position charts, period-over-period comparison
4. ✅ Striking distance report (positions 8-20, high impressions, low CTR)
5. ✅ All data freshness and anonymization transparency built in
6. ✅ `npm run build` — 0 errors

## Phases (M027)

### Phase 1: OAuth + Technical Spikes
**Goal:** Establish GSC OAuth integration, validate technical approach, submit verification to Google.

**Requirements:** FOUND-01, SPIKE-01, SPIKE-02, SPIKE-03, SPIKE-04, INTEG-01, INTEG-03

**Depends on:** None

**Plans:** 4 plans
- S01-T01-PLAN.md — Google OAuth2 setup, authorization code flow, token encryption
- S01-T02-PLAN.md — PT timezone bucketing validation (empirical data pull)
- S01-T03-PLAN.md — 50K rows/day cap testing on sandbox property
- S01-T04-PLAN.md — Submit OAuth verification screen to Google (CRITICAL PATH)

**Success Criteria:**
1. OAuth scope: `webmasters.readonly`, offline access
2. Refresh token encrypted with AES-256-GCM, stored in Neon
3. OAuth verification submitted to Google (screenshot in ticket)
4. Empirical confirmation: GSC `date` field is Pacific Time (not UTC)
5. API cap behavior documented: 50K rows returns empty page
6. Vercel Cron environment variables configured
7. Team aware: "Expect Google approval in 4-6 weeks before v1 rollout"

---

### Phase 2: Sync Engine + Schema
**Goal:** Build Postgres schema, implement daily sync logic, set up caching and idempotent upserts.

**Requirements:** FOUND-02, FOUND-03, FOUND-04, FOUND-05, INTEG-02, PERF-02

**Depends on:** S01 (OAuth approved or in review)

**Plans:** 3 plans
- S02-T01-PLAN.md — Postgres schema migrations (5 tables, composite PKs, indexes)
- S02-T02-PLAN.md — Vercel Cron job (daily 06:00 UTC, sequential API calls, p-queue, rate limiting)
- S02-T03-PLAN.md — Materialized views, unstable_cache setup, refresh logic

**Success Criteria:**
1. `gsc_credentials`, `gsc_daily_totals`, `gsc_query_daily`, `gsc_page_daily`, `gsc_query_page_daily` tables created
2. Idempotent upserts via composite PKs and ON CONFLICT DO UPDATE
3. BRIN indexes on gsc_date (verified <1000x compression)
4. GIN trigram on query column (substring search validated)
5. Vercel Cron executes daily, respects 1,200 QPM limit, completes in <300s
6. 7-10 day re-import for GSC correction windows working
7. Materialized view refresh <2s post-sync
8. unstable_cache with tag revalidation configured

---

### Phase 3: Core Dashboard Views
**Goal:** Build query/page lists, position charts, period-over-period comparison, data quality indicators.

**Requirements:** QUERY-01, QUERY-02, QUERY-03, QUERY-04, QUERY-05, POS-01, POS-02, PERF-01, QUAL-01, QUAL-02, QUAL-03, QUAL-04

**Depends on:** S02 (schema, sync, caching in place)

**Plans:** 4 plans
- S03-T01-PLAN.md — Query/page list components (Recharts tables, sorting, filtering)
- S03-T02-PLAN.md — Time-series and position distribution charts
- S03-T03-PLAN.md — Period-over-period comparison, delta calculations
- S03-T04-PLAN.md — Data freshness banner, anonymization transparency, audit log UI

**Success Criteria:**
1. `/insights/seo/queries` list renders with clicks | impressions | CTR | avg_pos columns
2. `/insights/seo/pages` list renders with same columns
3. Query/page drilldown shows (query, page) time-series
4. Time-series chart with inverted Y-axis for position
5. Position distribution bucketing (top 3, top 10, 11-20, 21+)
6. Period-over-period picker, delta calculations, top movers highlighted
7. Anonymization percentage displayed: "Tracked: 50K (47% anonymized)"
8. Freshness banner: "Data current through: YYYY-MM-DD"
9. Dashboard page load <2s (including auth)
10. Sorting, filtering <200ms

---

### Phase 4: Striking Distance Report
**Goal:** Implement opportunity scoring for keywords in positions 8-20 with high impressions and underperforming CTR.

**Requirements:** STRIKE-01, STRIKE-02, STRIKE-03

**Depends on:** S03 (dashboard foundation, query/page analytics)

**Plans:** 2 plans
- S04-T01-PLAN.md — Materialized view `mv_gsc_striking_distance`, opportunity scoring formula (T1/T2/T3 tiers)
- S04-T02-PLAN.md — Dashboard page `/insights/seo/striking-distance`, sorted by opportunity, color-coded tiers, export CSV

**Success Criteria:**
1. Striking distance definition: position 8-20, impressions >100, CTR <(benchmark - 0.5%)
2. Opportunity score formula: (impressions/1000) × (expected_ctr - actual_ctr) × (1/log(position))
3. Tier distribution: T1 (score >0.05), T2 (0.02-0.05), T3 (<0.02)
4. Dashboard page lists striking distance queries, sorted by opportunity, color-coded
5. Per-query metadata: why it's stuck (low backlinks, missing keyword, low word count)
6. Export as CSV with tiers and recommendations
7. Week-over-week comparison: "X queries in striking distance (+Y from last week)"

---

### Phase 5: Polish + Pre-launch Hardening
**Goal:** Edge cases, documentation, monitoring, analytics event logging.

**Requirements:** General hardening, no new feature requirements

**Depends on:** S01-S04 (all features complete)

**Plans:** 3 plans
- S05-T01-PLAN.md — Refresh token rotation/revocation handling, error recovery, edge cases
- S05-T02-PLAN.md — Admin documentation, runbook, troubleshooting guide
- S05-T03-PLAN.md — Analytics events, usage telemetry, monitoring dashboards

**Success Criteria:**
1. Refresh token expiry handled gracefully (re-auth prompt, no data loss)
2. 101st refresh token doesn't silently revoke 1st (revocation on reconnect)
3. API access validation post-OAuth (test query to confirm permissions)
4. All error paths logged with context (property, query count, timestamp)
5. Admin runbook: "What to do if Cron stalls", "How to re-import 7 days of data", "Quota cap detected — next steps"
6. Usage events logged: queries_analyzed, striking_distance_count, export_count
7. Monitoring dashboard: sync success rate, avg query latency, 50th/95th percentile response times

---

### Cross-Phase Dependencies

```
Phase 1 (OAuth + Spikes)
  ↓ (OAuth approval + PT timezone validation)
Phase 2 (Sync + Schema)
  ↓ (Schema ready, data flowing)
Phase 3 (Core Dashboard)
  ↓ (Query/page analytics complete)
Phase 4 (Striking Distance)
  ↓ (All features validated)
Phase 5 (Polish + Pre-launch)
```

No parallel phases. Sequential execution ensures OAuth verification completes before production rollout.

---

### Timeline (Estimated)

| Phase | Duration | Notes |
|-------|----------|-------|
| 1 | 5-7 days | OAuth spike only; verification submission happens Day 1, approval happens in parallel over 4-6 weeks |
| 2 | 4-5 days | Schema, Cron, caching — straightforward engineering |
| 3 | 6-8 days | Dashboard views (4 components), period comparison, transparency UI |
| 4 | 3-4 days | Materialized view + dashboard page (smaller scope than Phase 3) |
| 5 | 2-3 days | Polish, edge cases, hardening |
| **Total** | **20-27 days** | Plus 4-6 week OAuth approval gate |

**Go-live gate:** OAuth approval from Google + all S01-S05 complete.

---

### Production Readiness Gates

- [ ] Google OAuth verification approved (required before v1 launch)
- [ ] All slices complete and integrated
- [ ] Build verified: 0 errors, 0 TypeScript errors
- [ ] Dashboard pages render <2s (auth included)
- [ ] Cron executes daily without manual intervention
- [ ] Data freshness transparently communicated to users
- [ ] Admin runbook complete and team trained

---

*Roadmap created: 2026-05-05*
