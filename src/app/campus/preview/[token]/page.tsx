import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { verifyPreviewToken } from '@/lib/auth/preview-token'
import { createServiceClient } from '@/lib/supabase/service'

export const metadata: Metadata = { robots: { index: false, follow: false } }

interface Props {
  params: Promise<{ token: string }>
}

export default async function PreviewCoursePage({ params }: Props) {
  const { token } = await params
  const claims = verifyPreviewToken(token)
  if (!claims) notFound()

  const supabase = createServiceClient()
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, tagline')
    .eq('slug', claims.courseSlug)
    .single()
  if (!course) notFound()

  const { data: modules } = await supabase
    .from('modules')
    .select('id, title, description, order_index, is_bonus')
    .eq('course_id', course.id)
    .order('order_index')

  const caduca = new Date(claims.expiresAt * 1000).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-5xl">
      <div className="border border-acento/40 bg-blanco px-5 py-3 mb-8 font-mono text-[10px] text-cuero uppercase tracking-[0.1em]">
        Vista previa de solo lectura · caduca el {caduca}
      </div>

      <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-4 max-w-[20ch]">
        {course.title}
      </h1>
      {course.tagline && (
        <p className="font-sans text-base text-cuero leading-relaxed max-w-[58ch] mb-10">{course.tagline}</p>
      )}

      <div className="space-y-4 mb-12">
        {(modules ?? []).map((mod) => (
          <a
            key={mod.id}
            href={`/campus/preview/${token}/${mod.is_bonus ? 'bonus' : mod.order_index}`}
            className="block bg-blanco border border-lino/50 px-6 py-5 hover:border-tinta/30 transition-colors duration-200"
          >
            <span className={`font-mono text-[9px] uppercase tracking-[0.12em] block mb-1.5 ${mod.is_bonus ? 'text-acento' : 'text-cuero'}`}>
              {mod.is_bonus ? 'Bonus' : `Bloque ${mod.order_index}`}
            </span>
            <div className="font-sans text-sm font-medium text-tinta leading-snug">{mod.title}</div>
            {mod.description && (
              <div className="font-sans text-[11px] text-cuero mt-1 leading-relaxed max-w-[60ch]">{mod.description}</div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
