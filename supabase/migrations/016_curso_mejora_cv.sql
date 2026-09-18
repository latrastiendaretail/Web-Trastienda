-- ─────────────────────────────────────────────────────────────
-- La Trastienda Campus — Curso "Mejora tu CV" (Iniciación al Retail)
-- ─────────────────────────────────────────────────────────────

insert into courses (
  category_id, title, slug, tagline, description,
  duration_minutes, status, order_index, format
)
select
  c.id,
  'Mejora tu CV',
  'mejora-tu-cv',
  'Un CV que abre puertas en retail, capítulo a capítulo.',
  'Cómo construir un currículum que destaque para procesos de selección en retail: estructura, logros medibles, errores frecuentes y cómo adaptarlo a cada oferta.',
  0,
  'draft',
  (select coalesce(max(order_index), 0) + 1 from courses where category_id = c.id),
  'Online · Autoformación'
from categories c
where c.slug = 'iniciacion-al-retail'
on conflict (slug) do nothing;
