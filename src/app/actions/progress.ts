'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export async function markLessonComplete(lessonId: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) return

  const supabase = await createServerClient()
  await supabase.from('lesson_progress').upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_id' },
  )
}

export async function markModuleComplete(moduleId: string): Promise<void> {
  const { userId } = await auth()
  if (!userId) return

  const supabase = await createServerClient()
  await supabase.from('module_progress').upsert(
    {
      user_id: userId,
      module_id: moduleId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,module_id' },
  )
}
