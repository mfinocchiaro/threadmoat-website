-- Track drip emails sent to trial users to prevent duplicates
CREATE TABLE IF NOT EXISTS drip_emails_sent (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_key   VARCHAR(50) NOT NULL,  -- e.g. 'trial_welcome', 'trial_midpoint', 'trial_ending'
  sent_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, email_key)
);

CREATE INDEX IF NOT EXISTS idx_drip_emails_user ON drip_emails_sent (user_id);
