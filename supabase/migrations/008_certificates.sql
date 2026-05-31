-- ─────────────────────────────────────────────────────────────
-- La Trastienda Campus — Tabla certificates
-- ─────────────────────────────────────────────────────────────

create table certificates (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  course_id   uuid references courses(id) on delete cascade,
  code        text unique not null,
  issued_at   timestamptz default now()
);

create index on certificates(user_id);
create index on certificates(user_id, course_id);

alter table certificates enable row level security;

-- Security enforced server-side via Clerk userId; anon client uses user_id filter
create policy "public can read certificates"
  on certificates for select using (true);

create policy "public can insert certificates"
  on certificates for insert with check (true);
