-- ─────────────────────────────────────────────────────────────
-- La Trastienda — Tabla de leads (alumnos interesados)
-- ─────────────────────────────────────────────────────────────

create table leads (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  source     text not null default 'inscripcion',
  created_at timestamptz default now(),
  unique (email)
);

create index on leads(created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table leads enable row level security;

-- Anon puede insertar (enviar formulario sin login)
create policy "anon can insert leads"
  on leads for insert
  with check (true);

-- Solo service_role puede leer (Make.com, dashboard admin)
-- No hay policy de select para anon/authenticated → nadie puede leer via anon key
