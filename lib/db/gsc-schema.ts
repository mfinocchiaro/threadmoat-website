/**
 * Google Search Console (GSC) Data Schema Types
 * Used in M027 Phase 2: Search Indexing & Analytics
 */

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
  date: Date; // PT timezone (validated Phase 1-T02)
  query: string;
  page: string | null;
  clicks: number;
  impressions: number;
  ctr: number; // 0-1
  position: number;
  synced_at: Date;
}

export interface GSCSyncLog {
  id: number;
  synced_at: Date;
  properties_synced: number;
  properties_failed: number;
  total_rows: number;
  errors: Record<string, unknown> | null;
  duration: number; // milliseconds
}

export interface GSCRawRow {
  keys: [string, string, string]; // [date, query, page]
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCSyncResult {
  property_id: string;
  rows_inserted: number;
  rows_updated: number;
  sync_started_at: Date;
  sync_completed_at: Date;
  error: string | null;
}

export interface GSCQueryOptions {
  query?: string;
  page?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'ctr' | 'clicks' | 'impressions' | 'position';
  sortOrder?: 'asc' | 'desc';
}

export interface GSCRankingsResponse {
  data: Array<{
    query: string;
    page: string | null;
    date: string; // YYYY-MM-DD
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  aggregates: {
    total_clicks: number;
    total_impressions: number;
    avg_ctr: number;
    avg_position: number;
  };
}

export interface GSCTrendsResponse {
  data: Array<{
    date: string; // YYYY-MM-DD
    clicks: number;
    impressions: number;
    avg_ctr: number;
    avg_position: number;
    num_queries: number;
  }>;
  summary: {
    period_start: string;
    period_end: string;
    total_clicks: number;
    total_impressions: number;
    avg_ctr: number;
    avg_position: number;
  };
}

export type SyncStatus = 'pending' | 'syncing' | 'success' | 'error';
export type SortBy = 'ctr' | 'clicks' | 'impressions' | 'position';
export type SortOrder = 'asc' | 'desc';
export type GroupBy = 'date' | 'week' | 'month';
export type Metric = 'clicks' | 'impressions' | 'ctr' | 'position';
