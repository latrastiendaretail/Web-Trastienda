-- ─────────────────────────────────────────────────────────────
-- La Trastienda — Endurecimiento de seguridad (RLS)
--
-- Contexto: NO existe integración Clerk↔Supabase (el cliente anon
-- nunca envía un JWT con claim `sub`). Todas las políticas RLS que
-- dependían de `current_setting('request.jwt.claims')::json->>'sub'`
-- eran código muerto y daban una falsa sensación de seguridad.
--
-- Modelo definitivo:
--   · Tablas de datos de usuario  → SOLO service_role (bypassa RLS).
--     El acceso va por Server Actions / Server Components que
--     verifican la identidad con Clerk y filtran por user_id.
--   · Tablas de catálogo público  → lectura anon, columnas acotadas.
--
-- La anon key de Supabase es pública por diseño: la seguridad NO
-- puede depender de ocultarla, solo de RLS + grants.
-- ─────────────────────────────────────────────────────────────

-- ── 1. certificates ─────────────────────────────────────────
-- Antes: using(true) / with check(true) → cualquiera con la anon
-- key podía LEER todos los certificados (PII: user_id de Clerk +
-- códigos) e INSERTAR certificados falsos para cualquier usuario.
drop policy if exists "public can read certificates"   on certificates;
drop policy if exists "public can insert certificates" on certificates;
-- Sin políticas → nadie accede vía anon/authenticated. Solo service_role.

-- ── 2. leads ────────────────────────────────────────────────
-- Antes: with check(true) → inserción anónima masiva sin control
-- (el rate-limit vivía solo en la Server Action, evitable yendo
-- directo a PostgREST). Ahora la Server Action usa service_role.
drop policy if exists "anon can insert leads" on leads;
-- Refuerzo a nivel de datos: formato de email y longitud.
alter table leads drop constraint if exists leads_email_format_chk;
alter table leads add constraint leads_email_format_chk
  check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' and char_length(email) <= 254);

-- ── 3. lesson_progress / module_progress ────────────────────
-- Políticas basadas en jwt.sub (muertas). Las escrituras reales
-- van por Server Actions con service_role que verifican matrícula.
drop policy if exists "users can read own progress"              on lesson_progress;
drop policy if exists "users can upsert own progress"            on lesson_progress;
drop policy if exists "users can update own progress"            on lesson_progress;
drop policy if exists "enrolled users can upsert own progress"   on lesson_progress;
drop policy if exists "enrolled users can update own progress"   on lesson_progress;

drop policy if exists "users can read own module progress"          on module_progress;
drop policy if exists "enrolled users can insert own module progress" on module_progress;
drop policy if exists "enrolled users can update own module progress" on module_progress;

-- ── 4. enrollments ─────────────────────────────────────────
-- Las políticas self-service ya se eliminaron en 010. Aseguramos
-- que no queda ninguna lectura/escritura anon.
drop policy if exists "users can read own enrollments"   on enrollments;
drop policy if exists "users can enroll themselves"      on enrollments;
drop policy if exists "users can unenroll themselves"    on enrollments;

-- ── 5. posts ───────────────────────────────────────────────
-- Lectura pública solo de publicados (se mantiene). Escrituras
-- basadas en jwt.sub (muertas + riesgo de apertura a anon) fuera.
drop policy if exists "authenticated can insert posts" on posts;
drop policy if exists "authenticated can update posts" on posts;
drop policy if exists "service role can insert posts"  on posts;
drop policy if exists "service role can update posts"  on posts;
-- service_role (Server Action createPost con requireAdmin) bypassa RLS.

-- ── 6. purchases ───────────────────────────────────────────
-- Política sobre auth.uid() (null para anon → deniega). Se elimina
-- por claridad: el acceso va por service_role tras verificar Clerk.
drop policy if exists "users_read_own_purchases" on purchases;

-- ── 7. RLS activo + revocar todo privilegio de tabla a anon ──
alter table certificates          enable row level security;
alter table leads                 enable row level security;
alter table enrollments           enable row level security;
alter table lesson_progress       enable row level security;
alter table module_progress       enable row level security;
alter table purchases             enable row level security;
alter table newsletter_subscribers enable row level security;

revoke all on certificates          from anon, authenticated;
revoke all on leads                 from anon, authenticated;
revoke all on enrollments           from anon, authenticated;
revoke all on lesson_progress       from anon, authenticated;
revoke all on module_progress       from anon, authenticated;
revoke all on purchases             from anon, authenticated;
revoke all on newsletter_subscribers from anon, authenticated;

-- ── 8. courses: ocultar columnas de Stripe a la anon key ────
-- La política "public can read published courses" no acota columnas.
-- price_cents es público (se muestra en el catálogo); los IDs de
-- Stripe no deben salir del servidor.
revoke select on courses from anon, authenticated;
grant  select (
  id, category_id, title, slug, description, thumbnail_url,
  duration_minutes, status, order_index, created_at, updated_at,
  tagline, format, start_date, max_students, features,
  price_cents, upsell_1to1
) on courses to anon, authenticated;

-- ── 9. newsletter: caducidad del token de confirmación ─────
alter table newsletter_subscribers
  add column if not exists confirm_token_expires_at timestamptz;

-- ── 10. service_role: asegurar acceso total (idempotente) ───
grant all on all tables in schema public to service_role;
