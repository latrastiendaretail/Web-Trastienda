-- ─────────────────────────────────────────────────────────────
-- La Trastienda Campus — Tabla modules + cursos de formación
-- ─────────────────────────────────────────────────────────────

-- Columnas de metadatos de curso (por si 003 no se aplicó antes)
alter table courses
  add column if not exists tagline      text,
  add column if not exists format       text,
  add column if not exists start_date   date,
  add column if not exists max_students int,
  add column if not exists features     jsonb default '[]'::jsonb;

create table modules (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid references courses(id) on delete cascade,
  title       text not null,
  description text,
  order_index int     default 0,
  is_bonus    boolean default false,
  created_at  timestamptz default now()
);

-- FK opcional en lessons → modules (nullable: no rompe lecciones antiguas)
alter table lessons
  add column if not exists module_id uuid references modules(id) on delete cascade;

create index on modules(course_id, order_index);
create index on lessons(module_id, order_index);

alter table modules enable row level security;

create policy "public can read modules"
  on modules for select using (true);

-- ─────────────────────────────────────────────────────────────
-- Datos
-- ─────────────────────────────────────────────────────────────

do $$
declare
  v_course1_id uuid;
  v_course2_id uuid;
  v_mod_id     uuid;
begin

  -- ── CURSO 1: Prepárate para ser Manager ──────────────────────

  insert into courses (
    category_id, title, slug, tagline, description,
    duration_minutes, status, order_index, format,
    start_date, max_students, features
  )
  select
    c.id,
    'Prepárate para ser Manager',
    'preparate-para-ser-manager',
    'Formación práctica para dar el siguiente paso en retail.',
    'Un programa de 18 horas para mandos intermedios que quieren liderar con seguridad, gestionar su equipo y afrontar el día a día con herramientas reales.',
    1080,
    'coming_soon',
    0,
    'Online · Microsoft Teams',
    '2026-06-01',
    5,
    '[
      {"label":"Participación activa","description":"Aprendizaje práctico y dinámico en cada sesión."},
      {"label":"Casos reales","description":"Situaciones del día a día en tiendas reales."},
      {"label":"Feedback personalizado","description":"Atención cercana en grupo reducido de 5 personas."},
      {"label":"Certificado","description":"Certificado de participación al finalizar el curso."}
    ]'::jsonb
  from categories c
  where c.slug = 'liderazgo-y-equipos'
  on conflict (slug) do nothing;

  select id into v_course1_id from courses where slug = 'preparate-para-ser-manager';

  if v_course1_id is not null and not exists (
    select 1 from modules where course_id = v_course1_id
  ) then

    -- Módulo 1
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course1_id,
            'Qué significa ser responsable o manager',
            'Entiende tu nuevo rol, responsabilidades, expectativas y cómo generar impacto desde el primer día.',
            1, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course1_id, 'De vendedor a responsable: el cambio de chip', 1, 0, false),
      (v_mod_id, v_course1_id, 'Responsabilidades y expectativas del nuevo rol', 2, 0, false),
      (v_mod_id, v_course1_id, 'Cómo generar impacto desde el primer día', 3, 0, false),
      (v_mod_id, v_course1_id, 'Caso real: tus primeras dos semanas como manager', 4, 0, false);

    -- Módulo 2
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course1_id,
            'Organización como manager',
            'Planificación, prioridades, apertura/cierre, reparto de tareas, seguimiento y gestión del tiempo.',
            2, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course1_id, 'Planificación y priorización', 1, 0, false),
      (v_mod_id, v_course1_id, 'Apertura y cierre de tienda', 2, 0, false),
      (v_mod_id, v_course1_id, 'Reparto de tareas y seguimiento', 3, 0, false),
      (v_mod_id, v_course1_id, 'Gestión del tiempo bajo presión', 4, 0, false);

    -- Módulo 3
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course1_id,
            'Números, KPI y uso de ellos',
            'TM, UPT, conversión, productividad. Aprende a interpretar datos y tomar decisiones que mejoren resultados.',
            3, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course1_id, 'Los KPI que importan: TM, UPT, conversión, productividad', 1, 0, false),
      (v_mod_id, v_course1_id, 'Cómo interpretar los datos de tu tienda', 2, 0, false),
      (v_mod_id, v_course1_id, 'De los números a las decisiones', 3, 0, false),
      (v_mod_id, v_course1_id, 'Ejercicio: lee el cuadro de mando de una tienda', 4, 0, false);

    -- Módulo 4
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course1_id,
            'Comunicación',
            'Comunicar con claridad, dar feedback, dar instrucciones, gestionar conversaciones difíciles y motivar al equipo.',
            4, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course1_id, 'Comunicar con claridad y dar instrucciones', 1, 0, false),
      (v_mod_id, v_course1_id, 'Dar feedback que funciona', 2, 0, false),
      (v_mod_id, v_course1_id, 'Conversaciones difíciles', 3, 0, false),
      (v_mod_id, v_course1_id, 'Motivar al equipo con la palabra', 4, 0, false);

    -- Módulo 5
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course1_id,
            'Personas: tu equipo y compañeros',
            'Liderar, motivar, corregir, gestionar conflictos y crear un ambiente de trabajo positivo y productivo.',
            5, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course1_id, 'Liderar y motivar', 1, 0, false),
      (v_mod_id, v_course1_id, 'Corregir sin romper', 2, 0, false),
      (v_mod_id, v_course1_id, 'Gestión de conflictos', 3, 0, false),
      (v_mod_id, v_course1_id, 'Crear un ambiente positivo y productivo', 4, 0, false);

    -- Módulo 6
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course1_id,
            'Gestión de la venta, mentalidad y toma de decisiones',
            'Cómo liderar la venta desde tu nuevo rol, tomar decisiones rápidas y pensar como manager, no como vendedor.',
            6, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course1_id, 'Liderar la venta desde tu nuevo rol', 1, 0, false),
      (v_mod_id, v_course1_id, 'Pensar como manager, no como vendedor', 2, 0, false),
      (v_mod_id, v_course1_id, 'Toma de decisiones rápidas', 3, 0, false),
      (v_mod_id, v_course1_id, 'Simulación: un día de gestión real', 4, 0, false);

    -- Bonus Track
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course1_id,
            'Límites y autocuidado',
            'Claves para gestionar la presión, poner límites sanos y cuidar tu energía para mantener tu mejor versión a largo plazo.',
            7, true)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course1_id, 'Gestionar la presión', 1, 0, false),
      (v_mod_id, v_course1_id, 'Poner límites sanos', 2, 0, false),
      (v_mod_id, v_course1_id, 'Cuidar tu energía a largo plazo', 3, 0, false);

  end if;

  -- ── CURSO 2: Tus Primeros Pasos en Retail ────────────────────

  select id into v_course2_id from courses where slug = 'tus-primeros-pasos-en-retail';

  if v_course2_id is not null and not exists (
    select 1 from modules where course_id = v_course2_id
  ) then

    -- Eliminar las 6 lecciones planas del seed anterior
    delete from lessons where course_id = v_course2_id and module_id is null;

    -- Módulo 1
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course2_id,
            'Qué significa trabajar en una tienda',
            'Entiende cómo funciona una tienda, sus ritmos, prioridades y qué espera una empresa de ti.',
            1, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course2_id, 'Cómo funciona una tienda por dentro', 1, 0, false),
      (v_mod_id, v_course2_id, 'Los ritmos y las prioridades del día a día', 2, 0, false),
      (v_mod_id, v_course2_id, 'Qué espera una empresa de ti', 3, 0, false),
      (v_mod_id, v_course2_id, 'Caso real: tu primer turno', 4, 0, false);

    -- Módulo 2
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course2_id,
            'Atención al cliente y comunicación',
            'Claves para comunicarte con seguridad, escuchar, asesorar y gestionar situaciones difíciles.',
            2, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course2_id, 'Comunicarte con seguridad', 1, 0, false),
      (v_mod_id, v_course2_id, 'Escuchar y asesorar al cliente', 2, 0, false),
      (v_mod_id, v_course2_id, 'Gestionar situaciones difíciles', 3, 0, false),
      (v_mod_id, v_course2_id, 'Práctica: atender a un cliente complicado', 4, 0, false);

    -- Módulo 3
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course2_id,
            'Operativa y dinámica de tienda',
            'Reposición, orden, coordinación y gestión de prioridades en el día a día de tienda.',
            3, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course2_id, 'Reposición y orden', 1, 0, false),
      (v_mod_id, v_course2_id, 'Coordinación con el equipo', 2, 0, false),
      (v_mod_id, v_course2_id, 'Gestión de prioridades en el día a día', 3, 0, false),
      (v_mod_id, v_course2_id, 'Ejercicio: organiza una jornada de tienda', 4, 0, false);

    -- Módulo 4
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course2_id,
            'Actitud y profesionalidad',
            'La actitud que marca la diferencia: responsabilidad, adaptación, imagen y trabajo en equipo.',
            4, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course2_id, 'Responsabilidad y compromiso', 1, 0, false),
      (v_mod_id, v_course2_id, 'Adaptación al cambio', 2, 0, false),
      (v_mod_id, v_course2_id, 'Imagen y profesionalidad', 3, 0, false),
      (v_mod_id, v_course2_id, 'Trabajo en equipo', 4, 0, false);

    -- Módulo 5
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course2_id,
            'La realidad del sector Retail',
            'La parte que nadie te cuenta: presión, ritmo, clientes, campañas y cómo afrontarlo de forma realista.',
            5, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course2_id, 'Presión y ritmo: lo que nadie te cuenta', 1, 0, false),
      (v_mod_id, v_course2_id, 'Clientes y campañas', 2, 0, false),
      (v_mod_id, v_course2_id, 'Cómo afrontarlo de forma realista', 3, 0, false),
      (v_mod_id, v_course2_id, 'Reflexión: expectativas vs. realidad', 4, 0, false);

    -- Módulo 6
    insert into modules (course_id, title, description, order_index, is_bonus)
    values (v_course2_id,
            'CV y entrevistas para Retail',
            'Cómo preparar tu CV, qué buscan las empresas y cómo destacar en entrevistas.',
            6, false)
    returning id into v_mod_id;

    insert into lessons (module_id, course_id, title, order_index, duration_minutes, is_preview)
    values
      (v_mod_id, v_course2_id, 'Prepara tu CV para retail', 1, 0, false),
      (v_mod_id, v_course2_id, 'Qué buscan realmente las empresas', 2, 0, false),
      (v_mod_id, v_course2_id, 'Cómo destacar en una entrevista', 3, 0, false),
      (v_mod_id, v_course2_id, 'Simulación: tu entrevista de trabajo', 4, 0, false);

  end if;

end $$;
