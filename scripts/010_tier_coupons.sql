-- ThreadMoat Tier Coupons
-- Run in Neon to set up the Recon / Forge / Red Keep coupon system
--
-- Tier mapping:
--   Recon (free)     → product_id: explorer_trial (auto on signup)
--   The Forge (paid) → product_id: forge_annual
--   The Red Keep     → product_id: red_keep_annual

-- Forge coupon (365 days, up to 25 uses)
INSERT INTO coupons (code, type, duration_days, max_uses, product_id, grant_status, created_by)
VALUES ('FORGE2026', 'full', 365, 25, 'forge_annual', 'active', 'system')
ON CONFLICT (code) DO NOTHING;

-- Red Keep coupon (365 days, up to 10 uses)
INSERT INTO coupons (code, type, duration_days, max_uses, product_id, grant_status, created_by)
VALUES ('REDKEEP2026', 'full', 365, 10, 'red_keep_annual', 'active', 'system')
ON CONFLICT (code) DO NOTHING;

-- Existing coupons still work:
--   BETTERCALLFINO2026 → friends_access → maps to Forge tier
--   THREADED2026       → coupon_trial   → maps to Recon tier
--   FREEWEEK           → coupon_trial   → maps to Recon tier
