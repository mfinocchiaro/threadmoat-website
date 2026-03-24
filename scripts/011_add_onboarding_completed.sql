-- Add onboarding_completed flag to profiles table
-- Used by the onboarding wizard to track whether user has completed first-visit experience
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
