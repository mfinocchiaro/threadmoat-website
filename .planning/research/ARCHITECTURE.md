# Google Search Console Integration Architecture

**Project:** ThreadMoat (M027 — GSC Integration)
**Researched:** 2026-05-05
**Confidence:** HIGH (Google official docs, Vercel official docs)
**Stack assumed:** Next.js 16 App Router, Postgres (Neon), Vercel hosting, NextAuth (existing), node `googleapis` client

---

## TL;DR (Recommended Architecture)

- **Auth:** Server-side OAuth 2.0 authorization-code flow with offline access. Store the `refresh_token` (encrypted with AES-256-GCM via Node `crypto`) in a dedicated `gsc_credentials` table. Do NOT mix with NextAuth's user session — this is an admin-owned site credential, not a per-user identity.
- **Sync:** Single Vercel Cron job at `06:00 UTC` daily hitting `/api/cron/gsc/sync`. Pulls `dataState=final` data for `endDate = today - 3 days` (the safe "fully baked" boundary). Idempotent upsert keyed by `(property, date, dimensions...)`.
- **Schema:** Wide-fact tables, one per dimension grain (`gsc_daily_totals`, `gsc_query_daily`, `gsc_page_daily`, `gsc_query_page_daily`). Composite primary keys + BRIN index on `date`.
- **Rate limits:** Stay well under 1,200 QPM/site by serializing daily pulls. Implement exponential backoff with full jitter on 429/`quotaExceeded`. Use `rowLimit=25000` + `startRow` pagination, terminating on empty rows or 50K daily cap.
- **Dashboard:** Read-only Postgres queries via existing dashboard pattern. Pre-compute weekly/monthly rollups in a materialized view refreshed nightly to keep dashboard queries < 100ms.
- **Caching:** Three layers — Postgres (source of truth), Next.js `unstable_cache` with 1-hour TTL keyed by date range, and module-level memoization for the active dashboard tab.

---

## 1. GSC OAuth Flow

### Decision: Authorization Code Flow with Offline Access

GSC requires OAuth 2.0 — no API keys for searchanalytics ([Authorize Requests](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing)). For a server-side Next.js app syncing one (or a few) ThreadMoat-owned GSC properties, the authorization-code flow with `access_type=offline` is the right choice. The admin authorizes once; the app silently refreshes tokens forever.

### Required Scope

Use **read-only** unless you plan to submit sitemaps or modify properties:

```
https://www.googleapis.com/auth/webmasters.readonly
```

Principle of least privilege. Read-only is sufficient for `searchanalytics.query`, `sites.list`, `sitemaps.list`, and `urlInspection.index.inspect`.

### Token Lifecycle

| Token | Lifetime | Storage |
|-------|----------|---------|
| `access_token` | 60 minutes | In-memory only (do not persist) |
| `refresh_token` | Indefinite (until revoked, 6 months idle, password change, or 50-token-per-client limit hit) | Encrypted in Postgres |
| `id_token` | Not needed | Discard |

The `refresh_token` is **only returned on the FIRST consent**. If the admin re-consents you will get a new one — store it conditionally (`if (tokens.refresh_token) { update }`). Use the `tokens` event from `google-auth-library` to capture refreshes.

### Recommended Implementation

```ts
// lib/gsc/auth.ts
import { OAuth2Client } from 'google-auth-library';

export function makeOAuthClient(refreshToken?: string) {
  const client = new OAuth2Client({
    clientId: process.env.GSC_CLIENT_ID,
    clientSecret: process.env.GSC_CLIENT_SECRET,
    redirectUri: `${process.env.NEXTAUTH_URL}/api/gsc/oauth/callback`,
  });
  if (refreshToken) client.setCredentials({ refresh_token: refreshToken });
  // Persist rotating tokens
  client.on('tokens', async (tokens) => {
    if (tokens.refresh_token) await persistRefreshToken(tokens.refresh_token);
  });
  return client;
}
```

Routes needed:
- `GET /api/gsc/oauth/start` — admin-only, builds `generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: [...] })` and 302s to Google
- `GET /api/gsc/oauth/callback` — exchanges `code` for tokens, encrypts `refresh_token`, writes `gsc_credentials`
- `POST /api/gsc/oauth/revoke` — calls `client.revokeCredentials()` and clears the row

### Token Storage (Encrypted)

Storing a long-lived refresh token in plaintext is a security smell — it grants standing access to your GSC account. Encrypt at rest using `crypto.createCipheriv('aes-256-gcm', ...)` with a 32-byte key from `GSC_ENCRYPTION_KEY` env. Store ciphertext, IV, and auth tag in separate columns.

```sql
CREATE TABLE gsc_credentials (
  id            SERIAL PRIMARY KEY,
  property_url  TEXT NOT NULL UNIQUE,           -- "sc-domain:threadmoat.com"
  refresh_token_ciphertext  BYTEA NOT NULL,
  refresh_token_iv          BYTEA NOT NULL,
  refresh_token_tag         BYTEA NOT NULL,
  scope         TEXT NOT NULL,
  authorized_by TEXT NOT NULL,                  -- admin email
  authorized_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_refreshed_at TIMESTAMPTZ,
  revoked_at    TIMESTAMPTZ
);
```

### CSRF Protection

Use a signed `state` parameter on `/oauth/start`. Validate it on `/oauth/callback`. Without state, an attacker can trick the admin into authorizing a different (attacker-controlled) Google account into ThreadMoat's GSC table.

---

## 2. Data Sync Strategy

### Decision: Daily Cron, Not Real-Time

GSC data is itself batch — performance data has a **2-day delay normally, occasionally 3–4 days** ([Google Search Central Community](https://support.google.com/webmasters/thread/216128633/data-from-gsc-api-is-delayed-by-over-2-days?hl=en)). Real-time sync is impossible by definition. Pulling more often than daily wastes quota and produces incrementally-completing rows that you'd just have to overwrite.

### Schedule

```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/gsc/sync", "schedule": "0 6 * * *" }
  ]
}
```

`06:00 UTC` puts it after the GSC daily batch boundary (Pacific Time midnight) and before US business hours dashboard usage.

### Sync Window

Each run pulls **the day that just became "final"** plus a 2-day re-sync window to catch GSC's delayed finalization:

```
endDate   = today_UTC - 3 days   (most recently final)
startDate = today_UTC - 5 days   (re-sync trailing edge)
```

Use `dataState=final` for stability — `dataState=all` includes "fresh" data that GSC will revise, causing churn in your DB. The 3-day backstop matches Google's own conservative guidance.

For initial backfill: pull the trailing 16 months (GSC's max retention) one day at a time. Run as a separate `/api/admin/gsc/backfill` route, not the cron. Vercel function `maxDuration` applies — see Section 4.

### Idempotency

Critical because Vercel cron may fire twice for one schedule ([Vercel Cron docs](https://vercel.com/docs/cron-jobs/manage-cron-jobs)). All writes are `INSERT ... ON CONFLICT (property_url, date, query, page) DO UPDATE SET ...`. Re-running a sync is a no-op when data hasn't changed and an upsert when it has.

Wrap the entire sync in an advisory lock to prevent concurrent runs:

```sql
SELECT pg_try_advisory_lock(hashtext('gsc_sync'));
```

If the lock is held, the second invocation logs and exits cleanly.

### Authentication on the Cron Endpoint

Vercel Cron requests carry user-agent `vercel-cron/1.0` and an automatic `Authorization: Bearer <CRON_SECRET>` header (Pro plan). Validate both:

```ts
if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`)
  return new Response('Unauthorized', { status: 401 });
```

Without this, anyone can hit the endpoint and burn your GSC quota.

### Sync Job Steps

```
1. Acquire pg_try_advisory_lock('gsc_sync'); abort if held.
2. SELECT property_url, refresh_token (decrypted) FROM gsc_credentials WHERE revoked_at IS NULL.
3. For each property:
   a. Build OAuth2Client with refresh_token.
   b. For each (date, dimension-set) tuple in the sync plan:
      - Call searchanalytics.query with rowLimit=25000, startRow=0.
      - Paginate: while response.rows.length === 25000 and startRow < 50000.
      - On 429/quotaExceeded → exponential backoff with jitter, max 5 retries.
      - Upsert rows to the appropriate fact table.
      - Record sync watermark in gsc_sync_log.
4. Release advisory lock.
5. Emit metrics (rows synced, duration, errors) to logs.
```

### Failure Modes & Recovery

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Refresh token revoked | `invalid_grant` from Google | Mark `revoked_at`, alert admin to re-authorize, abort sync |
| Quota exceeded | `quotaExceeded` error code | Exponential backoff (1s → 2s → 4s → 8s → 16s with full jitter), then defer remainder to next run |
| Vercel function timeout | Job runs > `maxDuration` | Cron retries next day; idempotent upserts mean no data loss. For backfills, checkpoint after each (date, dimension) tuple |
| Cron fired twice | Both jobs running | Advisory lock causes the second to no-op |
| Partial day pull (network drop) | `gsc_sync_log.completed_at IS NULL` | Next cron run picks up from watermark |
| GSC data delayed > 5 days | First-run sync window misses fresh data | Trailing 5-day re-sync window catches late finalization |
| Encryption key rotation | New key cannot decrypt old ciphertext | Keep `GSC_ENCRYPTION_KEY_OLD` env, dual-decrypt on read, re-encrypt on write |

---

## 3. Database Schema

### Design Principle: One Table Per Dimension Grain

Don't try to use a single fact table with NULL columns for absent dimensions. Each dimension combo has different cardinality and different query patterns. Four tables cover 95% of dashboard needs.

```sql
-- Per-property daily totals (smallest, fastest, most-queried)
CREATE TABLE gsc_daily_totals (
  property_url   TEXT NOT NULL,
  date           DATE NOT NULL,
  search_type    TEXT NOT NULL DEFAULT 'web',  -- web|image|video|news|discover|googleNews
  country        TEXT,                          -- ISO-3166-1 alpha-3, NULL = all
  device         TEXT,                          -- DESKTOP|MOBILE|TABLET, NULL = all
  clicks         INTEGER NOT NULL,
  impressions    INTEGER NOT NULL,
  ctr            NUMERIC(7,6) NOT NULL,
  position       NUMERIC(7,3) NOT NULL,
  synced_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (property_url, date, search_type, country, device)
);
CREATE INDEX gsc_daily_totals_date_brin ON gsc_daily_totals USING BRIN (date);

-- Per-query daily (medium volume — top queries by clicks)
CREATE TABLE gsc_query_daily (
  property_url   TEXT NOT NULL,
  date           DATE NOT NULL,
  query          TEXT NOT NULL,
  clicks         INTEGER NOT NULL,
  impressions    INTEGER NOT NULL,
  ctr            NUMERIC(7,6) NOT NULL,
  position       NUMERIC(7,3) NOT NULL,
  synced_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (property_url, date, query)
);
CREATE INDEX gsc_query_daily_date_brin ON gsc_query_daily USING BRIN (date);
CREATE INDEX gsc_query_daily_query_trgm ON gsc_query_daily USING GIN (query gin_trgm_ops);

-- Per-page daily
CREATE TABLE gsc_page_daily (
  property_url   TEXT NOT NULL,
  date           DATE NOT NULL,
  page           TEXT NOT NULL,
  clicks         INTEGER NOT NULL,
  impressions    INTEGER NOT NULL,
  ctr            NUMERIC(7,6) NOT NULL,
  position       NUMERIC(7,3) NOT NULL,
  synced_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (property_url, date, page)
);
CREATE INDEX gsc_page_daily_date_brin ON gsc_page_daily USING BRIN (date);
CREATE INDEX gsc_page_daily_page ON gsc_page_daily (page);

-- Page+Query daily (LARGEST — capped by GSC's 50K/day limit anyway)
CREATE TABLE gsc_query_page_daily (
  property_url   TEXT NOT NULL,
  date           DATE NOT NULL,
  query          TEXT NOT NULL,
  page           TEXT NOT NULL,
  clicks         INTEGER NOT NULL,
  impressions    INTEGER NOT NULL,
  ctr            NUMERIC(7,6) NOT NULL,
  position       NUMERIC(7,3) NOT NULL,
  synced_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (property_url, date, query, page)
);
CREATE INDEX gsc_query_page_daily_date_brin ON gsc_query_page_daily USING BRIN (date);
CREATE INDEX gsc_query_page_daily_page ON gsc_query_page_daily (page);

-- Sync audit log
CREATE TABLE gsc_sync_log (
  id             BIGSERIAL PRIMARY KEY,
  property_url   TEXT NOT NULL,
  sync_type      TEXT NOT NULL,         -- daily|backfill|manual
  start_date     DATE NOT NULL,
  end_date       DATE NOT NULL,
  dimensions     TEXT[] NOT NULL,
  rows_written   INTEGER,
  api_calls      INTEGER,
  started_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at   TIMESTAMPTZ,
  error          TEXT
);
CREATE INDEX gsc_sync_log_property_started ON gsc_sync_log (property_url, started_at DESC);
```

### Why BRIN over B-tree on `date`

BRIN indexes are 1000× smaller than B-tree for time-ordered inserts. Since GSC data arrives in date order and is queried by date range, BRIN is the right choice ([PostgreSQL with TimescaleDB indexing](https://www.slingacademy.com/article/postgresql-with-timescaledb-best-practices-for-indexing-time-series-data/)). At 5 years × 50K rows/day × 4 properties = ~365M rows, a B-tree on `date` is ~10GB. BRIN is ~10MB.

### Why NOT TimescaleDB

Tempting, but Neon doesn't support TimescaleDB extension and migrating off Neon is out of scope. Native Postgres + BRIN + materialized views handles ThreadMoat's volume comfortably.

### Why NOT JSON for dimensions

Tempting to store `{"query": "x", "page": "y"}` in JSONB. Don't. Composite PKs give cheap deduplication via `ON CONFLICT`, and indexed columns query 10–100× faster than JSONB paths.

### Materialized View for Dashboard Speed

```sql
CREATE MATERIALIZED VIEW gsc_query_weekly AS
SELECT
  property_url,
  date_trunc('week', date)::DATE AS week,
  query,
  SUM(clicks) AS clicks,
  SUM(impressions) AS impressions,
  SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0) AS ctr,
  SUM(position * impressions) / NULLIF(SUM(impressions), 0) AS position
FROM gsc_query_daily
GROUP BY property_url, date_trunc('week', date), query;

CREATE UNIQUE INDEX ON gsc_query_weekly (property_url, week, query);
```

Refresh after each daily sync: `REFRESH MATERIALIZED VIEW CONCURRENTLY gsc_query_weekly;`. Position is impression-weighted (a row with 10K impressions at position 5 should outweigh a row with 10 impressions at position 30).

---

## 4. API Rate Limiting

### Quota Numbers ([GSC Usage Limits](https://developers.google.com/webmaster-tools/limits))

| Quota | Limit |
|-------|-------|
| **Per-site** Search Analytics | 1,200 QPM |
| **Per-user** Search Analytics | 1,200 QPM |
| **Per-project** Search Analytics QPM | 40,000 |
| **Per-project** Search Analytics QPD | 30,000,000 |
| **Per-site** URL Inspection | 2,000 QPD, 600 QPM |
| **Other resources** per-user | 20 QPS, 200 QPM |
| Search Analytics rows per response | 25,000 max (1,000 default) |
| Search Analytics rows per day per type | 50,000 max |

There is also an undocumented "load quota" measured in 10-minute and 1-day windows. Heavy queries (page+query grouping, long date ranges) consume more load. Going wide on one grain blows load quota even when you're nowhere near QPM.

### Cost-Per-Query Hierarchy (cheapest → most expensive)

1. No grouping (property totals)
2. Group by `date` only
3. Group by `country` or `device`
4. Group by `query` OR `page`
5. **Group by `query` AND `page`** (most expensive)

Date range multiplies cost. A 6-month query is ~180× a 1-day query.

### Decision: One-Day-At-A-Time, Sequential

Pull each (date, dimension-set) as a separate API call. This stays well below QPM limits, makes failures resumable, and matches Google's own recommendation ("running a daily query for one day of data should not exceed your daily quota") in [Getting your performance data](https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data).

For ThreadMoat's daily sync (1 property, 4 dimension grains, 3-day window) = **12 API calls/day**. That is 0.0001% of project QPD. Backfill of 16 months = ~2,000 API calls, completed in one Vercel function invocation if structured right.

### Backoff Strategy

```ts
async function callWithBackoff<T>(fn: () => Promise<T>, attempt = 0): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const code = (err as any).code ?? (err as any).response?.status;
    const isRetryable = code === 429 || code === 503 ||
      (err as any).errors?.[0]?.reason === 'quotaExceeded';
    if (!isRetryable || attempt >= 5) throw err;
    const delayMs = Math.min(1000 * 2 ** attempt, 16000);
    const jitter = Math.random() * delayMs;     // full jitter
    await new Promise(r => setTimeout(r, delayMs + jitter));
    return callWithBackoff(fn, attempt + 1);
  }
}
```

Full jitter (random delay across the entire window) outperforms equal jitter for distributed workloads — relevant if multiple cron invocations ever overlap.

### Vercel Function Timeout Constraints

Cron endpoints run as Vercel Functions. Limits ([Next.js timeouts discussion](https://github.com/vercel/next.js/discussions/64437)):

| Plan | Route Handler `maxDuration` |
|------|------------------------------|
| Hobby | 10s default, 60s with Fluid Compute |
| **Pro** (ThreadMoat) | **300s default, 900s with `maxDuration` config** |
| Enterprise | up to 900s |

Daily sync at ~12 API calls × ~500ms each = 6s, well within Pro defaults. **Backfill** is the dangerous one — 2,000 calls × 500ms = 1,000s exceeds even 900s. Backfill must:
- Be split across multiple invocations (chunk by month)
- Use a job-state table to checkpoint progress
- Be triggered by a separate `/api/admin/gsc/backfill?from=YYYY-MM` route, not cron

Configure in route handler:

```ts
export const maxDuration = 300;  // seconds
export const runtime = 'nodejs'; // not edge — googleapis client needs Node APIs
```

---

## 5. Dashboard Integration

### Decision: Direct Postgres Queries via Server Components, Mirroring Existing Pattern

ThreadMoat already does Postgres-backed dashboards via Next.js server components and module-level caching ([PROJECT.md context]). GSC slots into this pattern — no new infrastructure.

### Data Flow Diagram

```
┌────────────────────┐
│  Vercel Cron 06:00 │
└─────────┬──────────┘
          │ HTTP GET /api/cron/gsc/sync
          ▼
┌──────────────────────┐    refresh_token (decrypted)
│  Sync Route Handler  │ ◄────────────── gsc_credentials
└─────────┬────────────┘
          │
          ▼
┌──────────────────────┐  searchanalytics.query
│  google-auth-library │ ───────────────────────► Google API
│  + googleapis client │ ◄─────────────────────── (rows[])
└─────────┬────────────┘
          │ upsert
          ▼
┌──────────────────────┐
│   Neon Postgres      │
│  ┌────────────────┐  │
│  │ gsc_*_daily    │  │  ◄── REFRESH MATERIALIZED VIEW
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ gsc_*_weekly   │  │
│  │ (mat view)     │  │
│  └────────────────┘  │
└─────────┬────────────┘
          │ SELECT (cached 1h)
          ▼
┌──────────────────────┐
│ Admin Dashboard RSC  │  /admin/gsc
│ - Top queries        │
│ - Top pages          │
│ - Click trend        │
│ - Position movements │
└─────────┬────────────┘
          │ JSON props
          ▼
┌──────────────────────┐
│ Recharts + D3 Client │  (existing pattern)
└──────────────────────┘
```

### Query Layer

```ts
// lib/gsc/queries.ts
import { unstable_cache } from 'next/cache';

export const getTopQueries = unstable_cache(
  async (propertyUrl: string, days: number) => {
    return sql`
      SELECT query, SUM(clicks) clicks, SUM(impressions) impressions,
             SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0) ctr,
             SUM(position * impressions) / NULLIF(SUM(impressions), 0) position
      FROM gsc_query_daily
      WHERE property_url = ${propertyUrl}
        AND date >= CURRENT_DATE - ${days}::INT
      GROUP BY query
      ORDER BY clicks DESC
      LIMIT 100
    `;
  },
  ['gsc-top-queries'],
  { revalidate: 3600, tags: ['gsc'] }
);
```

After each successful cron sync, call `revalidateTag('gsc')` to invalidate stale dashboard reads.

### Dashboard Components (suggested)

| Component | Backing query | Update cadence |
|-----------|---------------|----------------|
| KPI cards (clicks, impressions, CTR, avg position) | `gsc_daily_totals` aggregate | 1 hour cache |
| Click/impression trend line | `gsc_daily_totals` 90-day | 1 hour cache |
| Top queries table | `gsc_query_daily` 28-day | 1 hour cache |
| Top pages table | `gsc_page_daily` 28-day | 1 hour cache |
| Position movers (biggest delta vs prev period) | `gsc_query_daily` window function | 1 hour cache |
| Country heatmap | `gsc_daily_totals` grouped | 1 hour cache |

Re-use existing Recharts conventions for consistency. Position movers is the highest-value differentiator — that's the chart that gets attention.

### Access Control

Dashboard pages live under `/admin/gsc/*`. Reuse the existing admin role check (`role === 'admin'`). Do NOT expose GSC data to lower tiers — it reveals proprietary SEO performance.

---

## 6. Caching & Performance

### Three-Tier Cache Hierarchy

```
┌─────────────────────────────────────────────┐
│  Tier 3: Postgres (source of truth)         │
│  - Refreshed daily by cron                  │
│  - ~365M rows at 5-year horizon, manageable │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  Tier 2: Materialized views (weekly/monthly)│
│  - Pre-aggregated rollups                   │
│  - REFRESH CONCURRENTLY after each sync     │
│  - Dashboard queries hit this, not raw      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  Tier 1: Next.js unstable_cache (1h TTL)    │
│  - Per-query, per-date-range cache key      │
│  - Tag-invalidated after sync               │
│  - Survives across requests                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  Tier 0: Module-level memoization (request) │
│  - Existing ThreadMoat pattern              │
│  - Same query in same request = 1 DB hit    │
└─────────────────────────────────────────────┘
```

### Freshness vs Speed Tradeoff

GSC data is fundamentally 2–4 days stale. A 1-hour Next.js cache is invisible to users — they cannot tell the difference between "synced 1 hour ago" and "synced just now" when the underlying data is days old. **Cache aggressively.** The only freshness-sensitive event is "the cron just ran" — handle that with `revalidateTag('gsc')`.

### Performance Budget

| Operation | Budget | Approach |
|-----------|--------|----------|
| Dashboard page TTFB | < 500ms | Tier 1 cache hit on warm path |
| First load (cold cache) | < 1.5s | Materialized view + BRIN index |
| Cron sync duration | < 30s daily, < 5min monthly backfill | Sequential 1-day-at-a-time |
| DB write throughput | ~500 rows/sec sustained | Batch upsert via `INSERT ... VALUES (), (), ... ON CONFLICT` |

### Anti-Patterns to Avoid

| Anti-pattern | Why bad | Instead |
|--------------|---------|---------|
| Querying GSC API directly from dashboard route | 2-day-stale data, 1.2K QPM exhaustion under load, 500ms+ latency | Always read from Postgres |
| Storing `refresh_token` in plaintext | Database breach = permanent GSC compromise | AES-256-GCM with env-key |
| Reusing NextAuth Google provider for GSC scope | Conflates user identity with site credential, wrong scope on user logins | Dedicated OAuth flow under `/api/gsc/oauth/*` |
| Pulling full 16-month range in one call | Quota explosion, function timeout | Day-at-a-time pagination |
| Using `dataState=all` in scheduled syncs | Constantly-revising rows, churn in DB | `dataState=final` with 3-day backstop |
| JSONB column for dimensions | Slow filters, no FK, ugly queries | Composite primary key |
| B-tree index on `date` for 365M rows | 10GB index, slow inserts | BRIN index |
| Edge runtime for sync handler | `googleapis` client uses Node-only APIs | `export const runtime = 'nodejs'` |
| Skipping `state` param on OAuth | CSRF attack vector | Signed state on `/oauth/start` |

---

## Sources

**Primary (HIGH confidence — official Google/Vercel docs):**
- [Search Analytics: query API reference](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Authorize Requests | Search Console API](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing)
- [Usage Limits | Search Console API](https://developers.google.com/webmaster-tools/limits)
- [Getting your performance data | Search Console API](https://developers.google.com/webmaster-tools/v1/how-tos/all-your-data)
- [A deep dive into Search Console performance data filtering and limits](https://developers.google.com/search/blog/2022/10/performance-data-deep-dive)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Managing Cron Jobs](https://vercel.com/docs/cron-jobs/manage-cron-jobs)
- [google-auth-library-nodejs (GitHub)](https://github.com/googleapis/google-auth-library-nodejs)

**Secondary (MEDIUM confidence — community / vendor blogs corroborated):**
- [Google Search Console API Limits & Fixes (Similar AI)](https://similar.ai/guides/google-search-console-api/)
- [GSC API Advanced Guide (Incremys)](https://www.incremys.com/en/resources/blog/google-search-console-api)
- [Pull all rows from GSC API (Short Automaton)](https://www.shortautomaton.com/gsc-search-analytics-all-rows/)
- [Next.js timeout discussion #64437](https://github.com/vercel/next.js/discussions/64437)
- [PostgreSQL with TimescaleDB indexing best practices](https://www.slingacademy.com/article/postgresql-with-timescaledb-best-practices-for-indexing-time-series-data/)

**Latency context:**
- [GSC API data delay community thread](https://support.google.com/webmasters/thread/216128633/data-from-gsc-api-is-delayed-by-over-2-days?hl=en)
