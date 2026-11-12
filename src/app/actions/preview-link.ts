'use server'

import { headers } from 'next/headers'
import { requireAdmin } from '@/lib/auth/admin'
import { createServiceClient } from '@/lib/supabase/service'
import { createPreviewToken } from '@/lib/auth/preview-token'

export type PreviewLinkResult = { url?: string; expires?: string; error?: string }

export async function createPreviewLink(
  _prev: PreviewLinkResult,
  formData: FormData,
): Promise<PreviewLinkResult> {
  await requireAdmin()

  const slug = String(formData.get('course') ?? '')
  const days = Number(formData.get('days') ?? 7)
  if (!slug || !Number.isFinite(days)) return { error: 'Datos no válidos' }

  const supabase = createServiceClient()
  const { data: course } = await supabase.from('courses').select('slug').eq('slug', slug).maybeSingle()
  if (!course) return { error: 'Curso no encontrado' }

  let token: string
  try {
    token = createPreviewToken(slug, days)
  } catch {
    return { error: 'Falta configurar PREVIEW_LINK_SECRET en el servidor' }
  }

  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const expires = new Date(Date.now() + Math.min(Math.max(days, 1), 30) * 86400000).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return { url: `${proto}://${host}/campus/preview/${token}`, expires }
}
