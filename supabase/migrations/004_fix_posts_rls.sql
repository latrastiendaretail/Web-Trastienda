-- ─────────────────────────────────────────────────────────────
-- Fix: posts RLS policies
--
-- Las políticas originales usaban `with check (true)` / `using (true)`
-- lo que permitía INSERT/UPDATE a cualquier usuario anon.
-- service_role bypasses RLS de todas formas (Make.com).
-- Los admins autenticados con Clerk pasan JWT con claim `sub`.
-- ─────────────────────────────────────────────────────────────

-- Eliminar políticas abiertas
drop policy if exists "service role can insert posts" on posts;
drop policy if exists "service role can update posts" on posts;
drop policy if exists "authenticated can insert posts" on posts;
drop policy if exists "authenticated can update posts" on posts;

-- Solo usuarios autenticados (Clerk JWT con sub) pueden insertar/actualizar
create policy "authenticated can insert posts"
  on posts for insert
  with check (
    current_setting('request.jwt.claims', true)::json->>'sub' is not null
  );

create policy "authenticated can update posts"
  on posts for update
  using (
    current_setting('request.jwt.claims', true)::json->>'sub' is not null
  );
