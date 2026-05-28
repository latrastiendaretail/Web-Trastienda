'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents (á→a, é→e, ñ→n…)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

function extractTitle(text: string): string {
  const firstLine = text.split('\n').find((l) => l.trim().length > 0) ?? ''
  return firstLine.slice(0, 120).trim()
}

function extractExcerpt(text: string): string {
  const clean = text.replace(/\n+/g, ' ').trim()
  return clean.length <= 200 ? clean : clean.slice(0, 197) + '…'
}

async function uniqueSlug(base: string, supabase: Awaited<ReturnType<typeof createServerClient>>): Promise<string> {
  let slug = base
  let attempt = 0
  while (true) {
    const { data } = await supabase.from('posts').select('id').eq('slug', slug).maybeSingle()
    if (!data) return slug
    attempt++
    slug = `${base}-${attempt}`
  }
}

export type CreatePostResult =
  | { success: true; slug: string }
  | { success: false; error: string }

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

export async function createPost(formData: FormData): Promise<CreatePostResult> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'No autorizado' }

  const content = (formData.get('content') as string | null)?.trim() ?? ''
  const linkedinUrl = (formData.get('linkedin_url') as string | null)?.trim() ?? ''

  if (!content) return { success: false, error: 'El contenido es obligatorio' }
  if (linkedinUrl && !isValidHttpUrl(linkedinUrl)) return { success: false, error: 'URL de LinkedIn no válida' }

  const title = extractTitle(content)
  if (!title) return { success: false, error: 'No se pudo extraer el título (primera línea vacía)' }

  const supabase = await createServerClient()
  const slug = await uniqueSlug(slugify(title), supabase)
  const excerpt = extractExcerpt(content)

  const { error } = await supabase.from('posts').insert({
    title,
    slug,
    content,
    excerpt,
    linkedin_url: linkedinUrl || null,
    status: 'published',
    published_at: new Date().toISOString(),
  })

  if (error) return { success: false, error: error.message }

  return { success: true, slug }
}
