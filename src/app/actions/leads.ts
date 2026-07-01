'use server'

import { headers } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

// In-memory rate limit: 5 submissions per IP per hour.
// Partial protection only — state is per serverless instance, not shared across.
const _rl = new Map<string, { n: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = _rl.get(ip)
  if (!entry || entry.reset < now) {
    _rl.set(ip, { n: 1, reset: now + 60 * 60 * 1000 })
    return true
  }
  if (entry.n >= 5) return false
  entry.n++
  return true
}

export type LeadResult =
  | { success: true }
  | { success: false; error: string }

export async function submitLead(formData: FormData): Promise<LeadResult> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anon'
  if (!checkRateLimit(ip)) return { success: false, error: 'Demasiados intentos. Inténtalo más tarde.' }

  // Honeypot: bots rellenan este campo oculto, humanos no
  const honeypot = (formData.get('website') as string) ?? ''
  if (honeypot.length > 0) return { success: true } // fingir éxito para no dar pistas

  const email = (formData.get('email') as string | null)?.trim().toLowerCase() ?? ''

  if (!email) return { success: false, error: 'El email es obligatorio' }
  if (!isValidEmail(email)) return { success: false, error: 'Introduce un email válido' }

  const supabase = await createServerClient()
  const { error } = await supabase.from('leads').insert({ email, source: 'inscripcion' })

  if (error) {
    if (error.code === '23505') {
      // Unique violation → ya registrado, no revelar que existe
      return { success: true }
    }
    return { success: false, error: 'Error al guardar. Inténtalo de nuevo.' }
  }

  if (process.env.RESEND_API_KEY && process.env.LEADS_EMAIL_TO) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'Campus <onboarding@resend.dev>',
      to: [process.env.LEADS_EMAIL_TO],
      subject: 'Nuevo alumno interesado — La Trastienda',
      text: `Nuevo registro en la lista de espera:\n\nEmail: ${email}\nFecha: ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}`,
    })
  }

  return { success: true }
}
