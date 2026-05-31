import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import CertificateCTA from '@/components/campus/CertificateCTA'

interface Props {
  params: Promise<{ slug: string }>
}

type CourseFeature = { label: string; description: string }

const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

function formatMonthYear(dateStr: string | null): string {
  if (!dateStr) return '—'
  const [year, month] = dateStr.split('-').map(Number)
  return `${MONTHS_ES[(month ?? 1) - 1]} ${year}`
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const { userId } = await auth()
  const supabase = await createServerClient()

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, tagline, description, duration_minutes, status, format, start_date, max_students, features')
    .eq('slug', slug)
    .single()

  if (!course) notFound()

  const { data: rawModules } = await supabase
    .from('modules')
    .select('id, title, description, order_index, is_bonus')
    .eq('course_id', course.id)
    .order('order_index')

  const modules = rawModules ?? []
  const mainModuleCount = modules.filter((m) => !m.is_bonus).length
  const hasBonus = modules.some((m) => m.is_bonus)
  const isComingSoon = course.status === 'coming_soon'
  const features = (course.features as CourseFeature[] | null) ?? []
  const emailSubject = encodeURIComponent(`Interés en ${course.title}`)

  // Enrollment check: if logged in, verify access
  let isEnrolled = false
  if (userId) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', course.id)
      .maybeSingle()
    isEnrolled = enrollment !== null
  }

  // Certificate: check completion and existing cert
  // Courses with module videos use module_progress; lesson-based courses use lesson_progress.
  let certSection: { allDone: boolean; existingCertId?: string } = { allDone: false }
  if (userId && isEnrolled && !isComingSoon) {
    const [{ data: videoModules }, { data: existingCert }] = await Promise.all([
      supabase
        .from('modules')
        .select('id')
        .eq('course_id', course.id)
        .not('video_url', 'is', null),
      supabase
        .from('certificates')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', course.id)
        .maybeSingle(),
    ])

    const videoModuleIds = (videoModules ?? []).map((m) => m.id)
    let allDone = false

    if (videoModuleIds.length > 0) {
      const { count: completedModules } = await supabase
        .from('module_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('module_id', videoModuleIds)
        .eq('completed', true)
      allDone = (completedModules ?? 0) >= videoModuleIds.length
    } else {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', course.id)
      const lessonIds = (lessons ?? []).map((l) => l.id)
      if (lessonIds.length > 0) {
        const { count: completedCount } = await supabase
          .from('lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .in('lesson_id', lessonIds)
          .eq('completed', true)
        allDone = (completedCount ?? 0) >= lessonIds.length
      }
    }

    certSection = { allDone, existingCertId: existingCert?.id }
  }

  const stats: { label: string; value: string; highlight?: boolean }[] = [
    { label: 'Inicio', value: formatMonthYear(course.start_date), highlight: true },
    { label: 'Formato', value: course.format ?? 'Online' },
    { label: 'Duración', value: `${mainModuleCount} clases · ${Math.round(course.duration_minutes / 60)}h` },
    { label: 'Grupo reducido', value: course.max_students ? `Máx. ${course.max_students} personas` : '—', highlight: true },
    { label: 'Enfoque', value: 'Casos reales, ejercicios y simulaciones' },
  ]

  return (
    <div className="max-w-4xl">
      {/* Back */}
      <a
        href="/campus/cursos"
        className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200"
      >
        ← Todos los cursos
      </a>

      {/* Header */}
      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.16em]">
            Formación intensiva
          </span>
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.1em] border px-2 py-0.5 ${
              isComingSoon ? 'text-cuero border-lino/60' : 'text-acento border-acento/40'
            }`}
          >
            {isComingSoon ? 'Próximamente' : 'Disponible'}
          </span>
        </div>

        <h1 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-4">
          {course.title}
        </h1>

        {course.tagline && (
          <p className="font-sans text-base text-cuero leading-relaxed max-w-[58ch]">
            {course.tagline}
          </p>
        )}
      </div>

      {/* Stats strip */}
      {(course.start_date || course.format || course.max_students) && (
        <div className="grid grid-cols-2 md:grid-cols-5 border border-lino/50 divide-y md:divide-y-0 md:divide-x divide-lino/30 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-5 bg-blanco">
              <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-1.5">
                {stat.label}
              </div>
              <div className={`font-sans text-[12px] font-medium leading-snug ${stat.highlight ? 'text-acento' : 'text-tinta'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bloques */}
      {modules.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-lino/40" />
            <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.14em] shrink-0">
              {mainModuleCount} bloques de contenido{hasBonus ? ' + Bonus Track' : ''}
            </span>
            <div className="h-px flex-1 bg-lino/40" />
          </div>

          <div className="space-y-3">
            {modules.map((mod) => {
              const label = mod.is_bonus ? '★' : String(mod.order_index)
              const href = `/campus/cursos/${slug}/bloque/${mod.is_bonus ? 'bonus' : mod.order_index}`
              // Locked: user is authenticated but not enrolled in this course
              const locked = !!userId && !isEnrolled

              if (locked) {
                return (
                  <div
                    key={mod.id}
                    className="flex items-center gap-5 bg-blanco border border-lino/30 px-6 py-5 opacity-50 select-none"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-medium ${
                        mod.is_bonus
                          ? 'bg-acento/10 text-acento border border-acento/30'
                          : 'bg-tinta/30 text-papel'
                      }`}
                    >
                      {label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-sm font-medium text-tinta leading-snug">
                        {mod.is_bonus ? `Bonus Track — ${mod.title}` : mod.title}
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-cuero/40 shrink-0">🔒</span>
                  </div>
                )
              }

              return (
                <a
                  key={mod.id}
                  href={href}
                  className="flex items-center gap-5 bg-blanco border border-lino/50 px-6 py-5 hover:border-tinta/30 transition-colors duration-200 cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-medium ${
                      mod.is_bonus
                        ? 'bg-acento/10 text-acento border border-acento/30'
                        : 'bg-tinta text-papel'
                    }`}
                  >
                    {label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-sm font-medium text-tinta leading-snug">
                      {mod.is_bonus ? `Bonus Track — ${mod.title}` : mod.title}
                    </div>
                    {mod.description && (
                      <div className="font-sans text-[11px] text-cuero mt-0.5 leading-relaxed max-w-[60ch]">
                        {mod.description}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[13px] text-cuero/40 group-hover:text-tinta transition-colors shrink-0">
                    →
                  </span>
                </a>
              )
            })}
          </div>

          {/* Access gate message for authenticated non-enrolled users */}
          {userId && !isEnrolled && (
            <div className="mt-4 border border-lino/50 bg-blanco px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="font-sans text-sm text-cuero">
                No tienes acceso a este curso. Contacta con La Trastienda para solicitar acceso.
              </p>
              <a
                href={`mailto:latrastienda.retail@gmail.com?subject=${encodeURIComponent(`Solicitud de acceso: ${course.title}`)}`}
                className="font-mono text-[11px] font-medium text-papel bg-tinta px-5 min-h-[40px] flex items-center uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta transition-colors duration-200 shrink-0"
              >
                Solicitar acceso →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {modules.length === 0 && (
        <div className="border border-lino/50 bg-blanco px-6 py-10 text-center mb-12">
          <p className="font-sans text-sm text-cuero/60">
            Los bloques de este curso estarán disponibles próximamente.
          </p>
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-lino/40" />
            <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.14em] shrink-0">
              Incluido en el curso
            </span>
            <div className="h-px flex-1 bg-lino/40" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((feat) => (
              <div key={feat.label} className="bg-blanco border border-lino/50 px-4 py-5">
                <div className="font-sans text-[11px] font-medium text-tinta mb-1.5">{feat.label}</div>
                <div className="font-sans text-[11px] text-cuero leading-relaxed">{feat.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate CTA */}
      {(certSection.allDone || certSection.existingCertId) && (
        <div className="border border-acento/30 bg-blanco px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="font-mono text-[9px] text-acento uppercase tracking-[0.14em] mb-1.5">
              Curso completado
            </div>
            <p className="font-sans text-sm font-medium text-tinta">
              Tu certificado de participación está listo.
            </p>
          </div>
          <CertificateCTA
            courseId={course.id}
            existingCertificateId={certSection.existingCertId}
          />
        </div>
      )}

      {/* Contact CTA */}
      {isComingSoon && (
        <div className="border border-lino/50 bg-blanco px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-1.5">
              Plazas limitadas · Junio 2026
            </div>
            <p className="font-sans text-sm font-medium text-tinta">
              ¿Te interesa este curso?
            </p>
          </div>
          <a
            href={`mailto:latrastienda.retail@gmail.com?subject=${emailSubject}`}
            className="font-mono text-[11px] font-medium text-papel bg-tinta px-5 min-h-[40px] flex items-center uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta transition-colors duration-200 cursor-pointer shrink-0"
          >
            Más información →
          </a>
        </div>
      )}
    </div>
  )
}
