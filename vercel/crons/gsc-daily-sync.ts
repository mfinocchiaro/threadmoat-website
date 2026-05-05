/**
 * Google Search Console Daily Sync Cron Job
 * M027 Phase 2: Runs daily at 06:00 UTC (10 PM PT previous day)
 *
 * Fetches GSC data for all active properties, validates, stores, and logs results
 */

import { type VercelRequest, type VercelResponse } from '@vercel/node';
import { sql } from '@/lib/db';
import { syncProperty, cleanupOldData } from '@/lib/gsc-sync';
import { logSyncExecution, sendSyncAlert, formatSyncReport } from '@/lib/gsc-sync-monitor';
import type { GSCProperty, SyncStatus } from '@/lib/db/gsc-schema';

/**
 * Vercel Cron configuration
 * Runs daily at 06:00 UTC (10 PM PT previous day)
 * This timing ensures PT-based data is finalized before syncing
 */
export const config = {
  path: '/api/cron/gsc-daily-sync',
  schedule: '0 6 * * *',
};

/**
 * Main Cron Handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const startTime = Date.now();
  const syncDate = new Date();

  console.log(`[${syncDate.toISOString()}] GSC Daily Sync started`);

  const result = {
    properties_synced: 0,
    properties_failed: 0,
    total_rows: 0,
    errors: [] as string[],
    duration: 0,
    deleted_rows: 0,
  };

  try {
    // 1. Get all properties that are pending or success
    let properties: GSCProperty[] = [];
    try {
      properties = (await sql`
        SELECT * FROM gsc_properties
        WHERE sync_status IN ('pending', 'success')
        ORDER BY last_synced_at ASC NULLS FIRST
        LIMIT 1000
      `) as GSCProperty[];

      console.log(`[Sync] Found ${properties.length} properties to sync`);
    } catch (error) {
      const errorMsg = `Failed to fetch properties: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg);
      result.errors.push(errorMsg);

      return res.status(500).json({
        ok: false,
        error: errorMsg,
        result,
      });
    }

    // 2. Sync each property
    for (const property of properties) {
      try {
        console.log(`[Sync] Starting: ${property.property_url}`);

        const syncResult = await syncProperty(property, syncDate);

        if (syncResult.success) {
          result.properties_synced++;
          result.total_rows += syncResult.rowCount;
          console.log(`✓ ${property.property_url}: ${syncResult.rowCount} rows`);
        } else {
          result.properties_failed++;
          const errorMsg = `${property.property_url}: ${syncResult.error}`;
          result.errors.push(errorMsg);
          console.error(`✗ ${errorMsg}`);
        }
      } catch (error) {
        result.properties_failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.errors.push(`${property.property_url}: ${errorMsg}`);
        console.error(`✗ Unexpected error for ${property.property_url}:`, errorMsg);
      }
    }

    // 3. Data retention: delete rows older than 180 days
    try {
      result.deleted_rows = await cleanupOldData();
    } catch (error) {
      const errorMsg = `Cleanup failed: ${error instanceof Error ? error.message : String(error)}`;
      console.error(errorMsg);
      result.errors.push(errorMsg);
      // Don't fail the sync if cleanup fails
    }

    // 4. Log execution result
    result.duration = Date.now() - startTime;

    try {
      await logSyncExecution(result);
    } catch (error) {
      console.error('Failed to log sync execution:', error);
    }

    // 5. Send alert if there were failures
    if (result.properties_failed > 0) {
      try {
        await sendSyncAlert(
          `${result.properties_failed} properties failed to sync`,
          result.errors,
          {
            synced: result.properties_synced,
            failed: result.properties_failed,
            totalRows: result.total_rows,
            duration: result.duration,
          }
        );
      } catch (error) {
        console.error('Failed to send alert:', error);
      }
    }

    // 6. Return success response
    console.log(`[${new Date().toISOString()}] Sync complete: ${formatSyncReport(result)}`);

    return res.status(200).json({
      ok: true,
      duration: result.duration,
      summary: {
        synced: result.properties_synced,
        failed: result.properties_failed,
        total_rows: result.total_rows,
        deleted_rows: result.deleted_rows,
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    result.duration = Date.now() - startTime;

    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Sync Error] Unexpected error:', errorMsg);

    // Log the failure
    try {
      await logSyncExecution({
        ...result,
        duration: result.duration,
      });
    } catch {
      // Silently fail if logging fails
    }

    return res.status(500).json({
      ok: false,
      error: errorMsg,
      duration: result.duration,
      result,
    });
  }
}
