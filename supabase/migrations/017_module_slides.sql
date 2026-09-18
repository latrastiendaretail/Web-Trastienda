-- ─────────────────────────────────────────────────────────────
-- La Trastienda Campus — Diapositivas por módulo (KPIs y futuros cursos)
-- ─────────────────────────────────────────────────────────────

-- Array ordenado de paths de imagen dentro del bucket privado campus-resources
-- (mismo bucket que los PDF, migración 015). Ej: ["kpi-01/slide-01.png", ...].
-- El progreso de "avanzar diapositivas" reutiliza module_progress (igual que
-- los módulos con vídeo): se marca completed=true al llegar a la última.
alter table modules
  add column if not exists slides jsonb;
