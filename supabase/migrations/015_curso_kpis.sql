-- ─────────────────────────────────────────────────────────────
-- La Trastienda Campus — Curso de KPIs (7 capítulos)
-- ─────────────────────────────────────────────────────────────

-- 1. Recursos por módulo: PDF del capítulo + clave de herramienta interactiva
alter table modules
  add column if not exists pdf_url  text,
  add column if not exists tool_key text;

-- 2. Bucket privado para PDFs de curso (acceso vía URL firmada, no público)
insert into storage.buckets (id, name, public)
values ('campus-resources', 'campus-resources', false)
on conflict (id) do nothing;

-- Solo el service role gestiona objetos de este bucket (lectura vía signed URL
-- generada en el servidor tras validar matrícula, igual que el resto del campus)
create policy "service role manages campus-resources"
  on storage.objects for all
  using (bucket_id = 'campus-resources')
  with check (bucket_id = 'campus-resources');

-- 3. Categoría
insert into categories (name, slug, order_index)
values ('KPIs y métricas', 'kpis-y-metricas', 5)
on conflict (slug) do nothing;

-- 4. Curso + 7 módulos (uno por KPI)
do $$
declare
  v_course_id uuid;
  v_mod_id    uuid;
begin

  insert into courses (
    category_id, title, slug, tagline, description,
    duration_minutes, status, order_index, format,
    features
  )
  select
    c.id,
    'Curso de KPIs',
    'curso-de-kpis',
    'El manual de KPIs para managers y store managers de retail.',
    'Un capítulo por cada indicador clave: qué mide, cuándo utilizarlo, contra qué compararlo y cómo pasar del dato al diagnóstico. Incluye vídeo, ficha descargable y herramienta interactiva por capítulo.',
    0,
    'coming_soon',
    0,
    'Online · Autoformación',
    '[
      {"label":"Un KPI por capítulo","description":"Ventas, tráfico, conversión, UPT, PMU, margen y más."},
      {"label":"Herramienta interactiva","description":"Ficha de diagnóstico rellenable y descargable en cada capítulo."},
      {"label":"Casos reales","description":"Ejemplos y escenarios de diagnóstico de tienda."}
    ]'::jsonb
  from categories c
  where c.slug = 'kpis-y-metricas'
  on conflict (slug) do nothing;

  select id into v_course_id from courses where slug = 'curso-de-kpis';

  if v_course_id is not null and not exists (
    select 1 from modules where course_id = v_course_id
  ) then

    -- KPI 01 · Ventas (contenido listo)
    insert into modules (course_id, title, description, order_index, is_bonus, tool_key, pdf_url)
    values (v_course_id,
            'KPI 01 · Ventas',
            'La venta es el resultado, no necesariamente la causa. Cómo leerla, contra qué compararla y cómo bajar del dato al diagnóstico.',
            1, false, 'explica-tu-venta', 'kpi-01/manual-kpi-01-ventas.pdf')
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course_id, 'KPI 01 · Ventas (parte 1)', 1, 0, false),
      (v_mod_id, v_course_id, 'KPI 01 · Ventas (parte 2)', 2, 0, false);

    -- KPI 02–07 · placeholders, se completan capítulo a capítulo
    insert into modules (course_id, title, description, order_index, is_bonus)
    values
      (v_course_id, 'KPI 02 · Tráfico',    null, 2, false),
      (v_course_id, 'KPI 03 · Conversión', null, 3, false),
      (v_course_id, 'KPI 04 · Tickets',    null, 4, false),
      (v_course_id, 'KPI 05 · UPT',        null, 5, false),
      (v_course_id, 'KPI 06 · PMU',        null, 6, false),
      (v_course_id, 'KPI 07 · Margen',     null, 7, false);

  end if;

end $$;
