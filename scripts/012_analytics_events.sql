-- ============================================================
-- ThreadMoat — Analytics events table for dashboard usage tracking
-- Lightweight, privacy-respecting event log (no PII beyond user_id)
-- ============================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type  VARCHAR(50) NOT NULL,       -- e.g. 'page_view', 'filter_change', 'shortlist_toggle'
  route       VARCHAR(255) NOT NULL,      -- e.g. '/dashboard/heatmap'
  metadata    JSONB       DEFAULT '{}',   -- optional context (tier, filter values, etc.)
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Query pattern: "which pages does user X visit?" and "page views over time"
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created
  ON analytics_events (user_id, created_at);

-- Query pattern: "how many page_view events this week?" grouped by event_type
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created
  ON analytics_events (event_type, created_at);

-- Query pattern: "most visited routes"
CREATE INDEX IF NOT EXISTS idx_analytics_events_route
  ON analytics_events (route, created_at);
