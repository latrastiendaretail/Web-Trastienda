import { notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { getCertificateById } from '@/app/actions/certificates'
import Certificate from '@/components/campus/Certificate'

interface Props {
  params: Promise<{ id: string }>
}

// The signer shown on every certificate — change here to update all
const SIGNER = {
  name: 'La Trastienda',
  role: 'Equipo fundador',
}

export default async function CertificadoPage({ params }: Props) {
  const { id } = await params
  const [cert, user] = await Promise.all([
    getCertificateById(id),
    currentUser(),
  ])

  if (!cert || !user) notFound()

  const course = cert.courses as { title: string; duration_minutes: number; format: string | null } | null
  if (!course) notFound()

  const studentName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.emailAddresses[0]?.emailAddress?.split('@')[0] ||
    'Alumno'

  const durationHours = Math.round((course.duration_minutes ?? 0) / 60)
  const format = course.format ?? 'Online'

  return (
    <div className="max-w-5xl">
      <a
        href="/campus/progreso"
        className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
      >
        ← Mi progreso
      </a>

      <div className="mt-6 mb-8">
        <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          Diploma
        </span>
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-2">
          Tu certificado
        </h1>
        <p className="font-sans text-sm text-cuero leading-relaxed max-w-[52ch]">
          Descárgalo y compártelo en LinkedIn como credencial profesional.
        </p>
      </div>

      <Certificate
        studentName={studentName}
        courseName={course.title}
        durationHours={durationHours}
        format={format}
        completedAt={cert.issued_at}
        certificateCode={cert.code}
        signer={SIGNER}
      />

      <div className="mt-10 border border-lino/50 bg-blanco px-6 py-5">
        <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-1.5">
          Código de certificado
        </div>
        <div className="font-display text-lg font-medium text-tinta">
          {cert.code}
        </div>
        <p className="font-sans text-[12px] text-cuero/70 mt-1 leading-relaxed">
          Este código identifica tu diploma de forma única.
        </p>
      </div>
    </div>
  )
}
