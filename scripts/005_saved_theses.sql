-- Add saved_theses JSONB column to profiles
-- Stores an array of named thesis configurations:
-- [{ "name": "CFD platform", "scenario": "vc_investor", "thesis": {...}, "createdAt": "..." }, ...]
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS saved_theses JSONB DEFAULT '[]'::jsonb;
