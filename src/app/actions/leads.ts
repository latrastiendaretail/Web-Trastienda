'use server'

import { headers } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/service'
import { Resend } from 'resend'
import { leadsRatelimit } from '@/lib/ratelimit'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export type LeadResult =
  | { success: true }
  | { success: false; error: string }

export async function submitLead(formData: FormData): Promise<LeadResult> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anon'
  const { success: allowed } = await leadsRatelimit.limit(ip)
  if (!allowed) return { success: false, error: 'Demasiados intentos. Inténtalo más tarde.' }

  // Honeypot: bots rellenan este campo oculto, humanos no
  const honeypot = (formData.get('website') as string) ?? ''
  if (honeypot.length > 0) return { success: true } // fingir éxito para no dar pistas

  const email = (formData.get('email') as string | null)?.trim().toLowerCase().slice(0, 254) ?? ''

  if (!email) return { success: false, error: 'El email es obligatorio' }
  if (!isValidEmail(email)) return { success: false, error: 'Introduce un email válido' }

  const supabase = createServiceClient()
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
