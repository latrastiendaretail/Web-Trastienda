import { notFound } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { getCertificateById } from '@/app/actions/certificates'
import Certificate from '@/components/campus/Certificate'

interface Props {
  params: Promise<{ id: string }>
}

// Quien firma todos los certificados. Para añadir nombre o firma manuscrita:
// name: 'Nombre Apellido' y signatureUrl: '/images/certificado/firma.png' (PNG con fondo transparente).
const SIGNER = {
  name: '',
  role: 'Dirección · La Trastienda',
  signatureUrl: undefined as string | undefined,
}

const FORMAT = 'Online · Campus'

export default async function CertificadoPage({ params }: Props) {
  const { id } = await params
  const [cert, user] = await Promise.all([getCertificateById(id), currentUser()])

  if (!cert || !user) notFound()

  const course = cert.courses as { title: string; duration_minutes: number | null } | null
  if (!course) notFound()

  const studentName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    user.emailAddresses[0]?.emailAddress?.split('@')[0] ||
    'Alumno'

  const durationHours = Math.round((course.duration_minutes ?? 0) / 60)

  return (
    <div>
      <a href="/campus/progreso" className="font-sans text-[15px] text-tinta/60 hover:text-tinta transition-colors duration-200">
        ← Mi progreso
      </a>

      <header className="mt-8 mb-8 max-w-[760px]">
        <h1 className="font-display text-[clamp(1.85rem,4vw,2.75rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-3">
          Tu certificado
        </h1>
        <p className="font-sans text-[17px] text-tinta/70 leading-relaxed">
          Descárgalo en PDF o imagen, o añádelo a tu perfil de LinkedIn.
        </p>
      </header>

      <Certificate
        studentName={studentName}
        courseName={course.title}
        durationHours={durationHours}
        format={FORMAT}
        completedAt={cert.issued_at}
        certificateCode={cert.code}
        signer={SIGNER}
      />

      <p className="font-sans text-[15px] text-tinta/65 mt-8 max-w-[62ch] leading-relaxed">
        Número de certificado: <span className="text-tinta font-medium">{cert.code}</span>. Identifica tu diploma de forma única.
      </p>
    </div>
  )
}
