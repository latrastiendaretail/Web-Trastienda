'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/admin'
import { createServiceClient } from '@/lib/supabase/service'
import { extractVideoId } from '@/lib/youtube'

export type RawSlide = string | { type: 'video'; url: string }

const BUCKET = 'campus-resources'
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

async function getSlides(moduleId: string) {
  const supabase = createServiceClient()
  const { data: mod } = await supabase
    .from('modules')
    .select('id, slides, course_id, courses(slug)')
    .eq('id', moduleId)
    .single()
  if (!mod) throw new Error('Módulo no encontrado')
  const slides = (mod.slides ?? []) as RawSlide[]
  const courseSlug = (mod.courses as unknown as { slug: string } | null)?.slug ?? 'curso'
  return { supabase, slides, courseSlug }
}

async function saveSlides(moduleId: string, slides: RawSlide[]) {
  const supabase = createServiceClient()
  await supabase.from('modules').update({ slides }).eq('id', moduleId)
  revalidatePath(`/admin/slides/${moduleId}`)
}

export async function uploadSlideImages(moduleId: string, formData: FormData): Promise<void> {
  await requireAdmin()
  const { supabase, slides, courseSlug } = await getSlides(moduleId)

  const files = formData.getAll('images').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length === 0) return

  const newPaths: string[] = []
  for (const file of files) {
    if (file.size > MAX_IMAGE_BYTES) continue
    if (!file.type.startsWith('image/')) continue

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const path = `${courseSlug}/${moduleId}/slide-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    })
    if (!error) newPaths.push(path)
  }

  if (newPaths.length > 0) {
    await saveSlides(moduleId, [...slides, ...newPaths])
  }
}

export async function addSlideVideo(moduleId: string, url: string): Promise<void> {
  await requireAdmin()
  const videoId = extractVideoId(url)
  if (!videoId) return

  const { slides } = await getSlides(moduleId)
  await saveSlides(moduleId, [...slides, { type: 'video', url }])
}

export async function removeSlideItem(moduleId: string, index: number): Promise<void> {
  await requireAdmin()
  const { supabase, slides } = await getSlides(moduleId)
  const target = slides[index]
  const next = slides.filter((_, i) => i !== index)

  if (typeof target === 'string') {
    await supabase.storage.from(BUCKET).remove([target])
  }

  await saveSlides(moduleId, next)
}

export async function moveSlideItem(moduleId: string, index: number, direction: -1 | 1): Promise<void> {
  await requireAdmin()
  const { slides } = await getSlides(moduleId)
  const target = index + direction
  if (target < 0 || target >= slides.length) return

  const next = [...slides]
  ;[next[index], next[target]] = [next[target], next[index]]
  await saveSlides(moduleId, next)
}
