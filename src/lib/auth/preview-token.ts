import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Enlaces de vista previa de solo lectura de un curso, sin login.
 * Token = base64url(JSON{c: courseSlug, e: expiraEpochSeg}) + '.' + base64url(HMAC-SHA256).
 * Solo server-side. Rotar PREVIEW_LINK_SECRET invalida todos los enlaces emitidos.
 */

const MAX_DAYS = 30

function getSecret(): string {
  const secret = process.env.PREVIEW_LINK_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('PREVIEW_LINK_SECRET no configurado (mín. 32 caracteres)')
  }
  return secret
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export function createPreviewToken(courseSlug: string, days: number): string {
  const d = Math.min(Math.max(Math.floor(days), 1), MAX_DAYS)
  const exp = Math.floor(Date.now() / 1000) + d * 24 * 60 * 60
  const payload = Buffer.from(JSON.stringify({ c: courseSlug, e: exp })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

export interface PreviewClaims {
  courseSlug: string
  expiresAt: number
}

/** Devuelve las claims si la firma es válida y no ha caducado; null en cualquier otro caso. */
export function verifyPreviewToken(token: string): PreviewClaims | null {
  try {
    const [payload, sig, extra] = token.split('.')
    if (!payload || !sig || extra !== undefined) return null

    const expected = Buffer.from(sign(payload))
    const given = Buffer.from(sig)
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { c?: unknown; e?: unknown }
    if (typeof data.c !== 'string' || typeof data.e !== 'number') return null
    if (data.e < Math.floor(Date.now() / 1000)) return null

    return { courseSlug: data.c, expiresAt: data.e }
  } catch {
    return null
  }
}
