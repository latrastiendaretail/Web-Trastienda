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
    <div className="max-w-[760px] mx-auto">
      <div className="border border-acento/40 bg-blanco px-5 py-3 mb-10 font-sans text-[15px] text-tinta/75">
        Vista previa de solo lectura. Caduca el {caduca}
      </div>

      <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-4 max-w-[20ch]">
        {course.title}
      </h1>
      {course.tagline && (
        <p className="font-sans text-[18px] text-tinta/75 leading-relaxed mb-10">{course.tagline}</p>
      )}

      <div className="border-t border-lino mb-12">
        {(modules ?? []).map((mod) => (
          <a
            key={mod.id}
            href={`/campus/preview/${token}/${mod.is_bonus ? 'bonus' : mod.order_index}`}
            className="block border-b border-lino py-5 hover:bg-blanco transition-colors duration-200"
          >
            <span className={`font-sans text-[14px] block mb-1 ${mod.is_bonus ? 'text-acento-deep' : 'text-tinta/60'}`}>
              {mod.is_bonus ? 'Bonus' : `Bloque ${mod.order_index}`}
            </span>
            <div className="font-sans text-[17px] font-medium text-tinta leading-snug">{mod.title}</div>
            {mod.description && (
              <div className="font-sans text-[15px] text-tinta/65 mt-1 leading-relaxed max-w-[60ch]">{mod.description}</div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
