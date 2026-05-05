# Technology Stack — M027 Google Search Console Integration

**Project:** ThreadMoat Website
**Milestone:** M027 — Google Search Console integration, daily sync, SEO analytics dashboards
**Researched:** 2026-05-05
**Overall confidence:** HIGH

> **Scope note:** This document covers ONLY the new stack additions for M027.
> Existing capabilities (Next.js 16 App Router, NextAuth, Postgres/Neon, Vercel hosting,
> D3, Recharts, Tailwind, shadcn/ui, next-intl) are reused as-is. Versions for those
> packages were validated against `.planning/PROJECT.md` and are not duplicated here.

---

## 1. GSC API Integration

### Recommended Package

| Package | Version | Purpose | Why |
|---------|---------|---------|-----|
| `@googleapis/searchconsole` | `^5.0.0` | GSC REST client (typed) | Official Google submodule. Smaller install footprint than full `googleapis` (171.4.0) since we only need one surface. |
| `google-auth-library` | `^10.6.2` | OAuth2 / refresh-token plumbing | Bundled transitively by `@googleapis/searchconsole`, but pin explicitly so we control the OAuth2Client used in our token-refresh route. Auto-refreshes when `expiry_date` + `refresh_token` are present. |

**Install:**

```bash
npm install @googleapis/searchconsole google-auth-library
```

### Authentication Method: OAuth2 (NOT service account)

| Auth Method | Verdict | Reason |
|-------------|---------|--------|
| **OAuth2 (offline access + refresh token)** | ✅ Use this | ThreadMoat customers will connect THEIR OWN GSC properties. We cannot pre-grant a service account to a customer's verified property — that requires the customer to manually add the SA email as a property user. OAuth consent flow is friction-light and standard. |
| Service account | ❌ Skip | Only useful when ThreadMoat owns the GSC property (e.g., for tracking threadmoat.com itself — a one-off admin case, not the product feature). |
| API keys | ❌ Not supported | GSC API does not accept API keys; OAuth2 user identity is mandatory. |

**Required OAuth scope:** `https://www.googleapis.com/auth/webmasters.readonly`
(Read-only — we never write to GSC. Use the broader `webmasters` scope only if we later add sitemap submission.)

**Token storage:** Encrypted in Postgres (`gsc_connections` table — see §4). NextAuth's existing JWT session is for ThreadMoat auth, NOT for GSC tokens. Keep them separate; GSC is a "linked account" pattern.

**Critical detail:** `refresh_token` is returned only on the FIRST consent. If the user re-authorizes without revoking, you get no refresh_token. Solution: always pass `prompt=consent` + `access_type=offline` on the first connect, store the refresh_token immediately, and never overwrite with null on subsequent re-auths.

### API Surface We Actually Use

| Endpoint | Purpose | Quota Cost |
|----------|---------|------------|
| `searchanalytics.query` | Clicks, impressions, CTR, position by query/page/date | Heavy — see §2 |
| `sites.list` | List properties user has access to | Cheap — once on connect |
| `sites.get` | Verify a property is still accessible | Cheap — runs per sync |

We do NOT use: `sitemaps.*`, `urlInspection.*` (Phase 2 candidate), `urlTestingTools.*`.

---

## 2. Data Sync & Scheduling

### Recommended: Vercel Cron + Idempotent Sync Endpoint

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Vercel Cron Jobs** | Native (no install) | Daily trigger | First-class on Vercel, no external dependency. 100 cron jobs/project on every plan. Fires only on production deployments. |
| **`p-queue`** | `^8.1.0` | Concurrency control inside the sync handler | GSC API has per-site QPM limits (1,200 QPM); a single tenant batch can blow past it without backpressure. `p-queue` gives `concurrency: 4, intervalCap: 100, interval: 60_000`. |
| **`p-retry`** | `^6.2.0` | Exponential backoff on 429/503 | Idiomatic, tiny, plays well with `p-queue`. |

**Install:**

```bash
npm install p-queue p-retry
```

### Cron Configuration

`vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/gsc-sync", "schedule": "0 6 * * *" }
  ]
}
```

- **6:00 UTC daily** — runs after Google's nightly index processing, well after the 2-3 day data freshness boundary.
- **Idempotency key:** `(connection_id, date, dimension_set)` — see §4 schema. Vercel may double-deliver; design the upsert to no-op on conflict.
- **Auth:** Verify `request.headers.authorization === "Bearer ${process.env.CRON_SECRET}"` to prevent public abuse of the endpoint.

### Vercel Function Duration Limits (Pro plan, 2026)

| Plan | Max Duration | Implication |
|------|--------------|-------------|
| Hobby | 10s default, 60s max | Insufficient for multi-tenant sync |
| **Pro (current ThreadMoat)** | 300s (5min) max with Fluid Compute | Sufficient for ~50-100 tenant batches per cron tick. Beyond that, fan out. |
| Enterprise | 900s (15min) | Not needed yet |

**Fan-out pattern when tenant count grows:**
1. Cron handler enumerates tenants needing sync, splits into batches of 25.
2. Each batch posts to `/api/cron/gsc-sync-batch?cursor=N` via Vercel queue or direct fetch.
3. Each batch is its own 300s function invocation.
4. Persist last-successful-date per tenant so a partial failure resumes correctly tomorrow.

### Why NOT alternatives

| Alternative | Verdict | Reason |
|-------------|---------|--------|
| GitHub Actions cron | ❌ | Adds CI dependency; Vercel cron is built in and free at this scale. |
| External service (Trigger.dev, Inngest) | ❌ for now | Overkill for one daily sync. Reconsider if we add real-time webhooks or multi-step workflows. |
| `node-cron` in long-running process | ❌ | Vercel is serverless — no persistent process to host it. |
| Supabase Edge / pg_cron | ❌ | We're on Neon, not Supabase. Neon offers `pg_cron` extension but it can't make outbound HTTPS calls easily. |

### GSC API Quotas to Respect (HIGH confidence — official docs)

- **searchAnalytics.query:** 1,200 QPM per site/user; 30M QPD + 40K QPM per project.
- **Hard cap:** ~50,000 page-keyword pairs per property per day in result set.
- **Load quota:** Short-term (10 min) and long-term (1 day) "load" budget — large date ranges + many dimensions burn it fast.
- **Data freshness:** 2-3 day delay before today's data appears. **Always sync `today - 3` to be safe**, then re-sync `today - 2` and `today - 3` again next run to capture late corrections (data is mutable for ~3 days).

---

## 3. Dashboard Visualization

**Existing stack is sufficient.** Recharts + D3 already shipped for 44+ dashboards. Below are the SEO-specific tweaks, not new libraries.

### Chart Type → Library Mapping

| Metric / View | Library | Notes |
|---------------|---------|-------|
| Clicks/impressions over time (line) | **Recharts** (existing) | `LineChart` with dual Y-axis (clicks left, impressions right). |
| Position trend per keyword (line) | **Recharts** (existing) | Inverted Y-axis (position 1 at top). Use `YAxis reversed` prop. |
| Top queries / pages (bar + table) | **Recharts** + **shadcn/ui Table** (existing) | Sortable, paginated table is the workhorse view. |
| Keyword movement heatmap | **D3** (existing) | Reuse the M002 heatmap drilldown component pattern (per `MEMORY.md`). |
| CTR vs position scatter | **Recharts** `ScatterChart` (existing) | Classic SEO insight visualization — known shape (CTR drops with position rank). |
| Country / device breakdown (donut) | **Recharts** `PieChart` (existing) | Standard segment view. |

### One Genuinely New Helper

| Package | Version | Purpose | Why |
|---------|---------|---------|-----|
| `date-fns` (or `dayjs`) | check existing — likely already present | Date range math, week/month bucketing for trend aggregation | Almost certainly already in the project (next-intl ecosystem). Verify before installing. **DO NOT add a second date library.** |

If neither exists, prefer **`date-fns@^4.1.0`** (tree-shakable, TS-first, no Moment-style mutability footguns).

### Pattern Notes

- **Color semantics for SEO:** Position improvement = green, decline = red. Reuse the existing theme color tokens from M005 (per `MEMORY.md`) — don't introduce new chart palettes.
- **Compare-mode UI:** SEO dashboards always need "this 28d vs prior 28d" comparison. Recharts handles this with two `<Line>` overlays; build a reusable `<TrendCompare>` wrapper.

---

## 4. Data Storage

**No new database technology** — stay on Neon Postgres. Schema considerations only.

### Recommended Schema Sketch

```sql
-- Tenant ↔ GSC connection (one tenant may connect multiple properties)
CREATE TABLE gsc_connections (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_url    TEXT NOT NULL,         -- e.g. "sc-domain:example.com"
  refresh_token   TEXT NOT NULL,         -- ENCRYPTED at rest (pgcrypto)
  access_token    TEXT,                  -- ephemeral
  token_expiry    TIMESTAMPTZ,
  last_sync_date  DATE,                  -- last GSC date successfully ingested
  status          TEXT NOT NULL DEFAULT 'active', -- active|paused|error|revoked
  last_error      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, property_url)
);

-- Daily metrics snapshot (the time-series fact table)
CREATE TABLE gsc_daily_metrics (
  connection_id   UUID NOT NULL REFERENCES gsc_connections(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  query           TEXT,                  -- nullable: aggregate rows have NULL
  page            TEXT,                  -- nullable
  country         CHAR(3),               -- ISO-3, nullable
  device          TEXT,                  -- desktop|mobile|tablet, nullable
  clicks          INTEGER NOT NULL DEFAULT 0,
  impressions     INTEGER NOT NULL DEFAULT 0,
  ctr             NUMERIC(6,4) NOT NULL DEFAULT 0,
  position        NUMERIC(6,2) NOT NULL DEFAULT 0,
  ingested_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (connection_id, date, query, page, country, device)
);

CREATE INDEX gsc_daily_conn_date_idx
  ON gsc_daily_metrics (connection_id, date DESC);

CREATE INDEX gsc_daily_query_trgm_idx
  ON gsc_daily_metrics USING GIN (query gin_trgm_ops);  -- query search
```

### Key Schema Decisions

| Decision | Rationale |
|----------|-----------|
| **One wide fact table** (not separate tables per dimension) | GSC's data model is already a star at the API edge; mirror it. Wide-row PK with NULL dimensions for aggregates is the pattern most SEO tools use. |
| **NUMERIC for CTR/position, INTEGER for clicks/impressions** | Position can be `1.43`; CTR is a fraction. Don't store CTR as percent — derive on read. |
| **No TimescaleDB / hypertables** | At ThreadMoat scale (≤ a few hundred connected properties × ≤ 50K rows/property/day = ~25M rows/year), vanilla Postgres + a `(connection_id, date)` btree is fine. **Defer Timescale unless we exceed ~250M rows.** Neon doesn't support the Timescale extension natively anyway. |
| **Native partitioning if needed later** | If table > 100M rows, declarative range partition by `date` (monthly partitions). Postgres 13+ handles thousands of partitions easily. Not needed in v1. |
| **Encrypt refresh tokens** | Use `pgcrypto`'s `pgp_sym_encrypt` with a key from Vercel env vars. NEVER store plaintext OAuth refresh tokens — they're equivalent to long-lived passwords. |
| **`(connection_id, date, query, page, country, device)` PK** | Provides natural idempotency for `INSERT ... ON CONFLICT DO UPDATE`. Cron retries become safe. |
| **Re-sync 3-day rolling window each run** | GSC data is mutable for ~3 days. The PK upsert handles late-arriving corrections cleanly. |

### Migration Tooling

Use whatever ThreadMoat already uses (likely Drizzle or Prisma — verify in `package.json`). **Do not introduce a new ORM.** Add migrations as standard `.sql` files under the project's existing `migrations/` directory.

### Storage Sizing

- ~50K rows/property/day × 365 days × 100 properties ≈ 1.8B row-slots theoretical, but real fan-out is ~10K rows/property/day at p50 → ~360M rows/year for 100 tenants.
- At ~120 bytes/row → ~45 GB/year. Neon Pro tier autoscaling handles this; budget storage cost in capacity planning.
- **Add a retention policy:** roll up rows > 90 days old to weekly aggregates (separate `gsc_weekly_metrics` table) and drop the daily granularity. Most users care about recent + trend, not 365-day query-level detail.

---

## 5. Versions & Rationale Summary

| Package | Version | Confidence | Why This Choice |
|---------|---------|------------|-----------------|
| `@googleapis/searchconsole` | `^5.0.0` | HIGH | Official Google submodule, current. Smaller bundle than full `googleapis`. |
| `google-auth-library` | `^10.6.2` | HIGH | Official, auto-refresh built in, current major. |
| `p-queue` | `^8.1.0` | MEDIUM | De-facto standard for concurrency-bounded async work in Node. Mature, tiny, ESM. |
| `p-retry` | `^6.2.0` | MEDIUM | Pairs naturally with `p-queue`. Used widely for retrying flaky upstream APIs. |
| Vercel Cron | native | HIGH | Already on Vercel Pro; zero new vendor surface. |
| Postgres (Neon) | existing | HIGH | Already in stack. No new DB needed at projected scale. |
| Recharts / D3 | existing | HIGH | Existing chart layer is sufficient for all SEO viz. |
| `pgcrypto` | Postgres ext. | HIGH | Standard for at-rest encryption of OAuth tokens. Enable via `CREATE EXTENSION IF NOT EXISTS pgcrypto;`. |

### What We Explicitly Do NOT Add

| Tempting Option | Why Skipped |
|-----------------|-------------|
| TimescaleDB | Not supported on Neon; not needed at our scale. |
| Inngest / Trigger.dev | Single daily cron doesn't justify a workflow service. |
| Redis (BullMQ etc.) | No queue depth justifies it; Postgres + Vercel cron is enough. |
| Google Analytics Data API | Different product; out of scope for M027 (GSC only). |
| 3rd-party rank trackers (DataForSEO, SerpAPI) | M027 scope is "user's own GSC data," not external SERP scraping. Reconsider in a later milestone. |
| Recharts replacement (Visx, Tremor, Nivo) | Existing chart stack works; switching costs > benefits. |

---

## Sources

- [Search Console API Libraries — Google for Developers](https://developers.google.com/webmaster-tools/v1/libraries) (HIGH)
- [@googleapis/searchconsole — npm](https://www.npmjs.com/package/@googleapis/searchconsole) (HIGH)
- [googleapis — npm](https://www.npmjs.com/package/googleapis) (HIGH)
- [google-auth-library — npm](https://www.npmjs.com/package/google-auth-library) (HIGH)
- [google-auth-library-nodejs — GitHub](https://github.com/googleapis/google-auth-library-nodejs) (HIGH)
- [Authorize Requests | Search Console API](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing) (HIGH)
- [OAuth 2.0 for Web Server Apps — Google](https://developers.google.com/identity/protocols/oauth2/web-server) (HIGH)
- [Search Console API Usage Limits](https://developers.google.com/webmaster-tools/limits) (HIGH)
- [Vercel Cron Jobs — Quickstart](https://vercel.com/docs/cron-jobs/quickstart) (HIGH)
- [Vercel Cron Jobs — Manage](https://vercel.com/docs/cron-jobs/manage-cron-jobs) (HIGH)
- [Vercel Functions — Configuring Maximum Duration](https://vercel.com/docs/functions/configuring-functions/duration) (HIGH)
- [Cron jobs now support 100 per project on every plan](https://vercel.com/changelog/cron-jobs-now-support-100-per-project-on-every-plan) (HIGH)
- [Designing high-performance time series tables on Postgres — AWS](https://aws.amazon.com/blogs/database/designing-high-performance-time-series-data-tables-on-amazon-rds-for-postgresql/) (MEDIUM)
- [TimescaleDB — GitHub](https://github.com/timescale/timescaledb) (HIGH — for reference; not adopted)
