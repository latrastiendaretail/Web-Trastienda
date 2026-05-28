-- ─────────────────────────────────────────────────────────────
-- La Trastienda Campus — Schema inicial
-- ─────────────────────────────────────────────────────────────

-- Categorías de cursos
create table categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  order_index int  default 0,
  created_at  timestamptz default now()
);

-- Cursos
create table courses (
  id               uuid primary key default gen_random_uuid(),
  category_id      uuid references categories(id) on delete set null,
  title            text not null,
  slug             text unique not null,
  description      text,
  thumbnail_url    text,
  duration_minutes int  default 0,
  status           text default 'coming_soon'
                   check (status in ('draft', 'published', 'coming_soon')),
  order_index      int  default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Lecciones (vídeos individuales)
create table lessons (
  id               uuid primary key default gen_random_uuid(),
  course_id        uuid references courses(id) on delete cascade,
  title            text not null,
  description      text,
  video_url        text,   -- YouTube embed URL, Vimeo, o Supabase Storage
  duration_minutes int     default 0,
  order_index      int     default 0,
  is_preview       boolean default false,  -- lección gratuita sin matrícula
  created_at       timestamptz default now()
);

-- Matrículas (user_id = Clerk user ID)
create table enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  course_id   uuid references courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  unique (user_id, course_id)
);

-- Progreso por lección
create table lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  lesson_id    uuid references lessons(id) on delete cascade,
  completed    boolean     default false,
  completed_at timestamptz,
  unique (user_id, lesson_id)
);

-- ─────────────────────────────────────────────────────────────
-- Índices
-- ─────────────────────────────────────────────────────────────
create index on courses(category_id);
create index on courses(status);
create index on lessons(course_id, order_index);
create index on enrollments(user_id);
create index on lesson_progress(user_id);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────

-- Contenido público (cursos y lecciones visibles para todos)
alter table categories    enable row level security;
alter table courses       enable row level security;
alter table lessons       enable row level security;
alter table enrollments   enable row level security;
alter table lesson_progress enable row level security;

-- Categorías y cursos publicados: lectura pública
create policy "public can read categories"
  on categories for select using (true);

create policy "public can read published courses"
  on courses for select using (status = 'published' or status = 'coming_soon');

-- Lecciones: públicas si es preview, o si el usuario está matriculado
create policy "public can read preview lessons"
  on lessons for select using (is_preview = true);

create policy "enrolled users can read lessons"
  on lessons for select
  using (
    exists (
      select 1 from enrollments e
      where e.course_id = lessons.course_id
        and e.user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

-- Matrículas: cada usuario solo ve y gestiona las suyas
create policy "users can read own enrollments"
  on enrollments for select
  using (user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));

create policy "users can enroll themselves"
  on enrollments for insert
  with check (user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));

create policy "users can unenroll themselves"
  on enrollments for delete
  using (user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));

-- Progreso: cada usuario solo ve y escribe el suyo
create policy "users can read own progress"
  on lesson_progress for select
  using (user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));

create policy "users can upsert own progress"
  on lesson_progress for insert
  with check (user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));

create policy "users can update own progress"
  on lesson_progress for update
  using (user_id = (current_setting('request.jwt.claims', true)::json->>'sub'));

-- ─────────────────────────────────────────────────────────────
-- Datos iniciales — categorías
-- ─────────────────────────────────────────────────────────────
insert into categories (name, slug, order_index) values
  ('Atención al cliente',  'atencion-al-cliente',  1),
  ('Operativa de tienda',  'operativa-de-tienda',   2),
  ('Visual merchandising', 'visual-merchandising',  3),
  ('Liderazgo y equipos',  'liderazgo-y-equipos',   4);
