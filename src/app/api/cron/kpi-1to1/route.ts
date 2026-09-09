export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getResend, MAIL_FROM, MAIL_REPLY_TO } from '@/lib/email'
import { renderKpi1to1Email } from '@/emails/kpi1to1'

const OPT_OUT = 'mailto:latrastienda.retail@gmail.com?subject=Baja%20de%20comunicaciones'
const DELAY_DAYS = 3

function promoExpiry(): string {
  const days = Number(process.env.KPI_1TO1_PROMO_EXPIRY_DAYS ?? 30)
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  return d.toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' })
}

export async function GET(request: Request) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resend = getResend()
  if (!resend) return NextResponse.json({ ok: false, error: 'RESEND_API_KEY not set' }, { status: 500 })

  const supabase = createServiceClient()
  const cutoff = new Date(Date.now() - DELAY_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: rows, error } = await supabase
    .from('purchases')
    .select('id, customer_email, courses!inner(upsell_1to1)')
    .eq('status', 'completed')
    .eq('courses.upsell_1to1', true)
    .is('kpi_1to1_email_sent_at', null)
    .lte('created_at', cutoff)
    .not('customer_email', 'is', null)
    .limit(100)

  if (error) {
    console.error('[cron kpi-1to1] query error', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  const bookingUrl = process.env.KPI_1TO1_CAL_URL ?? 'https://cal.com/latrastienda'
  const template = {
    price: process.env.KPI_1TO1_PRICE ?? '120 €',
    priceDiscount: process.env.KPI_1TO1_PRICE_DISCOUNT ?? '96 €',
    promoCode: process.env.KPI_1TO1_PROMO_CODE ?? 'KPI1A1-20',
    discountLabel: process.env.KPI_1TO1_DISCOUNT_LABEL ?? '−20 %',
  }
  const expiry = promoExpiry()

  let sent = 0
  for (const row of rows ?? []) {
    const email = row.customer_email
    if (!email) continue

    const { subject, html } = renderKpi1to1Email({
      firstName: '',
      ...template,
      bookingUrl,
      promoExpiry: expiry,
      unsubscribeUrl: OPT_OUT,
    })

    const { error: sendError } = await resend.emails
      .send({ from: MAIL_FROM, replyTo: MAIL_REPLY_TO, to: [email], subject, html })
      .then((r) => ({ error: r.error }))
      .catch((err) => ({ error: err }))

    if (sendError) {
      console.error('[cron kpi-1to1] send error', email, sendError)
      continue
    }

    await supabase
      .from('purchases')
      .update({ kpi_1to1_email_sent_at: new Date().toISOString() })
      .eq('id', row.id)
    sent++
  }

  return NextResponse.json({ ok: true, candidates: rows?.length ?? 0, sent })
}
