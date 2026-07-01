export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { Resend } from 'resend'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[stripe webhook] STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    const courseId = session.metadata?.course_id

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Record purchase — ignore duplicate (idempotent webhook delivery)
    const { error: purchaseError } = await supabase.from('purchases').insert({
      user_id: userId,
      course_id: courseId,
      stripe_session_id: session.id,
      stripe_payment_intent_id: (session.payment_intent as string) ?? null,
      amount_cents: session.amount_total ?? 0,
      currency: session.currency ?? 'eur',
      status: 'completed',
      customer_email: session.customer_details?.email ?? null,
    })

    if (purchaseError && purchaseError.code !== '23505') {
      console.error('[stripe webhook] purchase insert error', purchaseError)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    // Grant enrollment if not already exists
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()

    if (!existing) {
      const { error: enrollError } = await supabase
        .from('enrollments')
        .insert({ user_id: userId, course_id: courseId })

      if (enrollError) {
        console.error('[stripe webhook] enrollment insert error', enrollError)
        return NextResponse.json({ error: 'Enrollment error' }, { status: 500 })
      }
    }

    // Send access confirmation email
    const customerEmail = session.customer_details?.email
    if (customerEmail && process.env.RESEND_API_KEY) {
      const { data: course } = await supabase
        .from('courses')
        .select('title, slug')
        .eq('id', courseId)
        .single()

      if (course) {
        const { count: moduleCount } = await supabase
          .from('modules')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', courseId)

        const resend = new Resend(process.env.RESEND_API_KEY)
        const baseUrl = process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'
        const firstName = escapeHtml(session.customer_details?.name?.split(' ')[0] ?? '')

        await resend.emails.send({
          from: 'La Trastienda <onboarding@resend.dev>',
          replyTo: 'latrastienda.retail@gmail.com',
          to: [customerEmail],
          subject: `Ya tienes acceso a "${course.title}"`,
          html: `
            <!DOCTYPE html>
            <html lang="es">
            <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
            <body style="margin:0;padding:24px 0 40px;background:#ede8df;font-family:Georgia,'Times New Roman',serif">
              <div style="max-width:520px;margin:0 auto;padding:0 20px">

                <!-- Header -->
                <div style="padding-bottom:18px;border-bottom:1px solid #cfc5b4;margin-bottom:28px">
                  <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.8px;color:#b5821a;text-transform:uppercase">Matr&iacute;cula confirmada</p>
                  <p style="margin:0;font-size:20px;font-weight:700;color:#2a1a0a">La Trastienda</p>
                </div>

                <!-- Headline -->
                <h1 style="margin:0 0 18px;font-size:32px;font-weight:700;color:#2a1a0a;line-height:1.25">
                  Hola${firstName ? ` ${firstName},` : ','}<br>
                  ya tienes <em style="color:#b5821a;font-style:italic">acceso.</em>
                </h1>

                <!-- Intro -->
                <p style="margin:0 0 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#6b5540;line-height:1.7">
                  Tu plaza est&aacute; confirmada y el campus ya es tuyo. Aprender&aacute;s a tu ritmo, desde donde quieras, con material pensado para el d&iacute;a a d&iacute;a del comercio. Cuando te apetezca, empieza por aqu&iacute;.
                </p>

                <!-- Course card -->
                <div style="background:#ffffff;border:1px solid #ddd5c8;border-radius:8px;padding:24px;margin-bottom:24px">
                  <p style="margin:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:10px;font-weight:700;letter-spacing:1.2px;color:#aaa;text-transform:uppercase">Tu curso${moduleCount ? ` &middot; ${moduleCount} m&oacute;dulos` : ''}</p>
                  <p style="margin:0 0 22px;font-size:22px;font-weight:700;color:#2a1a0a;line-height:1.3">${course.title}</p>
                  <a href="${baseUrl}/campus/cursos/${course.slug}"
                     style="display:inline-block;background:#b5821a;color:#ffffff;padding:13px 26px;border-radius:6px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase">
                    Empezar ahora &rarr;
                  </a>
                </div>

                <!-- Certificate note -->
                <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
                  <tr>
                    <td style="vertical-align:top;width:18px;color:#b5821a;font-size:13px;padding-top:3px">&#9670;</td>
                    <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;color:#6b5540;line-height:1.65">
                      Al completar el curso recibir&aacute;s un <strong style="color:#2a1a0a">certificado acreditativo</strong> de La Trastienda, listo para sumar a tu curr&iacute;culum.
                    </td>
                  </tr>
                </table>

                <!-- Footer -->
                <div style="border-top:1px solid #cfc5b4;padding-top:20px">
                  <p style="margin:0 0 10px;font-style:italic;font-size:13px;color:#8a7a68">El comercio, desde dentro.</p>
                  <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#aaa">
                    Este correo es autom&aacute;tico &mdash; no respondas aqu&iacute;. &iquest;Dudas? Escr&iacute;benos a
                    <a href="mailto:latrastienda.retail@gmail.com" style="color:#8a7a68;text-decoration:underline">latrastienda.retail@gmail.com</a>
                  </p>
                  <p style="margin:8px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:11px;color:#bbb">
                    <a href="mailto:latrastienda.retail@gmail.com?subject=Baja%20campus" style="color:#bbb;text-decoration:underline">Darte de baja</a>
                  </p>
                </div>

              </div>
            </body>
            </html>
          `,
        }).catch(err => console.error('[stripe webhook] email error', err))
      }
    }
  }

  return NextResponse.json({ received: true })
}
