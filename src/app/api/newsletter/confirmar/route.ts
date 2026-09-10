export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { baseUrl } from '@/lib/email'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const home = baseUrl()

  if (!token) return NextResponse.redirect(`${home}/newsletter/baja?error=1`)

  const supabase = createServiceClient()
  const { data: sub } = await supabase
    .from('newsletter_subscribers')
    .select('id, status, confirm_token_expires_at')
    .eq('confirm_token', token)
    .maybeSingle()

  if (!sub) return NextResponse.redirect(`${home}/newsletter/gracias?estado=desconocido`)

  if (sub.status === 'subscribed') {
    return NextResponse.redirect(`${home}/newsletter/gracias`)
  }

  // Token caducado → pedir que se vuelvan a suscribir
  if (sub.confirm_token_expires_at && Date.parse(sub.confirm_token_expires_at) < Date.now()) {
    return NextResponse.redirect(`${home}/newsletter/gracias?estado=caducado`)
  }

  await supabase
    .from('newsletter_subscribers')
    .update({
      status: 'subscribed',
      confirmed_at: new Date().toISOString(),
      unsubscribed_at: null,
      // Invalida el enlace tras usarlo (un solo uso)
      confirm_token: crypto.randomUUID(),
      confirm_token_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sub.id)

  return NextResponse.redirect(`${home}/newsletter/gracias`)
}
