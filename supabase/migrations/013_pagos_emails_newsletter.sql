-- ─────────────────────────────────────────────────────────────
-- La Trastienda — Automatización post-compra:
--   · dedupe de emails transaccionales
--   · marca de curso con upsell 1:1 (KPIs)
--   · newsletter con doble opt-in y prueba de consentimiento
-- ─────────────────────────────────────────────────────────────

-- Curso con sesión 1:1 de acompañamiento (curso KPIs)
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS upsell_1to1 BOOLEAN NOT NULL DEFAULT FALSE;

-- Sellos de envío para no repetir correos en reintentos de webhook / cron
ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS access_email_sent_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS kpi_1to1_email_sent_at TIMESTAMPTZ;

-- ─────────────────────────────────────────────────────────────
-- Newsletter — suscriptores con doble opt-in
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT NOT NULL UNIQUE,
  status            TEXT NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending', 'subscribed', 'unsubscribed')),
  -- Prueba de consentimiento (art. 7 RGPD): qué aceptó, dónde y cuándo
  consent_source    TEXT NOT NULL DEFAULT 'checkout',
  consent_text      TEXT NOT NULL,
  consent_ip        TEXT,
  stripe_session_id TEXT,
  -- Tokens de un solo uso para confirmar / darse de baja sin login
  confirm_token     UUID NOT NULL DEFAULT gen_random_uuid(),
  unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
  confirmed_at      TIMESTAMPTZ,
  unsubscribed_at   TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_confirm_token_idx
  ON newsletter_subscribers (confirm_token);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_unsubscribe_token_idx
  ON newsletter_subscribers (unsubscribe_token);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx
  ON newsletter_subscribers (status);

-- RLS: nadie accede vía anon/authenticated. Solo service_role (que salta RLS).
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
