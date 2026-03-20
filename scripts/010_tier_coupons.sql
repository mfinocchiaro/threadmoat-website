-- ThreadMoat Tier Coupons — Rotatable Aliases
-- Run in Neon to set up the Recon / Forge / Red Keep coupon system
--
-- Strategy: Multiple codes per tier with low max_uses.
-- When a code leaks or fills up, stop sharing it and use the next one.
-- Old codes auto-stop working when max_uses is reached.
-- Add expires_at for time-limited codes.
--
-- Tier mapping:
--   Recon (free)     → product_id: explorer_trial (auto on signup)
--   The Forge (paid) → product_id: forge_annual
--   The Red Keep     → product_id: red_keep_annual

-- ═══════════════════════════════════════════════════
-- THE FORGE — rotatable codes (3 uses each)
-- ═══════════════════════════════════════════════════

INSERT INTO coupons (code, type, duration_days, max_uses, product_id, grant_status, created_by)
VALUES
  ('FORGE2026',       'full', 365, 3, 'forge_annual', 'active', 'system'),
  ('FORGEALPHA',      'full', 365, 3, 'forge_annual', 'active', 'system'),
  ('FORGEBRAVO',      'full', 365, 3, 'forge_annual', 'active', 'system'),
  ('FORGECHARLIE',    'full', 365, 3, 'forge_annual', 'active', 'system'),
  ('FORGEDELTA',      'full', 365, 3, 'forge_annual', 'active', 'system'),
  ('THREADFORGE',     'full', 365, 3, 'forge_annual', 'active', 'system'),
  ('BUILDTHETHREAD',  'full', 365, 3, 'forge_annual', 'active', 'system'),
  ('INDUSTRIALAI',    'full', 365, 3, 'forge_annual', 'active', 'system'),
  ('MOATACCESS',      'full', 365, 3, 'forge_annual', 'active', 'system'),
  ('PLMINTEL',        'full', 365, 3, 'forge_annual', 'active', 'system')
ON CONFLICT (code) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- THE RED KEEP — rotatable codes (2 uses each)
-- ═══════════════════════════════════════════════════

INSERT INTO coupons (code, type, duration_days, max_uses, product_id, grant_status, created_by)
VALUES
  ('REDKEEP2026',     'full', 365, 2, 'red_keep_annual', 'active', 'system'),
  ('KEEPALPHA',       'full', 365, 2, 'red_keep_annual', 'active', 'system'),
  ('KEEPBRAVO',       'full', 365, 2, 'red_keep_annual', 'active', 'system'),
  ('KEEPCHARLIE',     'full', 365, 2, 'red_keep_annual', 'active', 'system'),
  ('INNERSANCTUM',    'full', 365, 2, 'red_keep_annual', 'active', 'system'),
  ('FULLCOMMAND',     'full', 365, 2, 'red_keep_annual', 'active', 'system'),
  ('THRONEROOM',      'full', 365, 2, 'red_keep_annual', 'active', 'system'),
  ('DEEPINTEL',       'full', 365, 2, 'red_keep_annual', 'active', 'system'),
  ('CITADEL2026',     'full', 365, 2, 'red_keep_annual', 'active', 'system'),
  ('IRONTHRONE',      'full', 365, 2, 'red_keep_annual', 'active', 'system')
ON CONFLICT (code) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- USAGE NOTES
-- ═══════════════════════════════════════════════════
--
-- Each code allows 2-3 redemptions. Give one code per prospect/meeting.
-- If a code leaks, it can only be used 2-3 times before it's exhausted.
--
-- To check usage:
--   SELECT code, product_id, used_count, max_uses FROM coupons ORDER BY product_id, code;
--
-- To add more codes on the fly:
--   INSERT INTO coupons (code, type, duration_days, max_uses, product_id, grant_status, created_by)
--   VALUES ('NEWCODE', 'full', 365, 3, 'forge_annual', 'active', 'system');
--
-- To retire a leaked code (set max_uses = used_count):
--   UPDATE coupons SET max_uses = used_count WHERE code = 'LEAKED_CODE';
--
-- To create time-limited codes (e.g. for a conference):
--   INSERT INTO coupons (code, type, duration_days, max_uses, product_id, grant_status, created_by, expires_at)
--   VALUES ('CONF2026', 'full', 90, 50, 'forge_annual', 'active', 'system', '2026-04-15');
--
-- Existing codes still work:
--   BETTERCALLFINO2026 → friends_access → maps to Forge tier
--   THREADED2026       → coupon_trial   → maps to Recon tier
