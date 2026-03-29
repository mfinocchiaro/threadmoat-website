-- Migration 007: Store invite_code on users for deferred coupon redemption
-- Coupon is now redeemed AFTER email verification, not at registration time.
-- Run this on Neon SQL Editor before deploying the corresponding code changes.

ALTER TABLE users ADD COLUMN IF NOT EXISTS invite_code TEXT;
