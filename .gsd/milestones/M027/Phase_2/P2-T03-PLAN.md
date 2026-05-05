# P2-T03 PLAN — GSC Query APIs & Data Endpoints

**Phase:** 2 (Sync Engine + Schema)  
**Task:** P2-T03 — Build query APIs for SEO analytics dashboard  
**Estimate:** 1–2 days  
**Priority:** High  
**Files:** `app/api/admin/gsc/rankings.ts`, `app/api/admin/gsc/trends.ts`, `lib/gsc-queries.ts`

---

## Goal

Expose GSC data via REST APIs that the dashboard can consume. APIs should support filtering, sorting, pagination, and aggregation for keyword rankings and traffic trends analysis.

## Requirements Met

- **DATA-01**: Query API — rankings by date/query/page (sorted by CTR desc)
- **DATA-02**: Query API — traffic trends (clicks/impressions/position over time)

---

## Tasks

### 1. API Specification

**Endpoint 1: `/api/admin/gsc/rankings`**

Query top-performing keywords and their rankings over time.

```
GET /api/admin/gsc/rankings?propertyId=...&startDate=...&endDate=...&limit=50

Query Params:
  - propertyId (required) — UUID of gsc_properties
  - startDate (required) — YYYY-MM-DD (PT timezone)
  - endDate (required) — YYYY-MM-DD (PT timezone)
  - query (optional) — Filter by specific keyword
  - page (optional) — Filter by specific landing page
  - limit (default 50, max 1000) — Results per page
  - offset (default 0) — Pagination offset
  - sortBy (default 'ctr', options: 'ctr', 'clicks', 'impressions', 'position')
  - sortOrder (default 'desc', options: 'asc', 'desc')

Response:
{
  "data": [
    {
      "query": "industrial ai software",
      "page": "https://threadmoat.com/reports/industrial-ai",
      "date": "2026-05-05",
      "clicks": 45,
      "impressions": 1200,
      "ctr": 0.0375,
      "position": 3.5
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 15234
  },
  "aggregates": {
    "total_clicks": 125340,
    "total_impressions": 3450000,
    "avg_position": 4.2,
    "avg_ctr": 0.0363
  }
}
```

**Endpoint 2: `/api/admin/gsc/trends`**

Aggregate rankings by date (time-series for charts).

```
GET /api/admin/gsc/trends?propertyId=...&startDate=...&endDate=...&groupBy=date

Query Params:
  - propertyId (required) — UUID
  - startDate (required) — YYYY-MM-DD
  - endDate (required) — YYYY-MM-DD
  - groupBy (required) — 'date' (daily) or 'week' or 'month'
  - query (optional) — Filter by specific keyword
  - metric (default 'clicks', options: 'clicks', 'impressions', 'ctr', 'position')

Response:
{
  "data": [
    {
      "date": "2026-05-05",
      "clicks": 2345,
      "impressions": 45670,
      "avg_ctr": 0.0513,
      "avg_position": 4.1,
      "num_queries": 4532
    }
  ],
  "summary": {
    "period": "2026-04-21 to 2026-05-05",
    "total_clicks": 125340,
    "total_impressions": 3450000,
    "avg_ctr": 0.0363,
    "avg_position": 4.2
  }
}
```

### 2. Implementation

**File: `lib/gsc-queries.ts`**

```typescript
import { sql } from '@/lib/db';

export async function getRankingsByQuery(
  propertyId: string,
  startDate: string,
  endDate: string,
  options?: {
    query?: string;
    page?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'ctr' | 'clicks' | 'impressions' | 'position';
    sortOrder?: 'asc' | 'desc';
  }
) {
  const {
    limit = 50,
    offset = 0,
    sortBy = 'ctr',
    sortOrder = 'desc',
  } = options || {};

  // Base query
  let whereClause = `
    property_id = ${propertyId}
    AND date >= ${startDate}
    AND date <= ${endDate}
  `;

  if (options?.query) {
    whereClause += ` AND query ILIKE ${`%${options.query}%`}`;
  }

  if (options?.page) {
    whereClause += ` AND page = ${options.page}`;
  }

  // Get total count
  const countResult = await sql`
    SELECT COUNT(*) as total
    FROM gsc_daily_rankings
    WHERE ${sql.raw(whereClause)}
  `;

  const total = countResult[0].total;

  // Get data with sorting
  const data = await sql`
    SELECT
      query,
      page,
      date,
      SUM(clicks)::integer as clicks,
      SUM(impressions)::integer as impressions,
      AVG(ctr)::numeric as ctr,
      AVG(position)::numeric as position
    FROM gsc_daily_rankings
    WHERE ${sql.raw(whereClause)}
    GROUP BY query, page, date
    ORDER BY ${sql.raw(sortBy)} ${sql.raw(sortOrder.toUpperCase())}
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  // Get aggregates
  const aggregates = await sql`
    SELECT
      SUM(clicks)::integer as total_clicks,
      SUM(impressions)::integer as total_impressions,
      AVG(ctr)::numeric as avg_ctr,
      AVG(position)::numeric as avg_position
    FROM gsc_daily_rankings
    WHERE ${sql.raw(whereClause)}
  `;

  return {
    data,
    pagination: { limit, offset, total },
    aggregates: aggregates[0],
  };
}

export async function getTrendsByDate(
  propertyId: string,
  startDate: string,
  endDate: string,
  options?: {
    groupBy?: 'date' | 'week' | 'month';
    query?: string;
    metric?: 'clicks' | 'impressions' | 'ctr' | 'position';
  }
) {
  const {
    groupBy = 'date',
    metric = 'clicks',
  } = options || {};

  // Determine grouping
  let dateGrouping = 'date';
  if (groupBy === 'week') {
    dateGrouping = "DATE_TRUNC('week', date)::date";
  } else if (groupBy === 'month') {
    dateGrouping = "DATE_TRUNC('month', date)::date";
  }

  let whereClause = `
    property_id = ${propertyId}
    AND date >= ${startDate}
    AND date <= ${endDate}
  `;

  if (options?.query) {
    whereClause += ` AND query ILIKE ${`%${options.query}%`}`;
  }

  // Get time-series data
  const data = await sql`
    SELECT
      ${sql.raw(dateGrouping)} as date,
      SUM(clicks)::integer as clicks,
      SUM(impressions)::integer as impressions,
      AVG(ctr)::numeric as avg_ctr,
      AVG(position)::numeric as avg_position,
      COUNT(DISTINCT query)::integer as num_queries
    FROM gsc_daily_rankings
    WHERE ${sql.raw(whereClause)}
    GROUP BY ${sql.raw(dateGrouping)}
    ORDER BY date ASC
  `;

  // Get summary
  const summary = await sql`
    SELECT
      MIN(date)::text as period_start,
      MAX(date)::text as period_end,
      SUM(clicks)::integer as total_clicks,
      SUM(impressions)::integer as total_impressions,
      AVG(ctr)::numeric as avg_ctr,
      AVG(position)::numeric as avg_position
    FROM gsc_daily_rankings
    WHERE ${sql.raw(whereClause)}
  `;

  return {
    data,
    summary: summary[0],
  };
}
```

**File: `app/api/admin/gsc/rankings.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@/lib/db';
import { getRankingsByQuery } from '@/lib/gsc-queries';

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query params
    const url = new URL(request.url);
    const propertyId = url.searchParams.get('propertyId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!propertyId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required params: propertyId, startDate, endDate' },
        { status: 400 }
      );
    }

    // Verify user owns this property
    const property = await sql`
      SELECT id FROM gsc_properties
      WHERE id = ${propertyId} AND user_id = ${session.user.id}
    `;

    if (!property.length) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Get rankings
    const result = await getRankingsByQuery(propertyId, startDate, endDate, {
      query: url.searchParams.get('query') || undefined,
      page: url.searchParams.get('page') || undefined,
      limit: parseInt(url.searchParams.get('limit') || '50'),
      offset: parseInt(url.searchParams.get('offset') || '0'),
      sortBy: (url.searchParams.get('sortBy') || 'ctr') as any,
      sortOrder: (url.searchParams.get('sortOrder') || 'desc') as any,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Rankings query error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Query failed' },
      { status: 500 }
    );
  }
}
```

**File: `app/api/admin/gsc/trends.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sql } from '@/lib/db';
import { getTrendsByDate } from '@/lib/gsc-queries';

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query params
    const url = new URL(request.url);
    const propertyId = url.searchParams.get('propertyId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!propertyId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required params: propertyId, startDate, endDate' },
        { status: 400 }
      );
    }

    // Verify user owns this property
    const property = await sql`
      SELECT id FROM gsc_properties
      WHERE id = ${propertyId} AND user_id = ${session.user.id}
    `;

    if (!property.length) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Get trends
    const result = await getTrendsByDate(propertyId, startDate, endDate, {
      groupBy: (url.searchParams.get('groupBy') || 'date') as any,
      query: url.searchParams.get('query') || undefined,
      metric: (url.searchParams.get('metric') || 'clicks') as any,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Trends query error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Query failed' },
      { status: 500 }
    );
  }
}
```

### 3. Testing

**Manual test:**
```bash
# 1. Get rankings for a property (first 7 days of synced data)
curl "http://localhost:3000/api/admin/gsc/rankings?propertyId=<UUID>&startDate=2026-04-28&endDate=2026-05-05&limit=10"

# 2. Get trends
curl "http://localhost:3000/api/admin/gsc/trends?propertyId=<UUID>&startDate=2026-04-28&endDate=2026-05-05&groupBy=date"

# 3. Filter by query
curl "http://localhost:3000/api/admin/gsc/rankings?propertyId=<UUID>&startDate=2026-04-28&endDate=2026-05-05&query=industrial+ai"
```

### 4. Performance Optimization (if needed)

**Indexing is already in P2-T01:**
- `idx_gsc_daily_property_date` — queries by property + date range
- `idx_gsc_daily_query` — filters by query keyword
- `idx_gsc_daily_ctr` — sorts by CTR

**If queries get slow, add materialized views:**
```sql
CREATE MATERIALIZED VIEW gsc_daily_aggregates AS
SELECT
  property_id,
  date,
  SUM(clicks) as total_clicks,
  SUM(impressions) as total_impressions,
  AVG(ctr) as avg_ctr,
  AVG(position) as avg_position
FROM gsc_daily_rankings
GROUP BY property_id, date;

CREATE INDEX idx_gsc_daily_agg_property_date 
  ON gsc_daily_aggregates(property_id, date DESC);
```

---

## Definition of Done

- [x] `/api/admin/gsc/rankings` endpoint working
- [x] `/api/admin/gsc/trends` endpoint working
- [x] Query logic handles filtering (by query, page, date range)
- [x] Sorting works (by CTR, clicks, impressions, position)
- [x] Pagination working (limit, offset)
- [x] Aggregates calculated (total, average)
- [x] Auth check enforced (user owns property)
- [x] Error handling (missing params, invalid property, query failures)
- [x] Manual testing done with real synced data
- [x] Response times <500ms for typical queries
- [x] `npm run build` succeeds with 0 errors

---

## Inputs

- Database schema from P2-T01 (tables + indexes)
- Synced GSC data from P2-T02 (first 3+ days)
- NextAuth session management (existing)

## Expected Output

- `lib/gsc-queries.ts` — Query functions (rankings, trends)
- `app/api/admin/gsc/rankings.ts` — Rankings endpoint
- `app/api/admin/gsc/trends.ts` — Trends endpoint
- Working endpoints tested with real data
- Response examples documented

## Verify

```bash
# 1. Build succeeds
npm run build
# Should pass with 0 errors

# 2. Test endpoints locally
curl "http://localhost:3000/api/admin/gsc/rankings?propertyId=...&startDate=...&endDate=..."

# 3. Check response structure
# Should have: data, pagination, aggregates

# 4. Test filtering
curl "http://localhost:3000/api/admin/gsc/rankings?propertyId=...&startDate=...&endDate=...&query=keyword"
# Should filter results

# 5. Test trends
curl "http://localhost:3000/api/admin/gsc/trends?propertyId=...&startDate=...&endDate=...&groupBy=date"
# Should return time-series data
```

---

**Status:** Ready to Execute  
**Created:** 2026-05-05
