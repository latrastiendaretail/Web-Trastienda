'use server'

import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/service'

/**
 * Comprueba que `userId` está matriculado en el curso al que pertenece
 * la lección/módulo. Necesario porque RLS ya no lo enforce (el cliente
 * anon no lleva JWT de Clerk); la autorización es 100% server-side.
 */
async function isEnrolledInCourse(
  supabase: ReturnType<typeof createServiceClient>,
  userId: string,
  courseId: string,
): Promise<boolean> {
  const { data } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()
  return data !== null
}

export async function markLessonComplete(lessonId: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) return

  const supabase = createServiceClient()

  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id')
    .eq('id', lessonId)
    .maybeSingle()

  if (!lesson?.course_id) return
  if (!(await isEnrolledInCourse(supabase, userId, lesson.course_id))) return

  const { error } = await supabase.from('lesson_progress').upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_id' },
  )
  if (error) console.error('[markLessonComplete]', error)
}

export async function markModuleComplete(moduleId: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) return

  const supabase = createServiceClient()

  const { data: mod } = await supabase
    .from('modules')
    .select('course_id')
    .eq('id', moduleId)
    .maybeSingle()

  if (!mod?.course_id) return
  if (!(await isEnrolledInCourse(supabase, userId, mod.course_id))) return

  const { error } = await supabase.from('module_progress').upsert(
    {
      user_id: userId,
      module_id: moduleId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,module_id' },
  )
  if (error) console.error('[markModuleComplete]', error)
}
