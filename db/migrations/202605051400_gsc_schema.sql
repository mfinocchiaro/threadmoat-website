-- M027 Phase 2: Google Search Console Data Schema
-- Created: 2026-05-05
-- Purpose: Store GSC daily rankings data with proper indexing for analytics queries

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

CREATE INDEX IF NOT EXISTS idx_gsc_properties_user_id ON gsc_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_gsc_properties_status ON gsc_properties(sync_status);

-- Table 2: Daily GSC Rankings (fact table)
-- Date field is Pacific Time (PST/PDT), validated in Phase 1-T02
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

CREATE INDEX IF NOT EXISTS idx_gsc_daily_property_date ON gsc_daily_rankings(property_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_daily_query ON gsc_daily_rankings(query);
CREATE INDEX IF NOT EXISTS idx_gsc_daily_ctr ON gsc_daily_rankings(ctr DESC);
CREATE INDEX IF NOT EXISTS idx_gsc_daily_impressions ON gsc_daily_rankings(impressions DESC);

-- Table 3: Sync Logs (for monitoring and debugging)
CREATE TABLE IF NOT EXISTS gsc_sync_logs (
  id BIGSERIAL PRIMARY KEY,
  synced_at TIMESTAMPTZ DEFAULT now(),
  properties_synced INTEGER DEFAULT 0,
  properties_failed INTEGER DEFAULT 0,
  total_rows INTEGER DEFAULT 0,
  errors JSONB,
  duration INTEGER -- milliseconds
);

CREATE INDEX IF NOT EXISTS idx_gsc_sync_logs_timestamp ON gsc_sync_logs(synced_at DESC);

-- Comments for documentation
COMMENT ON TABLE gsc_properties IS 'GSC properties authorized by users for data sync. One row per user per domain.';
COMMENT ON TABLE gsc_daily_rankings IS 'Daily GSC rankings data per property. Date field is PT timezone (validated in Phase 1-T02).';
COMMENT ON COLUMN gsc_daily_rankings.date IS 'Date in Pacific Time (PST/PDT), not UTC. Covers PT midnight to midnight.';
COMMENT ON TABLE gsc_sync_logs IS 'Logs from daily GSC sync jobs for monitoring and troubleshooting.';
