/**
 * Google Search Console Sync Monitoring & Alerting
 * M027 Phase 2: Logs sync executions and sends alerts on failures
 */

import { sql } from '@/lib/db';
import type { GSCSyncLog } from '@/lib/db/gsc-schema';

export interface SyncExecutionResult {
  properties_synced: number;
  properties_failed: number;
  total_rows: number;
  errors: string[];
  duration: number; // milliseconds
  deleted_rows?: number;
}

/**
 * Log sync execution result to database
 */
export async function logSyncExecution(result: SyncExecutionResult): Promise<void> {
  try {
    await sql`
      INSERT INTO gsc_sync_logs (
        synced_at, properties_synced, properties_failed,
        total_rows, errors, duration
      ) VALUES (
        now(),
        ${result.properties_synced},
        ${result.properties_failed},
        ${result.total_rows},
        ${JSON.stringify(result.errors)},
        ${result.duration}
      )
    `;

    console.log(`[Sync Log] Execution logged: ${result.properties_synced} synced, ${result.properties_failed} failed`);
  } catch (error) {
    console.error('[Sync Log Error]', error);
    // Don't throw — logging failure shouldn't block sync
  }
}

/**
 * Send admin alert for sync failures
 */
export async function sendSyncAlert(
  subject: string,
  errors: string[],
  stats: { synced: number; failed: number; totalRows: number; duration: number }
): Promise<void> {
  const errorList = errors.slice(0, 10).join('\n  - '); // Limit to first 10 errors

  const message = `
[GSC Sync Alert]
${subject}

Stats:
  Synced: ${stats.synced}
  Failed: ${stats.failed}
  Total Rows: ${stats.totalRows}
  Duration: ${(stats.duration / 1000).toFixed(2)}s

Errors:
  - ${errorList}
${errors.length > 10 ? `  ... and ${errors.length - 10} more` : ''}
`;

  console.warn(message);

  // TODO: Integrate with Slack/email notification service
  // For now, just log to console and database
}

/**
 * Get recent sync execution logs
 */
export async function getRecentSyncLogs(limit: number = 7): Promise<GSCSyncLog[]> {
  const logs = await sql`
    SELECT * FROM gsc_sync_logs
    ORDER BY synced_at DESC
    LIMIT ${limit}
  `;

  return logs as GSCSyncLog[];
}

/**
 * Get sync statistics for a date range
 */
export async function getSyncStats(daysBack: number = 7): Promise<{
  total_syncs: number;
  successful_syncs: number;
  failed_syncs: number;
  total_rows: number;
  avg_duration_ms: number;
  error_rate: number;
}> {
  const result = await sql`
    SELECT
      COUNT(*) as total_syncs,
      SUM(CASE WHEN properties_failed = 0 THEN 1 ELSE 0 END)::int as successful_syncs,
      SUM(CASE WHEN properties_failed > 0 THEN 1 ELSE 0 END)::int as failed_syncs,
      SUM(total_rows)::int as total_rows,
      AVG(duration)::int as avg_duration_ms
    FROM gsc_sync_logs
    WHERE synced_at > NOW() - INTERVAL '${daysBack} days'
  `;

  if (!result[0]) {
    return {
      total_syncs: 0,
      successful_syncs: 0,
      failed_syncs: 0,
      total_rows: 0,
      avg_duration_ms: 0,
      error_rate: 0,
    };
  }

  const stats = result[0];
  const errorRate = stats.total_syncs > 0 ? (stats.failed_syncs / stats.total_syncs) * 100 : 0;

  return {
    total_syncs: stats.total_syncs || 0,
    successful_syncs: stats.successful_syncs || 0,
    failed_syncs: stats.failed_syncs || 0,
    total_rows: stats.total_rows || 0,
    avg_duration_ms: stats.avg_duration_ms || 0,
    error_rate: Math.round(errorRate * 100) / 100,
  };
}

/**
 * Format sync result for Slack/email notification
 */
export function formatSyncReport(result: SyncExecutionResult): string {
  return `
GSC Daily Sync Report
━━━━━━━━━━━━━━━━━━━━

✅ Synced: ${result.properties_synced}
❌ Failed: ${result.properties_failed}
📊 Total Rows: ${result.total_rows}
⏱️  Duration: ${(result.duration / 1000).toFixed(2)}s

${result.deleted_rows ? `🗑️  Deleted (retention): ${result.deleted_rows} rows` : ''}

${result.errors.length > 0 ? `⚠️  Errors:\n${result.errors.slice(0, 5).map((e) => `  • ${e}`).join('\n')}` : ''}

Status: ${result.properties_failed === 0 ? '✅ All properties synced successfully' : '⚠️  Some properties failed to sync'}
  `.trim();
}
