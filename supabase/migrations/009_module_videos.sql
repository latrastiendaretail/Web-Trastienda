-- ─────────────────────────────────────────────────────────────
-- La Trastienda Campus — Vídeo por módulo + progreso de módulos
-- ─────────────────────────────────────────────────────────────

-- 1. Campo video_url en modules
alter table modules
  add column if not exists video_url text;

-- 2. Tabla module_progress (tracking de vídeos de módulo)
create table if not exists module_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  module_id    uuid not null references modules(id) on delete cascade,
  completed    boolean not null default false,
  completed_at timestamptz,
  unique (user_id, module_id)
);

create index if not exists module_progress_user_module
  on module_progress(user_id, module_id);

alter table module_progress enable row level security;

create policy "users can read own module progress"
  on module_progress for select
  using (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
  );

create policy "enrolled users can insert own module progress"
  on module_progress for insert
  with check (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
    and exists (
      select 1 from enrollments e
      join modules m on m.course_id = e.course_id
      where m.id = module_progress.module_id
        and e.user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

create policy "enrolled users can update own module progress"
  on module_progress for update
  using (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
    and exists (
      select 1 from enrollments e
      join modules m on m.course_id = e.course_id
      where m.id = module_progress.module_id
        and e.user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

-- 3. Actualizar curso "Tus primeros pasos en Retail"
--    — borrar lecciones sin contenido
--    — actualizar descripción y features al spec final
do $$
declare
  v_course_id uuid;
begin
  select id into v_course_id from courses where slug = 'tus-primeros-pasos-en-retail';

  if v_course_id is not null then
    delete from lessons where course_id = v_course_id;

    update courses set
      description = 'Formación práctica de 18 horas para quienes quieren entrar al sector Retail con seguridad, conocimiento real y actitud profesional. Grupo reducido, feedback personalizado y certificado de participación.',
      features = '[
        {"label":"Participación activa","description":"Aprendizaje práctico y dinámico en cada sesión."},
        {"label":"Casos reales","description":"Ejercicios y simulaciones basados en situaciones reales de tienda."},
        {"label":"Feedback personalizado","description":"Atención cercana en grupo reducido de máximo 10 personas."},
        {"label":"Certificado","description":"Certificado de participación al finalizar el curso."}
      ]'::jsonb
    where id = v_course_id;

    -- Los módulos (títulos + descripciones) ya son correctos desde migration 007.
    -- video_url queda NULL en todos — se actualizará cuando estén disponibles las grabaciones.
  end if;
end $$;
