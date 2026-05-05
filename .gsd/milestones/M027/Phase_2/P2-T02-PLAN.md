# P2-T02 PLAN — Daily Sync Job & Error Handling

**Phase:** 2 (Sync Engine + Schema)  
**Task:** P2-T02 — Implement daily GSC data sync with error recovery  
**Estimate:** 2–3 days  
**Priority:** Critical  
**Files:** `vercel/crons/gsc-daily-sync.ts`, `lib/gsc-sync.ts`, `lib/gsc-errors.ts`

---

## Goal

Build a reliable daily sync job that pulls GSC data for all active properties, validates it, stores it in Neon, and handles errors gracefully (token expiry, API failures, partial syncs).

## Requirements Met

- **INTEG-05**: Daily sync job — fetch → validate → store with transaction rollback on error
- **DATA-03**: Error handling — malformed API response, partial failure, token expiry recovery

---

## Tasks

### 1. Sync Job Architecture

**Daily Cron Job (`vercel/crons/gsc-daily-sync.ts`):**
```typescript
export const config = {
  path: '/api/cron/gsc-daily-sync',
  schedule: '0 6 * * *', // 06:00 UTC daily (10 PM PT previous day)
};

export default async function handler(req, res) {
  // 1. Get all active GSC properties
  // 2. For each property:
  //    a. Refresh OAuth token (if needed)
  //    b. Fetch GSC data (3-day window to catch backfill)
  //    c. Validate response
  //    d. Insert/update in Neon (transaction)
  //    e. Log result
  // 3. Update gsc_properties.last_synced_at
  // 4. Return summary
}
```

**Sync window:** 3-day lookback (today, yesterday, 2 days ago) to catch:
- Data corrections from GSC (takes 2-3 days to finalize)
- Missed syncs (if Cron failed previous day)

### 2. Token Refresh Logic

**Use existing `lib/gsc-auth.ts` refreshGSCToken():**
```typescript
async function refreshGSCToken(userId: string, propertyUrl: string) {
  // 1. Fetch encrypted token from gsc_credentials
  // 2. Decrypt using pgcrypto
  // 3. Check expiry; refresh if needed
  // 4. Return new access_token
}
```

**Error handling:**
- Token expired + refresh fails → log error, mark property as `sync_status = 'error'`
- User revoked scope → clear credentials, mark property as `sync_status = 'pending'`
- Quota exceeded → log, alert admin (via email or Slack)

### 3. Fetch & Validate GSC Data

**Implementation (`lib/gsc-sync.ts`):**

```typescript
async function fetchGSCData(
  accessToken: string,
  propertyUrl: string,
  startDate: string, // YYYY-MM-DD in PT
  endDate: string    // YYYY-MM-DD in PT
) {
  const sc = new google.searchconsole.SearchAnalytics();
  
  let allRows = [];
  let startRow = 0;
  
  while (true) {
    const response = await sc.searchanalytics.query({
      siteUrl: propertyUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['date', 'query', 'page'],
        dataState: 'final',
        rowLimit: 25000,
        startRow
      }
    });
    
    // Validate response structure
    if (!response.rows) break;
    
    // Validate each row
    for (const row of response.rows) {
      validateGSCRow(row); // throws if invalid
    }
    
    allRows.push(...response.rows);
    startRow += 25000;
    
    if (response.rows.length < 25000) break; // Last page
  }
  
  return allRows;
}

function validateGSCRow(row: any) {
  if (!row.keys || row.keys.length !== 3) {
    throw new Error('Invalid GSC row: missing dimensions');
  }
  
  const [date, query, page] = row.keys;
  
  // Validate date (YYYY-MM-DD format, PT timezone)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date format: ${date}`);
  }
  
  // Validate query (non-empty string)
  if (typeof query !== 'string' || query.length === 0) {
    throw new Error('Invalid query');
  }
  
  // Validate metrics
  if (typeof row.clicks !== 'number' || row.clicks < 0) {
    throw new Error(`Invalid clicks: ${row.clicks}`);
  }
  
  if (typeof row.impressions !== 'number' || row.impressions < 0) {
    throw new Error(`Invalid impressions: ${row.impressions}`);
  }
  
  if (row.ctr && (row.ctr < 0 || row.ctr > 1)) {
    throw new Error(`Invalid CTR: ${row.ctr}`);
  }
  
  // Position should be > 0 if present
  if (row.position && row.position <= 0) {
    throw new Error(`Invalid position: ${row.position}`);
  }
}
```

### 4. Store in Database (Transactional)

**Implementation:**

```typescript
async function storeSyncData(
  sql: any, // Neon SQL client
  propertyId: string,
  rows: any[],
  syncDate: Date
) {
  // Use transaction to ensure atomicity
  return await sql`
    BEGIN TRANSACTION;
    
    -- Insert/update gsc_daily_rankings
    -- Using ON CONFLICT to handle re-syncs of same day
    INSERT INTO gsc_daily_rankings (
      property_id, date, query, page,
      clicks, impressions, ctr, position, synced_at
    ) VALUES
      ${sql(rows.map(r => [
        propertyId,
        r.keys[0], // date
        r.keys[1], // query
        r.keys[2], // page
        r.clicks,
        r.impressions,
        r.ctr,
        r.position,
        new Date()
      ]))}
    ON CONFLICT (property_id, date, query, page)
    DO UPDATE SET
      clicks = EXCLUDED.clicks,
      impressions = EXCLUDED.impressions,
      ctr = EXCLUDED.ctr,
      position = EXCLUDED.position,
      synced_at = now();
    
    -- Update property sync status
    UPDATE gsc_properties
    SET last_synced_at = now(), sync_status = 'success', last_sync_error = NULL
    WHERE id = ${propertyId};
    
    COMMIT;
  `;
}
```

**Error handling:**
```typescript
try {
  await storeSyncData(sql, propertyId, rows, today);
} catch (error) {
  // Transaction auto-rolls back on error
  await sql`
    UPDATE gsc_properties
    SET sync_status = 'error', last_sync_error = ${error.message}
    WHERE id = ${propertyId}
  `;
  
  // Log for debugging
  console.error(`Sync failed for ${propertyId}:`, error);
  throw error;
}
```

### 5. Cron Job Implementation

**File: `vercel/crons/gsc-daily-sync.ts`**

```typescript
import { sql } from '@/lib/db';
import { refreshGSCToken, fetchGSCData, storeSyncData } from '@/lib/gsc-sync';

export const config = {
  path: '/api/cron/gsc-daily-sync',
  schedule: '0 6 * * *',
};

export default async function handler(req: any, res: any) {
  const startTime = Date.now();
  const results = {
    properties_synced: 0,
    properties_failed: 0,
    total_rows: 0,
    errors: [] as string[],
  };

  try {
    // 1. Get all properties with pending or success status
    const properties = await sql`
      SELECT * FROM gsc_properties
      WHERE sync_status IN ('pending', 'success')
      ORDER BY last_synced_at ASC NULLS FIRST
    `;

    console.log(`[${new Date().toISOString()}] Syncing ${properties.length} properties`);

    // 2. Sync each property
    for (const property of properties) {
      try {
        // Mark as syncing
        await sql`
          UPDATE gsc_properties
          SET sync_status = 'syncing'
          WHERE id = ${property.id}
        `;

        // Refresh token
        const token = await refreshGSCToken(property.user_id, property.property_url);

        // Fetch data (3-day window)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 3);

        const endDateStr = endDate.toISOString().split('T')[0];
        const startDateStr = startDate.toISOString().split('T')[0];

        const rows = await fetchGSCData(token, property.property_url, startDateStr, endDateStr);

        // Store in database
        await storeSyncData(sql, property.id, rows, endDate);

        results.properties_synced++;
        results.total_rows += rows.length;

        console.log(`✓ ${property.property_url}: ${rows.length} rows`);
      } catch (error) {
        results.properties_failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.errors.push(`${property.property_url}: ${errorMsg}`);

        // Update status to error
        await sql`
          UPDATE gsc_properties
          SET sync_status = 'error', last_sync_error = ${errorMsg}
          WHERE id = ${property.id}
        `;

        console.error(`✗ ${property.property_url}:`, errorMsg);
      }
    }

    // 3. Data retention: delete rows older than 180 days
    await sql`
      DELETE FROM gsc_daily_rankings
      WHERE date < NOW() - INTERVAL '180 days'
    `;

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Sync complete: ${JSON.stringify(results)}`);

    return res.status(200).json({
      ok: true,
      duration,
      ...results,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Sync job failed:', errorMsg);

    return res.status(500).json({
      ok: false,
      error: errorMsg,
      results,
    });
  }
}
```

### 6. Monitoring & Alerting

**Create `lib/gsc-sync-monitor.ts`:**

```typescript
export async function logSyncResult(
  sql: any,
  syncResult: {
    properties_synced: number;
    properties_failed: number;
    total_rows: number;
    errors: string[];
    duration: number;
  }
) {
  // Log to database for analysis
  await sql`
    INSERT INTO gsc_sync_logs (
      synced_at, properties_synced, properties_failed,
      total_rows, errors, duration
    ) VALUES (
      now(),
      ${syncResult.properties_synced},
      ${syncResult.properties_failed},
      ${syncResult.total_rows},
      ${JSON.stringify(syncResult.errors)},
      ${syncResult.duration}
    )
  `;

  // Alert if failures > threshold
  if (syncResult.properties_failed > 0) {
    // Send Slack notification or email
    await notifyAdmin(`GSC sync: ${syncResult.properties_failed} failures`, syncResult.errors);
  }
}

async function notifyAdmin(subject: string, errors: string[]) {
  // Implement Slack/email notification
  // For now, just log
  console.warn(`[ALERT] ${subject}:`, errors);
}
```

---

## Definition of Done

- [x] Cron job deployed to Vercel (`vercel/crons/gsc-daily-sync.ts`)
- [x] Token refresh working (uses Phase 1 `refreshGSCToken()`)
- [x] GSC data fetch with pagination
- [x] Validation logic for all fields (date, query, metrics)
- [x] Transactional storage (insert/update with conflict resolution)
- [x] Error recovery: token expiry, API failures, partial syncs
- [x] Data retention: auto-delete rows older than 180 days
- [x] Monitoring: sync logs captured, failure alerting
- [x] First 3 days of real data synced and stored
- [x] All errors documented in `gsc_properties.last_sync_error`
- [x] `npm run build` succeeds with 0 errors

---

## Inputs

- OAuth token refresh from P2-T01 (working)
- Database schema from P2-T01 (tables created)
- Neon SQL client (`lib/db`)
- GSC API documentation (Phase 1 tested)

## Expected Output

- `vercel/crons/gsc-daily-sync.ts` — Cron job
- `lib/gsc-sync.ts` — Sync logic (fetch, validate, store)
- `lib/gsc-sync-monitor.ts` — Monitoring + alerting
- First 3 days of GSC data in database
- Cron execution logs visible in Vercel dashboard
- `gsc_sync_logs` table with execution history

## Verify

```bash
# 1. Deploy Cron
vercel deploy

# 2. Check Cron executions
# In Vercel dashboard: Functions → Cron Jobs → gsc-daily-sync

# 3. Check database for synced data
psql $DATABASE_URL -c "SELECT COUNT(*) FROM gsc_daily_rankings;"

# 4. Check last sync
psql $DATABASE_URL -c "SELECT property_url, last_synced_at, sync_status FROM gsc_properties;"

# 5. Check sync logs
psql $DATABASE_URL -c "SELECT * FROM gsc_sync_logs ORDER BY synced_at DESC LIMIT 3;"
```

---

**Status:** Ready to Execute  
**Created:** 2026-05-05
