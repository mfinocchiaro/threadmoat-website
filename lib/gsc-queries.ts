/**
 * Google Search Console Query Functions
 * M027 Phase 2: Query APIs for rankings and trends
 */

import { sql } from '@/lib/db';

export interface RankingsOptions {
  query?: string;
  page?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'ctr' | 'clicks' | 'impressions' | 'position';
  sortOrder?: 'asc' | 'desc';
}

export interface TrendsOptions {
  groupBy?: 'date' | 'week' | 'month';
  query?: string;
  metric?: 'clicks' | 'impressions' | 'ctr' | 'position';
}

/**
 * Get rankings by query, page, date
 * Supports filtering, sorting, pagination, and aggregates
 */
export async function getRankingsByQuery(
  propertyId: string,
  startDate: string,
  endDate: string,
  options?: RankingsOptions
) {
  const {
    limit = 50,
    offset = 0,
    sortBy = 'ctr',
    sortOrder = 'desc',
  } = options || {};

  // Validate limit
  const safeLimit = Math.min(Math.max(limit, 1), 1000);
  const safeOffset = Math.max(offset, 0);

  // Build query with filters
  const countResult = await sql`
    SELECT COUNT(*) as total
    FROM gsc_daily_rankings
    WHERE property_id = ${propertyId}
      AND date >= ${startDate}
      AND date <= ${endDate}
      ${options?.query ? sql`AND query ILIKE ${'%' + options.query + '%'}` : sql``}
      ${options?.page ? sql`AND page = ${options.page}` : sql``}
  `;

  const total = (countResult[0] as any)?.total || 0;

  // Get rankings data
  const sortField = sortBy === 'ctr' ? 'avg_ctr' :
                   sortBy === 'position' ? 'avg_position' :
                   sortBy === 'impressions' ? 'total_impressions' :
                   'total_clicks';

  const sortOrder_upper = sortOrder === 'desc' ? 'DESC' : 'ASC';

  const data = (await sql.unsafe(`
    SELECT
      query,
      page,
      date,
      SUM(clicks)::integer as clicks,
      SUM(impressions)::integer as impressions,
      AVG(ctr)::numeric as ctr,
      AVG(position)::numeric as position,
      SUM(clicks)::integer as total_clicks,
      SUM(impressions)::integer as total_impressions,
      AVG(ctr)::numeric as avg_ctr,
      AVG(position)::numeric as avg_position
    FROM gsc_daily_rankings
    WHERE property_id = '${propertyId}'
      AND date >= '${startDate}'
      AND date <= '${endDate}'
      ${options?.query ? `AND query ILIKE '%${options.query.replace(/'/g, "''")}%'` : ''}
      ${options?.page ? `AND page = '${options.page.replace(/'/g, "''")}'` : ''}
    GROUP BY query, page, date
    ORDER BY ${sortField} ${sortOrder_upper}
    LIMIT ${safeLimit}
    OFFSET ${safeOffset}
  `)) as unknown as any[];

  // Get aggregates
  const aggregates = (await sql.unsafe(`
    SELECT
      SUM(clicks)::integer as total_clicks,
      SUM(impressions)::integer as total_impressions,
      AVG(ctr)::numeric as avg_ctr,
      AVG(position)::numeric as avg_position
    FROM gsc_daily_rankings
    WHERE property_id = '${propertyId}'
      AND date >= '${startDate}'
      AND date <= '${endDate}'
      ${options?.query ? `AND query ILIKE '%${options.query.replace(/'/g, "''")}%'` : ''}
      ${options?.page ? `AND page = '${options.page.replace(/'/g, "''")}'` : ''}
  `)) as unknown as Record<string, any>[];

  return {
    data,
    pagination: { limit: safeLimit, offset: safeOffset, total },
    aggregates: aggregates[0] || {
      total_clicks: 0,
      total_impressions: 0,
      avg_ctr: null,
      avg_position: null,
    },
  };
}

/**
 * Get trends by date (time-series for charts)
 * Supports daily, weekly, monthly grouping
 */
export async function getTrendsByDate(
  propertyId: string,
  startDate: string,
  endDate: string,
  options?: TrendsOptions
) {
  const {
    groupBy = 'date',
    metric = 'clicks',
  } = options || {};

  // Determine grouping
  const dateGrouping = groupBy === 'week' ? "DATE_TRUNC('week', date)::date" :
                      groupBy === 'month' ? "DATE_TRUNC('month', date)::date" :
                      'date';

  // Get time-series data
  const data = (await sql.unsafe(`
    SELECT
      ${dateGrouping} as date,
      SUM(clicks)::integer as clicks,
      SUM(impressions)::integer as impressions,
      AVG(ctr)::numeric as avg_ctr,
      AVG(position)::numeric as avg_position,
      COUNT(DISTINCT query)::integer as num_queries
    FROM gsc_daily_rankings
    WHERE property_id = '${propertyId}'
      AND date >= '${startDate}'
      AND date <= '${endDate}'
      ${options?.query ? `AND query ILIKE '%${options.query.replace(/'/g, "''")}%'` : ''}
    GROUP BY ${dateGrouping}
    ORDER BY date ASC
  `)) as unknown as any[];

  // Get summary stats
  const summary = (await sql.unsafe(`
    SELECT
      MIN(date)::text as period_start,
      MAX(date)::text as period_end,
      SUM(clicks)::integer as total_clicks,
      SUM(impressions)::integer as total_impressions,
      AVG(ctr)::numeric as avg_ctr,
      AVG(position)::numeric as avg_position
    FROM gsc_daily_rankings
    WHERE property_id = '${propertyId}'
      AND date >= '${startDate}'
      AND date <= '${endDate}'
      ${options?.query ? `AND query ILIKE '%${options.query.replace(/'/g, "''")}%'` : ''}
  `)) as unknown as Record<string, any>[];

  return {
    data,
    summary: summary[0] || {
      period_start: startDate,
      period_end: endDate,
      total_clicks: 0,
      total_impressions: 0,
      avg_ctr: null,
      avg_position: null,
    },
  };
}
