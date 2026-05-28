-- ─────────────────────────────────────────────────────────────
-- La Trastienda Campus — Metadatos de curso + primer curso oficial
-- ─────────────────────────────────────────────────────────────

-- Nuevos campos en courses
alter table courses
  add column if not exists tagline       text,
  add column if not exists format        text,
  add column if not exists start_date    date,
  add column if not exists max_students  int,
  add column if not exists features      jsonb default '[]'::jsonb;

-- ─────────────────────────────────────────────────────────────
-- Nueva categoría: Iniciación al Retail (order 0 → aparece primera)
-- ─────────────────────────────────────────────────────────────
insert into categories (name, slug, order_index)
values ('Iniciación al Retail', 'iniciacion-al-retail', 0)
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────
-- Curso: Tus Primeros Pasos en Retail
-- ─────────────────────────────────────────────────────────────
insert into courses (
  category_id,
  title,
  slug,
  tagline,
  description,
  duration_minutes,
  status,
  order_index,
  format,
  start_date,
  max_students,
  features
)
select
  c.id,
  'Tus Primeros Pasos en Retail',
  'tus-primeros-pasos-en-retail',
  'Formación práctica para empezar con confianza y profesionalidad en una tienda.',
  'Un programa intensivo de 18 horas para quienes quieren entrar al sector Retail con seguridad, conocimiento real y actitud profesional.',
  1080,
  'coming_soon',
  0,
  'Online · Microsoft Teams',
  '2026-06-01',
  10,
  '[
    {"label":"Participación activa","description":"Aprendizaje práctico y dinámico en cada sesión."},
    {"label":"Casos reales","description":"Situaciones del día a día en tiendas reales."},
    {"label":"Feedback personalizado","description":"Atención cercana en grupo reducido."},
    {"label":"Certificado","description":"Certificado de participación al finalizar el curso."}
  ]'::jsonb
from categories c
where c.slug = 'iniciacion-al-retail'
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 6 bloques de contenido (lecciones)
-- Solo se insertan si el curso existe y no tiene lecciones aún
-- ─────────────────────────────────────────────────────────────
insert into lessons (course_id, title, description, order_index, duration_minutes, is_preview)
select
  co.id,
  t.title,
  t.description,
  t.ord,
  180,
  false
from courses co
cross join (values
  (1, 'Qué significa trabajar en una tienda',
      'Entiende cómo funciona una tienda, sus ritmos, prioridades y qué espera una empresa de ti.'),
  (2, 'Atención al cliente y comunicación',
      'Claves para comunicarte con seguridad, escuchar, asesorar y gestionar situaciones difíciles.'),
  (3, 'Operativa y dinámica de tienda',
      'Reposición, orden, coordinación y gestión de prioridades en el día a día de tienda.'),
  (4, 'Actitud y profesionalidad',
      'La actitud que marca la diferencia: responsabilidad, adaptación, imagen y trabajo en equipo.'),
  (5, 'La realidad del sector Retail',
      'La parte que nadie te cuenta: presión, ritmo, clientes, campañas y cómo afrontarlo de forma realista.'),
  (6, 'CV y entrevistas para Retail',
      'Cómo preparar tu CV, qué buscan las empresas y cómo destacar en entrevistas.')
) as t(ord, title, description)
where co.slug = 'tus-primeros-pasos-en-retail'
  and not exists (
    select 1 from lessons l where l.course_id = co.id
  );
