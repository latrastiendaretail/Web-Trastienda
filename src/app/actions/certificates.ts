'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

export async function getOrCreateCertificate(courseId: string): Promise<
  | { certificate: { id: string; code: string; issued_at: string } }
  | { error: string; completedCount?: number; total?: number }
> {
  const { userId } = await auth()
  if (!userId) return { error: 'No autenticado' }

  const supabase = await createServerClient()

  // Return existing certificate if already issued
  const { data: existing } = await supabase
    .from('certificates')
    .select('id, code, issued_at')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (existing) return { certificate: existing }

  // Check completion: module-video courses use module_progress; lesson courses use lesson_progress.
  const { data: videoModules } = await supabase
    .from('modules')
    .select('id')
    .eq('course_id', courseId)
    .not('video_url', 'is', null)

  const videoModuleIds = (videoModules ?? []).map((m) => m.id)

  if (videoModuleIds.length > 0) {
    const total = videoModuleIds.length
    const { count: completedCount } = await supabase
      .from('module_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('module_id', videoModuleIds)
      .eq('completed', true)

    if ((completedCount ?? 0) < total) {
      return { error: 'Curso no completado', completedCount: completedCount ?? 0, total }
    }
  } else {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId)

    const total = lessons?.length ?? 0
    if (total === 0) return { error: 'El curso no tiene contenido' }

    const lessonIds = (lessons ?? []).map((l) => l.id)

    const { count: completedCount } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('lesson_id', lessonIds)
      .eq('completed', true)

    if ((completedCount ?? 0) < total) {
      return { error: 'Curso no completado', completedCount: completedCount ?? 0, total }
    }
  }

  // Generate unique code: LT · YYYY · NNNN
  const { count: certCount } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })

  const year = new Date().getFullYear()
  const seq = String((certCount ?? 0) + 1).padStart(4, '0')
  const code = `LT · ${year} · ${seq}`

  const { data: certificate, error } = await supabase
    .from('certificates')
    .insert({ user_id: userId, course_id: courseId, code })
    .select('id, code, issued_at')
    .single()

  if (error) return { error: error.message }
  return { certificate: certificate! }
}

export async function getCertificateById(id: string) {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = await createServerClient()

  const { data } = await supabase
    .from('certificates')
    .select('id, user_id, code, issued_at, course_id, courses(title, duration_minutes, format)')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  return data ?? null
}

export async function getUserCertificates() {
  const { userId } = await auth()
  if (!userId) return []

  const supabase = await createServerClient()

  const { data } = await supabase
    .from('certificates')
    .select('id, code, issued_at, courses(title, slug)')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })

  return data ?? []
}
