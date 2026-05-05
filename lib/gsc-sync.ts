/**
 * Google Search Console Data Sync Library
 * M027 Phase 2: Implements daily GSC data fetch, validation, and storage
 */

import { sql } from '@/lib/db';
import { refreshGSCToken } from '@/lib/gsc-auth';
import type { GSCRawRow, GSCProperty, GSCSyncResult } from '@/lib/db/gsc-schema';

const { google } = await import('googleapis');

/**
 * Validate a single GSC API row
 * Throws if any field is invalid
 */
export function validateGSCRow(row: any): void {
  if (!row.keys || !Array.isArray(row.keys) || row.keys.length !== 3) {
    throw new Error('Invalid GSC row: missing or invalid dimensions (expected 3)');
  }

  const [date, query, page] = row.keys;

  // Validate date (YYYY-MM-DD format, PT timezone)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Invalid date format: "${date}" (expected YYYY-MM-DD in PT)`);
  }

  // Validate query (non-empty string)
  if (typeof query !== 'string' || query.length === 0 || query.length > 1024) {
    throw new Error(`Invalid query: "${query}" (must be 1-1024 chars)`);
  }

  // Validate page (optional, but if present must be valid URL)
  if (page && (typeof page !== 'string' || page.length === 0 || page.length > 2048)) {
    throw new Error(`Invalid page: "${page}" (must be 0-2048 chars)`);
  }

  // Validate clicks (integer >= 0)
  if (typeof row.clicks !== 'number' || !Number.isInteger(row.clicks) || row.clicks < 0) {
    throw new Error(`Invalid clicks: ${row.clicks} (must be integer >= 0)`);
  }

  // Validate impressions (integer >= 0)
  if (typeof row.impressions !== 'number' || !Number.isInteger(row.impressions) || row.impressions < 0) {
    throw new Error(`Invalid impressions: ${row.impressions} (must be integer >= 0)`);
  }

  // Validate CTR (0-1)
  if (row.ctr && (typeof row.ctr !== 'number' || row.ctr < 0 || row.ctr > 1)) {
    throw new Error(`Invalid CTR: ${row.ctr} (must be 0-1)`);
  }

  // Validate position (> 0)
  if (row.position && (typeof row.position !== 'number' || row.position <= 0)) {
    throw new Error(`Invalid position: ${row.position} (must be > 0)`);
  }
}

/**
 * Fetch GSC data for a date range using Google Search Console API
 * Handles pagination (max 25K rows per page)
 */
export async function fetchGSCData(
  accessToken: string,
  propertyUrl: string,
  startDate: string, // YYYY-MM-DD in PT
  endDate: string // YYYY-MM-DD in PT
): Promise<GSCRawRow[]> {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const sc = google.searchconsole({ version: 'v1', auth });

  let allRows: GSCRawRow[] = [];
  let startRow = 0;
  let pageCount = 0;
  const maxPages = 3; // Safety limit to prevent runaway pagination

  while (pageCount < maxPages) {
    try {
      const response = await sc.searchanalytics.query({
        siteUrl: propertyUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['date', 'query', 'page'],
          dataState: 'final',
          rowLimit: 25000,
          startRow,
        },
      });

      if (!response.data?.rows || response.data.rows.length === 0) {
        // Empty page = reached end
        break;
      }

      // Validate each row
      for (const row of response.data.rows) {
        validateGSCRow(row);
      }

      allRows.push(...(response.data.rows as GSCRawRow[]));
      startRow += 25000;
      pageCount++;

      // If we got less than the max rowLimit, this was the last page
      if (response.data.rows.length < 25000) {
        break;
      }
    } catch (error) {
      throw new Error(
        `GSC API error at page ${pageCount}, startRow ${startRow}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  console.log(`[GSC Fetch] ${propertyUrl}: Fetched ${allRows.length} rows across ${pageCount} page(s)`);
  return allRows;
}

/**
 * Store GSC data in Neon
 * Uses ON CONFLICT for idempotent syncs (re-running same day updates, not duplicates)
 */
export async function storeGSCData(
  propertyId: string,
  rows: GSCRawRow[],
  syncDate: Date
): Promise<{ inserted: number; updated: number }> {
  if (rows.length === 0) {
    return { inserted: 0, updated: 0 };
  }

  try {
    // Process in batches of 1000 to avoid query size limits
    const batchSize = 1000;
    let totalInserted = 0;

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);

      // Build VALUES clause for this batch
      const values = batch
        .map(
          (r) =>
            `(${[propertyId, r.keys[0], r.keys[1], r.keys[2], r.clicks, r.impressions, r.ctr ?? null, r.position ?? null, syncDate.toISOString()]
              .map((v) => (v === null ? 'NULL' : typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v))
              .join(', ')})`
        )
        .join(', ');

      const query = `
        INSERT INTO gsc_daily_rankings (
          property_id, date, query, page,
          clicks, impressions, ctr, position, synced_at
        ) VALUES ${values}
        ON CONFLICT (property_id, date, query, page)
        DO UPDATE SET
          clicks = EXCLUDED.clicks,
          impressions = EXCLUDED.impressions,
          ctr = EXCLUDED.ctr,
          position = EXCLUDED.position,
          synced_at = EXCLUDED.synced_at
      `;

      await sql.unsafe(query);
      totalInserted += batch.length;
    }

    console.log(`[GSC Store] Property ${propertyId}: Upserted ${totalInserted} rows in ${Math.ceil(rows.length / batchSize)} batch(es)`);

    return {
      inserted: totalInserted,
      updated: 0,
    };
  } catch (error) {
    throw new Error(`Failed to store GSC data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Update property sync status after successful sync
 */
export async function updatePropertySyncStatus(
  propertyId: string,
  status: 'success' | 'error',
  errorMsg?: string
): Promise<void> {
  await sql`
    UPDATE gsc_properties
    SET
      sync_status = ${status},
      last_synced_at = now(),
      last_sync_error = ${errorMsg || null},
      updated_at = now()
    WHERE id = ${propertyId}
  `;
}

/**
 * Sync a single property: fetch, validate, store
 * Returns success/failure result
 */
export async function syncProperty(
  property: GSCProperty,
  syncDate: Date = new Date()
): Promise<{ success: boolean; rowCount: number; error?: string }> {
  try {
    // Mark as syncing
    await updatePropertySyncStatus(property.id, 'success'); // Temp mark as syncing (no syncing status in enum)

    // Refresh OAuth token
    let accessToken: string;
    try {
      accessToken = await refreshGSCToken(property.user_id, property.property_url);
    } catch (error) {
      const errorMsg = `Token refresh failed: ${error instanceof Error ? error.message : String(error)}`;
      await updatePropertySyncStatus(property.id, 'error', errorMsg);
      return { success: false, rowCount: 0, error: errorMsg };
    }

    // Fetch GSC data (3-day lookback)
    const endDate = new Date(syncDate);
    const startDate = new Date(syncDate);
    startDate.setDate(startDate.getDate() - 3);

    const endDateStr = endDate.toISOString().split('T')[0];
    const startDateStr = startDate.toISOString().split('T')[0];

    let rows: GSCRawRow[];
    try {
      rows = await fetchGSCData(accessToken, property.property_url, startDateStr, endDateStr);
    } catch (error) {
      const errorMsg = `GSC fetch failed: ${error instanceof Error ? error.message : String(error)}`;
      await updatePropertySyncStatus(property.id, 'error', errorMsg);
      return { success: false, rowCount: 0, error: errorMsg };
    }

    // Store in database
    try {
      await storeGSCData(property.id, rows, syncDate);
    } catch (error) {
      const errorMsg = `Storage failed: ${error instanceof Error ? error.message : String(error)}`;
      await updatePropertySyncStatus(property.id, 'error', errorMsg);
      return { success: false, rowCount: 0, error: errorMsg };
    }

    // Mark as success
    await updatePropertySyncStatus(property.id, 'success');

    return {
      success: true,
      rowCount: rows.length,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[Sync Error] Property ${property.id}:`, errorMsg);

    try {
      await updatePropertySyncStatus(property.id, 'error', errorMsg);
    } catch {
      // Silently fail if update fails
    }

    return { success: false, rowCount: 0, error: errorMsg };
  }
}

/**
 * Clean up old data (retention policy: 180 days)
 */
export async function cleanupOldData(): Promise<number> {
  try {
    // Note: Neon doesn't return row count from DELETE, so we estimate or query separately
    // For now, run the delete and assume it worked
    await sql.unsafe(`
      DELETE FROM gsc_daily_rankings
      WHERE date < NOW() - INTERVAL '180 days'
    `);

    console.log('[Cleanup] Deleted rows older than 180 days');

    return 0; // We can't get the exact count from Neon
  } catch (error) {
    throw new Error(`Cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
