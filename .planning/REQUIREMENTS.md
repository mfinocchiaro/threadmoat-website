# M027 Requirements — Search Indexing & Analytics

**Milestone:** M027 — Search Indexing & Analytics  
**Phase:** Requirements Definition  
**Status:** ACTIVE  
**Created:** 2026-05-05

---

## Overview

Build internal SEO observability via Google Search Console (GSC) integration. v1 focuses on GSC API foundation, daily sync pipeline, keyword/page analytics, position tracking, and the striking distance report (positions 8-20 with high impressions + low CTR) — the v1 differentiator that justifies the investment.

**Out of scope for v1 (defer to v1.1):** Brand segmentation, KPI cards, anomaly detection, query clustering, forecasting.

**Critical Path (Phase 1):** OAuth verification submission (4-6 week Google approval cycle) + PT timezone bucketing validation.

---

## Requirements by Category

### FOUNDATION: GSC API Client & Daily Sync Pipeline

| ID | Requirement | Priority | Success Criteria |
|----|----|----------|------------------|
| **FOUND-01** | Implement Google Search Console OAuth2 authorization flow with offline refresh tokens | Critical | Users can authorize their GSC properties via OAuth. Encrypted refresh tokens stored in Neon with AES-256-GCM (pgcrypto). Revocation on reconnect. No hardcoded credentials. |
| **FOUND-02** | Build Vercel Cron daily sync at 06:00 UTC pulling GSC data state=final for rolling 3-day window + 7-10 day re-import for late corrections | Critical | Cron triggers daily. Per-property sequential calls (not parallel). Window: endDate=today-3days, startDate=today-5days. Re-import logic re-fetches days [today-10:today-3] weekly to capture delayed GSC corrections. Handles 1,200 QPM quota per property, <300s execution. |
| **FOUND-03** | Design and migrate Postgres schema for GSC data with idempotent upserts and composite primary keys | Critical | 5 tables: (1) gsc_credentials (user_id, property_url, oauth_token_encrypted, token_expires_at), (2) gsc_daily_totals (user_id, property, gsc_date, clicks, impressions, ctr, avg_position), (3) gsc_query_daily (user_id, property, query, gsc_date, clicks, impressions, ctr, position), (4) gsc_page_daily (user_id, property, page, gsc_date, clicks, impressions, ctr, position), (5) gsc_query_page_daily (user_id, property, query, page, gsc_date, clicks, impressions, ctr, position). Composite PKs: (user_id, property, gsc_date), etc. ON CONFLICT DO UPDATE upserts. BRIN indexes on gsc_date (1000x compression). GIN trigram on query column. |
| **FOUND-04** | Implement per-property rate-limiting and error handling for GSC API quota (1,200 QPM, 50K rows/day per property hard cap) | Critical | Sync respects 1,200 QPM limit via p-queue sequential mode. Detects 50K rows/day cap (empty pagination) and stops gracefully. Logs quota exhaustion. UI banner shown when cap reached. Admin notified. No orphaned partial syncs. |
| **FOUND-05** | Build idempotent sync logic to handle 2-3 day GSC data lag and occasional 5+ day anomalies | High | Materialized view `mv_gsc_daily_aggregates` refreshed post-sync. Data lag documented in schema (gsc_sync_completed_at timestamp). 7-10 day re-import catches corrections. Admin audit log shows sync history. UI banner: "Data current through: YYYY-MM-DD". |

### ANALYTICS: Query & Page Lists

| ID | Requirement | Priority | Success Criteria |
|----|----|----------|------------------|
| **QUERY-01** | Implement searchable query list view: query, clicks, impressions, CTR, average position | Critical | Dashboard page `/insights/seo/queries` displays table with columns: query \| clicks \| impr \| ctr \| avg_pos. Sortable. Filterable by date range. Shows anonymization percentage: "Total: 95K \| Tracked: 50K (47% anonymized)". Row-level detail drilldown to query-page matrix. |
| **QUERY-02** | Implement searchable page list view: page URL, clicks, impressions, CTR, average position | Critical | Dashboard page `/insights/seo/pages` displays table with columns: page \| clicks \| impr \| ctr \| avg_pos. Sortable. Filterable by date range. Drilldown to query-page matrix for page. Internal link highlighting (pages with <5 clicks). |
| **QUERY-03** | Implement query-page detail view showing all impressions and clicks for query+page pair | High | Drilldown modal or detail page shows time-series (daily) for selected (query, page) pair. Hover tooltips for CTR and position. Export option to CSV. Shows why this (query, page) pair matters: position, impression trend, CTR trend. |
| **QUERY-04** | Add period-over-period comparison (28-day rolling default, admin-configurable) | High | Date range picker in top nav. Compare "This period" vs "Previous period" (same length). Show delta: Δ clicks, Δ impressions, Δ CTR, Δ position (inverted: lower position is better). Highlight top movers (biggest Δ clicks). |
| **QUERY-05** | Handle query anonymization display (47% of long-tail traffic) | High | All query/page lists show "Tracked: X (Y% of total)". Row with "Other queries" for aggregated anonymized traffic. Dashboard KPI: "Tracked queries: 50,247 / Total traffic: 95,441 (47% anonymized)". No row-level drill into anonymized queries. |

### ANALYTICS: Position Tracking & Charts

| ID | Requirement | Priority | Success Criteria |
|----|----|----------|------------------|
| **POS-01** | Implement time-series chart (30/90/365 day windows) with inverted Y-axis: position over time for query or page | Critical | Recharts LineChart, Y-axis inverted (9→1 top, 50→bottom). Daily data points. Hover tooltip: date \| position \| impressions \| CTR. Drilldown from query list to query time-series. Save favorite queries for dashboard. |
| **POS-02** | Implement position distribution bucketing: top 3, top 10, 11-20, 21+. Aggregate and trend. | High | Dashboard widget "Position Distribution This Period": pie chart or stacked bar showing % queries in each bucket. Previous period overlay for comparison. Clicking bucket filters query list to show only queries in that range. |
| **POS-03** | Show CTR benchmark expectations by position (Google empirical data: pos 1 ~30% CTR, pos 5 ~6%, pos 10 ~2.5%, pos 20 ~0.5%) | Medium | Add benchmark line to CTR vs position scatter plot (optional). Tooltip: "Expected CTR for position X: Y%. Actual: Z% (±N%)". Helps identify underperforming queries. |

### ANALYTICS: Striking Distance Report (v1 Differentiator)

| ID | Requirement | Priority | Success Criteria |
|----|----|----------|------------------|
| **STRIKE-01** | Implement striking distance query detection: position 8-20 + impressions >100 + CTR <benchmark-0.5% | Critical | Materialized view `mv_gsc_striking_distance` computes per-query: is_striking (position BETWEEN 8 AND 20 AND impressions > 100 AND ctr < expected_ctr - 0.005). Dashboard page `/insights/seo/striking-distance` lists striking distance queries sorted by opportunity score. Counts: "X queries in striking distance (+Y from prev period)". |
| **STRIKE-02** | Implement composite opportunity scoring for striking distance queries: T1 (high opportunity), T2 (medium), T3 (lower) | Critical | Scoring formula: opportunity_score = (impressions / 1000) × (expected_ctr - actual_ctr) × (1 / log(position)). Tier: T1 if score >0.05, T2 if 0.02-0.05, T3 if <0.02. Sort by score DESC. Color-code tiers (red T1, yellow T2, green T3). Export tier list with recommended actions. |
| **STRIKE-03** | Show opportunity analysis: top 5 content changes or backlink targets to improve position for striking distance queries | Medium | Per-striking-distance query, show "Why this query is stuck at position X" insights: low backlinks, missing keyword in title, low word count. Suggest: add internal links, update meta title, expand word count. Powered by query + page analysis, not external API. |

### DATA QUALITY: Freshness, Lag, & Transparency

| ID | Requirement | Priority | Success Criteria |
|----|----|----------|------------------|
| **QUAL-01** | Display data freshness banner: "Data current through YYYY-MM-DD (X days old)" | High | All analytics pages show banner at top. "Days old" calculated from (today - last_gsc_sync_completed_at). Highlight red if >5 days old (GSC lag anomaly). |
| **QUAL-02** | Document and communicate 2-3 day GSC data lag to users | High | Help docs: "GSC reports data with a 2-3 day lag. Friday's data appears Tuesday morning. Occasional anomalies (5+ day delay) are GSC-side." Banner + docs + FAQ. |
| **QUAL-03** | Surface anonymization impact: "Total traffic vs Tracked queries" | High | Dashboard KPI: "Tracked: 50K queries \| Total traffic: 95K (47% anonymized)". Per-property setting to show/hide impact. Admin can configure threshold. |
| **QUAL-04** | Log all sync events with timestamps, row counts, errors | High | Admin audit log: timestamp \| property \| rows_synced \| rows_upserted \| errors \| quota_pct_used. Accessible via /admin/gsc-sync-log. Helps troubleshoot outages. |

### CRITICAL PHASE 1 SPIKES (Non-Feature Work)

| ID | Requirement | Priority | Success Criteria |
|----|----|----------|------------------|
| **SPIKE-01** | Submit OAuth verification to Google for production scope (offline access) | Critical | Day 1 spike: submit consent screen for verification. Google's response time: 4-6 weeks (varies by queue). Approval required to avoid Test mode refresh token expiry (7 days). Must include clear explanation: "ThreadMoat is a B2B SaaS platform for industrial AI market intelligence. Admin users connect their own GSC properties for internal SEO analytics." Provide screenshot of OAuth flow, dashboard usage. |
| **SPIKE-02** | Validate PT timezone bucketing empirically: confirm GSC `date` field is Pacific Time, not UTC | Critical | Phase 1 spike: pull sample GSC data, compare gsc_date values to UTC timestamps. Verify that "today's date" in GSC data represents PST/PDT midnight. Update schema docs: `gsc_date` is Pacific Time (comment on column). UI labels: "Date (Pacific Time)". |
| **SPIKE-03** | Test GSC API connectivity and 50K rows/day cap on sandbox property with high traffic | High | Phase 1 spike: use high-traffic test property (>50K rows/day expected). Run pagination loop, confirm empty page when hitting cap. Measure API latency (should be <100ms per call). Test refresh token refresh cycle. Document in runbook: "If you see empty page after row N, you've hit the 50K cap." |
| **SPIKE-04** | Confirm Vercel Cron execution reliability and timeout behavior under 50K-100K row loads | High | Phase 1 spike: deploy dummy Cron job, monitor 7 days of executions. Verify no silent failures, timeout handling, error email alerts. Vercel timeout: 300s. Confirm <300s for 50K rows. |

### INTEGRATIONS & DEPENDENCIES

| ID | Requirement | Priority | Success Criteria |
|----|----|----------|------------------|
| **INTEG-01** | Neon Postgres extensions: pgcrypto (token encryption), pg_trgm (query search) | Critical | Both extensions enabled in Neon project settings. AES-256-GCM functions available for token storage. Trigram GIN indexes support substring queries on `query` column. |
| **INTEG-02** | Next.js App Router unstable_cache for materialized view queries (1-hour TTL, tag-invalidated post-sync) | High | Materialized view queries cached with `unstable_cache(..., ['gsc-data'], { revalidate: 3600 })`. Post-sync Cron calls `revalidateTag('gsc-data')` to clear cache. Reduces query latency to <100ms for dashboard queries. |
| **INTEG-03** | Vercel Cron daily job + Google OAuth2 library (@googleapis/searchconsole, google-auth-library) | Critical | Dependencies installed, configured. Cron IAM role / secrets: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URI in Vercel env. No hardcoded credentials. |

### PERFORMANCE & SCALE

| ID | Requirement | Priority | Success Criteria |
|----|----|----------|------------------|
| **PERF-01** | Query/page list tables load <500ms for 365-day rolling window (365M rows potential) | High | BRIN + GIN indexes + pagination (20 rows/page default) + mview. Dashboard page load from fresh start <2s (including auth). Sorting, filtering <200ms. |
| **PERF-02** | Cron sync completes within Vercel timeout (300s) for single property with 50K rows/day | High | Sequential API calls respect 1,200 QPM limit. Batch inserts via multi-row VALUES clause. Total time <300s. Monitored via `console.time()` and Vercel logs. |

---

## Requirements Summary

**Total Requirements:** 23  
**Critical (Blocking):** 11  
**High (Pre-v1.0):** 8  
**Medium (Nice-to-have v1.1):** 4

**Validation Approach:**
- Requirements FOUND-01 through FOUND-05: Validated by Phase 1 spike work (OAuth verification, timezone confirmation, API testing)
- Requirements QUERY-01 through QUERY-05: Validated by Phase 3 dashboard launch + user testing
- Requirements POS-01 through POS-03: Validated by Phase 3 + data visualization acceptance
- Requirements STRIKE-01 through STRIKE-03: Validated by Phase 5 + striking distance report rollout
- Requirements QUAL-01 through QUAL-04: Validated continuously during Phases 2-5
- Requirements SPIKE-01 through SPIKE-04: Validated during Phase 1 (spike work produces evidence)
- Requirements INTEG-01 through INTEG-03: Validated during Phase 2 (database, caching, auth setup)
- Requirements PERF-01 through PERF-02: Validated via load testing in Phase 2 + production monitoring

---

## Deferred to v1.1+ (Out of Scope for M027 v1)

- Brand vs non-brand query segmentation (admin regex config)
- KPI cards with aggregate deltas
- Anomaly detection (statistical)
- What-if forecasting (trend projection)
- Query clustering via Ollama embeddings
- Search intent classification
- AI Overview impact tracking

---

**Last Updated:** 2026-05-05  
**Status:** ACTIVE — Ready for Roadmap phase
