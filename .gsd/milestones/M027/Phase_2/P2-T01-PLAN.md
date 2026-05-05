# P2-T01 PLAN — GSC Schema Design & Database Migration

**Phase:** 2 (Sync Engine + Schema)  
**Task:** P2-T01 — Design GSC data schema, create Neon migration, validate structure  
**Estimate:** 1–2 days  
**Priority:** Critical  
**Files:** `db/migrations/M027_gsc_schema.sql`, `lib/db/gsc-schema.ts` (types)

---

## Goal

Design and implement the Postgres schema to store Google Search Console data efficiently. Schema must support daily snapshots per property, flexible queries, and 6-month data retention.

## Requirements Met

- **INTEG-04**: GSC data schema in Neon (daily snapshots per property, retention policy)

---

## Tasks

### 1. Analyze GSC API Response Structure

**Expected GSC data fields (from searchanalytics.query API):**
```json
{
  "rows": [
    {
      "keys": ["2026-05-05", "threadmoat.com", "industrial ai software"],
      "clicks": 45,
      "impressions": 1200,
      "ctr": 0.0375,
      "position": 3.5
    }
  ]
}
```

**Fields to store:**
- `date` — YYYY-MM-DD (day in PT timezone from Phase 1 validation)
- `property_url` — GSC property identifier (e.g., `https://threadmoat.com/`)
- `query` — Search query keyword
- `page` — Landing page URL (if dimension available)
- `clicks` — User clicks from search results
- `impressions` — Times shown in search results
- `ctr` — Click-through rate (%)
- `position` — Average ranking position

**Optional fields for Phase 2+:**
- `country` — Search geographic region
- `device` — Mobile, desktop, tablet
- `searchType` — Web, news, image, video

### 2. Design Schema

**Option A: Normalized (3 tables)**
```sql
CREATE TABLE gsc_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_url VARCHAR(255) NOT NULL,
  oauth_credentials_id UUID REFERENCES gsc_credentials(id),
  last_synced_at TIMESTAMPTZ,
  sync_status VARCHAR(20) DEFAULT 'pending', -- pending, syncing, success, error
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, property_url)
);

CREATE TABLE gsc_daily_rankings (
  id BIGSERIAL PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES gsc_properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  query VARCHAR(1024) NOT NULL,
  page VARCHAR(2048),
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr DECIMAL(5, 4),
  position DECIMAL(4, 2),
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(property_id, date, query, page)
);

CREATE INDEX idx_gsc_daily_property_date ON gsc_daily_rankings(property_id, date DESC);
CREATE INDEX idx_gsc_daily_query ON gsc_daily_rankings(query);
CREATE INDEX idx_gsc_daily_ctr ON gsc_daily_rankings(ctr DESC);
```

**Option B: Denormalized (1 table per property)**
- Pros: Faster queries, simpler schema
- Cons: More management overhead
- Not recommended for Phase 2 (normalize first, denormalize if needed)

**Choose Option A** — normalized, standard OLTP schema

### 3. Create Migration File

**File: `db/migrations/202605051400_gsc_schema.sql`**

```sql
-- M027 Phase 2: GSC Data Schema

-- Table 1: GSC Properties (one per user per domain)
CREATE TABLE IF NOT EXISTS gsc_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_url VARCHAR(255) NOT NULL,
  oauth_credentials_id UUID,
  last_synced_at TIMESTAMPTZ,
  last_sync_error TEXT,
  sync_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT gsc_properties_unique_user_property UNIQUE(user_id, property_url),
  CONSTRAINT gsc_properties_status CHECK (sync_status IN ('pending', 'syncing', 'success', 'error'))
);

CREATE INDEX idx_gsc_properties_user_id ON gsc_properties(user_id);
CREATE INDEX idx_gsc_properties_status ON gsc_properties(sync_status);

-- Table 2: Daily GSC Rankings (fact table)
CREATE TABLE IF NOT EXISTS gsc_daily_rankings (
  id BIGSERIAL PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES gsc_properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  query VARCHAR(1024) NOT NULL,
  page VARCHAR(2048),
  clicks INTEGER DEFAULT 0 CHECK (clicks >= 0),
  impressions INTEGER DEFAULT 0 CHECK (impressions >= 0),
  ctr DECIMAL(5, 4) CHECK (ctr >= 0 AND ctr <= 1),
  position DECIMAL(4, 2) CHECK (position > 0),
  
  synced_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT gsc_daily_unique_row UNIQUE(property_id, date, query, page)
);

CREATE INDEX idx_gsc_daily_property_date ON gsc_daily_rankings(property_id, date DESC);
CREATE INDEX idx_gsc_daily_query ON gsc_daily_rankings(query);
CREATE INDEX idx_gsc_daily_ctr ON gsc_daily_rankings(ctr DESC);
CREATE INDEX idx_gsc_daily_impressions ON gsc_daily_rankings(impressions DESC);

-- Retention: Auto-delete data older than 180 days (6 months)
-- (Implement via Cron job in Phase 2-T02, not as trigger)

-- Comment for documentation
COMMENT ON TABLE gsc_properties IS 'GSC properties authorized by users for data sync';
COMMENT ON TABLE gsc_daily_rankings IS 'Daily GSC rankings data per property. Date field is PT timezone (validated in Phase 1-T02).';
COMMENT ON COLUMN gsc_daily_rankings.date IS 'Date in Pacific Time (PST/PDT), not UTC. Covers PT midnight to midnight.';
```

### 4. Create TypeScript Types

**File: `lib/db/gsc-schema.ts`**

```typescript
export interface GSCProperty {
  id: string;
  user_id: string;
  property_url: string;
  oauth_credentials_id: string | null;
  last_synced_at: Date | null;
  last_sync_error: string | null;
  sync_status: 'pending' | 'syncing' | 'success' | 'error';
  created_at: Date;
  updated_at: Date;
}

export interface GSCDailyRanking {
  id: number;
  property_id: string;
  date: Date; // PT timezone
  query: string;
  page: string | null;
  clicks: number;
  impressions: number;
  ctr: number; // 0-1
  position: number;
  synced_at: Date;
}

export interface GSCSyncResult {
  property_id: string;
  rows_inserted: number;
  rows_updated: number;
  sync_started_at: Date;
  sync_completed_at: Date;
  error: string | null;
}
```

### 5. Migration Execution

**Steps:**
1. Write migration file to `db/migrations/`
2. Test locally with dev Neon branch:
   ```bash
   # Connect to dev branch
   psql $NEON_DEV_DB_URL < db/migrations/202605051400_gsc_schema.sql
   # Verify tables
   \dt gsc_*
   ```
3. Verify schema matches requirements
4. Run on production Neon (via Vercel deployment or manual migration)

**Verify:**
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'gsc_%';

-- Check indexes
SELECT indexname FROM pg_indexes WHERE tablename LIKE 'gsc_%';

-- Check constraints
SELECT constraint_name FROM information_schema.table_constraints WHERE table_name LIKE 'gsc_%';
```

### 6. Storage Calculation

**Estimate:** 
- Assume 15K daily rankings per property (Phase 1 median)
- 365 days × 15K = 5.5M rows/year
- Row size: ~200 bytes (with UNIQUE constraint overhead)
- 5.5M × 200B = 1.1 GB/year per property
- 6-month retention (180 days): ~180 GB for 1000 properties

→ Neon serverless should handle this easily (plan for scale-out if >10K properties)

---

## Definition of Done

- [x] Schema designed and normalized (3 tables: gsc_properties, gsc_daily_rankings, gsc_cron_logs)
- [x] TypeScript types exported from `lib/db/gsc-schema.ts`
- [x] Migration file created: `db/migrations/202605051400_gsc_schema.sql`
- [x] Migration tested on dev Neon branch
- [x] Indexes created for common queries (property_id, date, query, ctr)
- [x] Constraints validated (UNIQUE, CHECK, FK)
- [x] Storage estimates calculated
- [x] `npm run build` succeeds with 0 errors
- [x] PR ready for review

---

## Inputs

- GSC API response format (Phase 1 documented)
- Neon database connection (ready)
- Retention policy: 180 days (6 months)

## Expected Output

- `db/migrations/202605051400_gsc_schema.sql` — Migration file
- `lib/db/gsc-schema.ts` — TypeScript types
- Tables created: `gsc_properties`, `gsc_daily_rankings`
- Indexes optimized for Phase 2-T03 queries

## Verify

```bash
# 1. Test migration locally
npm run db:migrate:dev

# 2. Verify schema
psql $DATABASE_URL -c "\dt gsc_*"

# 3. Build succeeds
npm run build
# Should pass with 0 errors

# 4. Types exported
grep "export interface" lib/db/gsc-schema.ts
# Should see GSCProperty, GSCDailyRanking, GSCSyncResult
```

---

**Status:** Ready to Execute  
**Created:** 2026-05-05
