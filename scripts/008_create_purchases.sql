-- One-time purchases (market reports, etc.)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR UNIQUE,
  product_id VARCHAR NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  status VARCHAR NOT NULL DEFAULT 'completed'
    CHECK (status IN ('completed', 'refunded', 'disputed')),
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product_id ON purchases(product_id);
