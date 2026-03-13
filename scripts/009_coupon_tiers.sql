-- Migration 009: Add tier-aware coupon fields + FRIENDS coupon
-- Run this on Neon SQL Editor

-- 1. Add product_id column — determines which subscription tier the coupon grants
--    Default 'coupon_trial' preserves behavior for existing coupons (THREADED2026, FREEWEEK)
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS product_id VARCHAR NOT NULL DEFAULT 'coupon_trial';

-- 2. Add grant_status column — what subscription status to create
--    'trialing' for trials, 'active' for full grants (friends, comps)
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS grant_status VARCHAR NOT NULL DEFAULT 'trialing';

-- 3. Seed the FRIENDS coupon
--    - Grants friends_access (Tier 3 / Investor) for 365 days
--    - Status = 'active' (not trialing — it's a real grant)
--    - 25 uses, no expiry
INSERT INTO coupons (code, type, duration_days, max_uses, product_id, grant_status, created_by)
VALUES ('BETTERCALLFINO2026', 'full', 365, 25, 'friends_access', 'active', 'system')
ON CONFLICT (code) DO UPDATE SET
  product_id = EXCLUDED.product_id,
  grant_status = EXCLUDED.grant_status,
  duration_days = EXCLUDED.duration_days,
  max_uses = EXCLUDED.max_uses;
