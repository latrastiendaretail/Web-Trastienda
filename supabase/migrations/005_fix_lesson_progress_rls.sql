-- ─────────────────────────────────────────────────────────────
-- Fix: lesson_progress RLS — requiere matrícula en el curso
--
-- La policy anterior solo verificaba user_id = jwt.sub,
-- permitiendo marcar lecciones completas sin estar matriculado.
-- ─────────────────────────────────────────────────────────────

drop policy if exists "users can upsert own progress" on lesson_progress;
drop policy if exists "enrolled users can upsert own progress" on lesson_progress;

create policy "enrolled users can upsert own progress"
  on lesson_progress for insert
  with check (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
    and exists (
      select 1 from enrollments e
      join lessons l on l.course_id = e.course_id
      where l.id = lesson_progress.lesson_id
        and e.user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );

drop policy if exists "users can update own progress" on lesson_progress;
drop policy if exists "enrolled users can update own progress" on lesson_progress;

create policy "enrolled users can update own progress"
  on lesson_progress for update
  using (
    user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
    and exists (
      select 1 from enrollments e
      join lessons l on l.course_id = e.course_id
      where l.id = lesson_progress.lesson_id
        and e.user_id = (current_setting('request.jwt.claims', true)::json->>'sub')
    )
  );
