'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateCertificate } from '@/app/actions/certificates'

interface Props {
  courseId: string
  existingCertificateId?: string
}

export default function CertificateCTA({ courseId, existingCertificateId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (existingCertificateId) {
    return (
      <a
        href={`/campus/certificado/${existingCertificateId}`}
        className="inline-flex items-center font-mono text-[11px] font-medium text-acento border border-acento/50 px-5 min-h-[40px] uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta transition-colors duration-200 cursor-pointer"
      >
        Ver mi certificado →
      </a>
    )
  }

  async function handleClaim() {
    setLoading(true)
    setError(null)
    try {
      const result = await getOrCreateCertificate(courseId)
      if ('certificate' in result) {
        router.push(`/campus/certificado/${result.certificate.id}`)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Error generando el certificado. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <button
        onClick={handleClaim}
        disabled={loading}
        className="font-mono text-[11px] font-medium text-papel bg-acento px-5 min-h-[40px] flex items-center uppercase tracking-[0.08em] hover:bg-acento-deep transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Generando...' : 'Obtener mi certificado →'}
      </button>
      {error && (
        <span className="font-mono text-[10px] text-red-500 uppercase tracking-[0.06em]">
          {error}
        </span>
      )}
    </div>
  )
}
