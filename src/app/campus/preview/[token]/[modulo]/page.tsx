import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { verifyPreviewToken } from '@/lib/auth/preview-token'
import BloqueView from '@/components/campus/BloqueView'

export const metadata: Metadata = { robots: { index: false, follow: false } }

interface Props {
  params: Promise<{ token: string; modulo: string }>
}

export default async function PreviewBloquePage({ params }: Props) {
  const { token, modulo } = await params
  const claims = verifyPreviewToken(token)
  if (!claims) notFound()

  return <BloqueView slug={claims.courseSlug} modulo={modulo} userId={null} previewToken={token} />
}
