-- ─────────────────────────────────────────────────────────────
-- Admin RLS: enrollment management is admin-only
--
-- The anon key (used by createServerClient) does not inject a
-- Clerk JWT, so the existing self-enroll policy was already
-- non-functional. This makes the intent explicit: only the
-- service_role (used by admin server actions) can write enrollments.
-- service_role bypasses RLS automatically in Supabase.
-- ─────────────────────────────────────────────────────────────

drop policy if exists "users can enroll themselves" on enrollments;
drop policy if exists "users can unenroll themselves" on enrollments;
