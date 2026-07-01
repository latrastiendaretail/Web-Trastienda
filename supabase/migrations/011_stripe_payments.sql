-- Stripe payment columns on courses
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS price_cents      INT,
  ADD COLUMN IF NOT EXISTS stripe_product_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_price_id   TEXT;

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   TEXT NOT NULL,
  course_id                 UUID NOT NULL REFERENCES courses(id),
  stripe_session_id         TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id  TEXT,
  amount_cents              INT  NOT NULL,
  currency                  TEXT NOT NULL DEFAULT 'eur',
  status                    TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded')),
  customer_email            TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: only service_role writes; users can read their own
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_purchases"
  ON purchases FOR SELECT
  USING (user_id = auth.uid()::text);
