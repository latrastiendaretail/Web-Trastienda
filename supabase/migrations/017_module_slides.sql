-- ─────────────────────────────────────────────────────────────
-- La Trastienda Campus — Diapositivas por módulo (KPIs y futuros cursos)
-- ─────────────────────────────────────────────────────────────

-- Array ordenado dentro del bucket privado campus-resources (mismo bucket que
-- los PDF, migración 015). Cada elemento es:
--   - un string: path de imagen, ej. "kpi-01/slide-01.png"
--   - un objeto {"type":"video","url":"https://youtube.com/watch?v=..."}:
--     vídeo de YouTube intercalado entre diapositivas
-- Ej: ["kpi-01/slide-01.png", {"type":"video","url":"..."}, "kpi-01/slide-02.png"]
-- El progreso de "avanzar diapositivas" reutiliza module_progress (igual que
-- los módulos con vídeo): se marca completed=true al llegar a la última.
alter table modules
  add column if not exists slides jsonb;
