-- Add session_version to users table for JWT invalidation on password reset
-- Default 0; incremented on password reset to reject stale JWTs
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0;
