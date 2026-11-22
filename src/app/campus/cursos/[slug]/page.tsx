import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/service'
import CertificateCTA from '@/components/campus/CertificateCTA'
import BuyButton from '@/components/campus/BuyButton'
import { ProgressDial, Icon } from '@/components/campus/academia/icons'

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
  const supabase = createServiceClient()

  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id, title, slug, tagline, description, duration_minutes, status, format, start_date, max_students, features, price_cents, stripe_price_id')
    .eq('slug', slug)
    .single()

  if (courseError) console.error('[CoursePage] courses query error', slug, courseError)
  if (!course) notFound()

  const { data: rawModules } = await supabase
    .from('modules')
    .select('id, title, description, order_index, is_bonus, pdf_url, tool_key')
    .eq('course_id', course.id)
    .order('order_index')

  const modules = rawModules ?? []
  const mainModuleCount = modules.filter((m) => !m.is_bonus).length
  const hasBonus = modules.some((m) => m.is_bonus)
  const isComingSoon = course.status === 'coming_soon'
  const features = (course.features as CourseFeature[] | null) ?? []
  const emailSubject = encodeURIComponent(`Interés en ${course.title}`)

  // Enrollment check: service client bypasses RLS (userId already verified by Clerk)
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
  let progressUnits: { completed: number; total: number } | null = null
  if (userId && isEnrolled && !isComingSoon) {
    const [{ data: videoModules }, { data: existingCert }] = await Promise.all([
      supabase
        .from('modules')
        .select('id')
        .eq('course_id', course.id)
        .or('video_url.not.is.null,slides.not.is.null'),
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
      progressUnits = { completed: completedModules ?? 0, total: videoModuleIds.length }
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
        progressUnits = { completed: completedCount ?? 0, total: lessonIds.length }
      }
    }

    certSection = { allDone, existingCertId: existingCert?.id }
  }

  const meta = [
    course.start_date && isComingSoon ? `Inicio: ${formatMonthYear(course.start_date)}` : null,
    course.format ?? null,
    course.duration_minutes > 0
      ? `${mainModuleCount} clases · ${Math.round(course.duration_minutes / 60)} h`
      : `${mainModuleCount} clases`,
    course.max_students ? `Grupo de máx. ${course.max_students} personas` : null,
  ].filter(Boolean) as string[]

  const ctaBtn =
    'font-sans text-[15px] font-medium text-papel bg-tinta px-6 min-h-[48px] inline-flex items-center hover:bg-acento hover:text-tinta transition-colors duration-200 shrink-0'
  const hasPrice = course.price_cents != null && (course.price_cents === 0 || !!course.stripe_price_id)

  return (
    <div className="max-w-[760px] mx-auto">
      <a href="/campus/cursos" className="font-sans text-[15px] text-tinta/60 hover:text-tinta transition-colors duration-200">
        ← Todos los cursos
      </a>

      <header className="mt-8 mb-12">
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium text-tinta leading-[1.08] tracking-[-0.02em] mb-5">
          {course.title}
        </h1>
        {course.tagline && (
          <p className="font-sans text-[18px] text-tinta/75 leading-relaxed mb-5">{course.tagline}</p>
        )}
        <p className="font-sans text-[15px] text-tinta/60">{meta.join(' · ')}</p>

        {progressUnits && progressUnits.total > 0 && (
          <div className="flex items-center gap-4 mt-6">
            <ProgressDial total={progressUnits.total} completed={progressUnits.completed} className="w-40" />
            <span className="font-sans text-[15px] text-tinta/70">
              {progressUnits.completed} de {progressUnits.total} completados
            </span>
          </div>
        )}
      </header>

      {/* Acceso: sesión iniciada sin matrícula */}
      {userId && !isEnrolled && !isComingSoon && (
        <div className="mb-12 border border-lino bg-blanco p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {hasPrice ? (
            <>
              <div>
                <p className="font-sans text-[17px] font-medium text-tinta">Accede a este curso</p>
                <p className="font-sans text-[15px] text-tinta/65 mt-0.5">Pago único, acceso de por vida.</p>
              </div>
              <BuyButton courseId={course.id} priceCents={course.price_cents!} />
            </>
          ) : (
            <>
              <p className="font-sans text-[16px] text-tinta/75">
                No tienes acceso a este curso. Escríbenos y te lo activamos.
              </p>
              <a
                href={`mailto:latrastienda.retail@gmail.com?subject=${encodeURIComponent(`Solicitud de acceso: ${course.title}`)}`}
                className={ctaBtn}
              >
                Solicitar acceso
              </a>
            </>
          )}
        </div>
      )}

      {/* Sin sesión */}
      {!userId && hasPrice && !isComingSoon && (
        <div className="mb-12 border border-lino bg-blanco p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="font-sans text-[17px] font-medium text-tinta">
              {course.price_cents === 0
                ? 'Gratis'
                : (course.price_cents! / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
            </p>
            <p className="font-sans text-[15px] text-tinta/65 mt-0.5">Pago único, acceso de por vida. Inicia sesión para continuar.</p>
          </div>
          <a href={`/campus/login?redirect_url=${encodeURIComponent(`/campus/cursos/${slug}`)}`} className={ctaBtn}>
            Iniciar sesión
          </a>
        </div>
      )}

      {/* Certificado */}
      {(certSection.allDone || certSection.existingCertId) && (
        <div className="mb-12 border border-acento/40 bg-blanco p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="font-sans text-[17px] font-medium text-tinta">Has completado el curso</p>
            <p className="font-sans text-[15px] text-tinta/65 mt-0.5">Tu certificado de participación está listo.</p>
          </div>
          <CertificateCTA courseId={course.id} existingCertificateId={certSection.existingCertId} />
        </div>
      )}

      {/* Contenido */}
      {modules.length > 0 ? (
        <section className="mb-14" aria-labelledby="contenido">
          <h2 id="contenido" className="font-display text-2xl font-medium text-tinta mb-2">
            Contenido
          </h2>
          <ol className="border-t border-lino mt-4">
            {modules.map((mod) => {
              const href = `/campus/cursos/${slug}/bloque/${mod.is_bonus ? 'bonus' : (mod.order_index ?? mod.id)}`
              const locked = !!userId && !isEnrolled
              const title = mod.is_bonus ? `Bonus: ${mod.title}` : mod.title
              const number = mod.is_bonus ? '+' : String(mod.order_index)

              const inner = (
                <>
                  <span className="font-display text-[26px] text-tinta/35 w-9 shrink-0 leading-none pt-0.5">{number}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-[17px] font-medium text-tinta leading-snug">{title}</div>
                    {mod.description && (
                      <p className="font-sans text-[15px] text-tinta/65 mt-1 leading-relaxed max-w-[60ch]">{mod.description}</p>
                    )}
                  </div>
                  {locked ? (
                    <Icon name="bloqueado" className="w-4 h-4 text-tinta/30 mt-1.5" />
                  ) : (
                    <span className="font-sans text-tinta/40 group-hover:text-tinta transition-colors duration-200 mt-0.5" aria-hidden="true">→</span>
                  )}
                </>
              )

              return (
                <li key={mod.id} className="border-b border-lino">
                  {locked ? (
                    <div className="flex items-start gap-4 py-5 opacity-60">{inner}</div>
                  ) : (
                    <a href={href} className="flex items-start gap-4 py-5 group cursor-pointer">
                      {inner}
                    </a>
                  )}
                </li>
              )
            })}
          </ol>
        </section>
      ) : (
        <p className="font-sans text-[16px] text-tinta/70 mb-14">Los bloques de este curso estarán disponibles pronto.</p>
      )}

      {/* Incluido */}
      {features.length > 0 && (
        <section className="mb-14" aria-labelledby="incluido">
          <h2 id="incluido" className="font-display text-2xl font-medium text-tinta mb-6">
            Qué incluye
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {features.map((feat) => (
              <div key={feat.label}>
                <dt className="font-sans text-[16px] font-medium text-tinta">{feat.label}</dt>
                <dd className="font-sans text-[15px] text-tinta/70 leading-relaxed mt-1">{feat.description}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {isComingSoon && (
        <div className="border border-lino bg-blanco p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="font-sans text-[17px] font-medium text-tinta">¿Te interesa este curso?</p>
            <p className="font-sans text-[15px] text-tinta/65 mt-0.5">Plazas limitadas. Escríbenos y te avisamos.</p>
          </div>
          <a href={`mailto:latrastienda.retail@gmail.com?subject=${emailSubject}`} className={ctaBtn}>
            Más información
          </a>
        </div>
      )}
    </div>
  )
}
