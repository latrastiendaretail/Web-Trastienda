-- ─────────────────────────────────────────────────────────────
-- Grants explícitos para la Data API (PostgREST)
--
-- Contexto: a partir del 30 oct 2026, Supabase deja de conceder
-- automáticamente acceso de Data API a tablas nuevas en `public`.
-- Las tablas existentes conservan su grant implícito, pero un
-- `supabase db reset` (o un proyecto/branch nuevo) después de esa
-- fecha vuelve a crear estas tablas desde cero y necesita el GRANT
-- explícito en la propia migración para no quedar bloqueado.
--
-- Alcance: SOLO las tablas de catálogo público (lectura anon vía
-- RLS). Las tablas de datos de usuario (certificates, leads,
-- enrollments, lesson_progress, module_progress, purchases,
-- newsletter_subscribers) se dejan fuera a propósito: 014 las
-- revocó de anon/authenticated deliberadamente (modelo
-- service_role-only). service_role ya tiene acceso total via 012.
-- ─────────────────────────────────────────────────────────────

grant select on categories to anon, authenticated;
grant select on lessons    to anon, authenticated;
grant select on modules    to anon, authenticated;

-- courses ya tiene grant column-restricted en 014 (excluye IDs de Stripe).
