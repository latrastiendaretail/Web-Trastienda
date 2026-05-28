-- ─────────────────────────────────────────────────────────────
-- La Trastienda Blog — Posts desde LinkedIn
-- ─────────────────────────────────────────────────────────────

create table posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  content       text not null,
  excerpt       text,                    -- primeras líneas, para cards en /blog
  linkedin_url  text,                    -- link al post original
  cover_image   text,                    -- URL imagen (opcional)
  status        text not null default 'draft'
                check (status in ('draft', 'published')),
  published_at  timestamptz,            -- se rellena al publicar
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- Índices
-- ─────────────────────────────────────────────────────────────
create index on posts(published_at desc);
create index on posts(slug);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security — posts son públicos (SEO)
-- ─────────────────────────────────────────────────────────────
alter table posts enable row level security;

create policy "public can read posts"
  on posts for select using (status = 'published');

-- Solo service_role puede insertar/actualizar (Make.com usa service key)
create policy "service role can insert posts"
  on posts for insert
  with check (true);

create policy "service role can update posts"
  on posts for update
  using (true);

-- ─────────────────────────────────────────────────────────────
-- Grants
-- ─────────────────────────────────────────────────────────────
grant select on posts to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- Auto-update updated_at
-- ─────────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();
