'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'
import { createServiceClient } from '@/lib/supabase/service'

export async function assignCourse(userId: string, courseId: string): Promise<void> {
  await requireAdmin()
  const supabase = createServiceClient()
  await supabase.from('enrollments').insert({ user_id: userId, course_id: courseId })
  revalidatePath(`/admin/usuarios/${userId}`)
}

export async function revokeCourse(userId: string, courseId: string): Promise<void> {
  await requireAdmin()
  const supabase = createServiceClient()
  await supabase.from('enrollments').delete().eq('user_id', userId).eq('course_id', courseId)
  revalidatePath(`/admin/usuarios/${userId}`)
}
