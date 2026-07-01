import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import CertificateCTA from '@/components/campus/CertificateCTA'
import BuyButton from '@/components/campus/BuyButton'

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
    .select('id, title, slug, tagline, description, duration_minutes, status, format, start_date, max_students, features, price_cents, stripe_price_id')
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

  // Enrollment check: service client bypasses RLS (userId already verified by Clerk)
  let isEnrolled = false
  if (userId) {
    const serviceClient = createServiceClient()
    const { data: enrollment } = await serviceClient
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
              const href = `/campus/cursos/${slug}/bloque/${mod.is_bonus ? 'bonus' : (mod.order_index ?? mod.id)}`
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-cuero/30 shrink-0">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
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

      {/* Access gate: logged-in, not enrolled */}
      {userId && !isEnrolled && !isComingSoon && (
        <div className="mb-10 border border-lino/50 bg-blanco px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {course.price_cents != null && (course.price_cents === 0 || course.stripe_price_id) ? (
            <>
              <div>
                <p className="font-sans text-sm font-medium text-tinta">Accede a este curso</p>
                <p className="font-mono text-[10px] text-cuero mt-0.5">Pago único · acceso de por vida</p>
              </div>
              <BuyButton courseId={course.id} priceCents={course.price_cents} />
            </>
          ) : (
            <>
              <p className="font-sans text-sm text-cuero">
                No tienes acceso a este curso. Contacta con La Trastienda para solicitar acceso.
              </p>
              <a
                href={`mailto:latrastienda.retail@gmail.com?subject=${encodeURIComponent(`Solicitud de acceso: ${course.title}`)}`}
                className="font-mono text-[11px] font-medium text-papel bg-tinta px-5 min-h-[40px] flex items-center uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta transition-colors duration-200 shrink-0"
              >
                Solicitar acceso →
              </a>
            </>
          )}
        </div>
      )}

      {/* Price CTA for non-logged-in users on paid/free courses */}
      {!userId && course.price_cents != null && (course.price_cents === 0 || course.stripe_price_id) && !isComingSoon && (
        <div className="mb-10 border border-lino/50 bg-blanco px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-sans text-sm font-medium text-tinta">
              {course.price_cents === 0
                ? 'Gratuito'
                : (course.price_cents / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }) + ' · Pago único · acceso de por vida'}
            </p>
            <p className="font-mono text-[10px] text-cuero mt-0.5">Inicia sesión para acceder</p>
          </div>
          <a
            href="/campus/login"
            className="font-mono text-[11px] font-medium text-papel bg-tinta px-5 min-h-[40px] flex items-center uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta transition-colors duration-200 shrink-0"
          >
            Iniciar sesión →
          </a>
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
