-- Add wizard_completed_at to profiles table
-- Tracks when user completes the filter hierarchy onboarding wizard

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wizard_completed_at TIMESTAMPTZ;

-- Create index for faster lookups of users who haven't completed wizard
CREATE INDEX IF NOT EXISTS idx_profiles_wizard_completed_at ON profiles(wizard_completed_at);
