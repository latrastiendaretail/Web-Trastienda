import { EMAIL_HEAD, esc, fill, legalFooter } from './shared'

export interface Kpi1to1Vars {
  firstName: string
  price: string
  priceDiscount: string
  promoCode: string
  discountLabel: string
  bookingUrl: string
  promoExpiry: string
  unsubscribeUrl: string
}

const BODY = `
<body style="margin:0;padding:0;background:#ede8df;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#ede8df;opacity:0;">45 minutos contigo revisando los KPIs de tu comercio real, con descuento para alumnos.</div>
<table role="presentation" class="bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ede8df;">
<tbody><tr><td align="center" style="padding:32px 14px 40px 14px;">
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

<tbody><tr><td class="paper px" style="background:#ffffff;padding:36px 44px 22px 44px;border-radius:6px 6px 0 0;">
<p class="gold" style="margin:0 0 10px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#b5821a;">Solo para alumnos del curso</p>
<p class="ink" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1;color:#2a1a0a;">La&nbsp;Trastienda</p>
</td></tr>

<tr><td class="paper" style="background:#ffffff;padding:0 44px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td class="rule" style="height:1px;line-height:1px;font-size:1px;background:#ddd5c8;">&nbsp;</td></tr></tbody></table></td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:34px 44px 0 44px;">
<h1 class="display ink" style="margin:0 0 18px 0;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:normal;line-height:1.12;color:#2a1a0a;">Lleva tus números a la práctica: <em class="gold" style="font-style:italic;color:#b5821a;">sesión 1:1</em></h1>
<p class="body-text" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#4a3a28;">Hola [Nombre]: 45 minutos contigo, en directo, revisando los KPIs de tu comercio real: qué mides, qué te falta medir y qué decisión tomar con cada número. Sales con un cuadro de mando propio, no con teoría.</p>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:26px 44px 0 44px;">
<table role="presentation" class="box" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;border:1px solid #b5821a;border-radius:6px;">
<tbody><tr><td class="pxi" style="padding:26px 28px 28px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;"><tbody><tr>
<td valign="middle" class="stackcell muted" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.4;color:#6b5540;">
<span class="muted" style="color:#8a7b68;text-decoration:line-through;">[Precio]</span>
&nbsp;<strong class="ink" style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:normal;color:#2a1a0a;">[Precio con descuento]</strong>
</td>
<td valign="middle" align="right" class="stackcell" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.4;color:#6b5540;">
Código <strong class="gold" style="color:#b5821a;letter-spacing:0.06em;">[CODIGO]</strong> &nbsp;◆&nbsp; [DESCUENTO]
</td>
</tr></tbody></table>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td align="center" bgcolor="#b5821a" style="border-radius:6px;">
<a class="btn" href="[URL_RESERVA_1A1]" target="_blank" style="display:inline-block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#ffffff;text-decoration:none;padding:15px 30px;border-radius:6px;">Reservar mi sesión →</a>
</td></tr></tbody></table>
<p class="legal" style="margin:16px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#7d6f5e;">Plazas limitadas cada mes. Oferta exclusiva para alumnos del curso; el código caduca el [Fecha límite].</p>
</td></tr></tbody></table>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:26px 44px 0 44px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
<td valign="top" width="24" class="gold" style="font-family:Georgia,serif;font-size:13px;color:#b5821a;padding-top:2px;">◆</td>
<td class="body-text" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#4a3a28;">La sesión es por videollamada. Al reservar eliges día y hora; te enviamos el enlace y un breve cuestionario para llegar con tus datos ya sobre la mesa.</td>
</tr></tbody></table>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:30px 44px 0 44px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td class="rule" style="height:1px;line-height:1px;font-size:1px;background:#ddd5c8;">&nbsp;</td></tr></tbody></table></td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:22px 44px 34px 44px;border-radius:0 0 6px 6px;">
<p class="muted" style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:15px;color:#6b5540;">El comercio, desde dentro.</p>
<p class="legal" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:#7d6f5e;"><a href="https://latrastienda.es" target="_blank" class="gold" style="color:#b5821a;text-decoration:none;">latrastienda.es</a> &nbsp;◆&nbsp; <a href="mailto:latrastienda.retail@gmail.com" class="gold" style="color:#b5821a;text-decoration:none;">latrastienda.retail@gmail.com</a><br>Puedes <a href="[URL_BAJA]" target="_blank" class="legal" style="color:#7d6f5e;text-decoration:underline;">darte de baja de estos avisos</a> cuando quieras.</p>
</td></tr>
`

const CLOSE = `
</tbody></table>
</td></tr>
</tbody></table>
</body></html>`

export function renderKpi1to1Email(v: Kpi1to1Vars): { subject: string; html: string } {
  const subject = 'Tu sesión 1:1 sobre los KPIs de tu comercio'
  const head = EMAIL_HEAD.replace('[TITLE]', 'Sesión 1:1 sobre los KPIs de tu comercio — La Trastienda')

  const footer = legalFooter({
    finalidad:
      'informarte, como alumno matriculado, de servicios propios de formación complementarios al curso que has contratado (sesión individual de acompañamiento sobre KPIs).',
    legitimacion:
      'interés legítimo de La Trastienda en comunicar a sus propios clientes servicios similares a los ya contratados (art. 6.1.f RGPD y art. 21.2 LSSI). Puedes oponerte a estos envíos en cualquier momento con el enlace de baja o escribiendo a la dirección indicada.',
    conservacion:
      'mientras mantengas la relación como alumno y no te opongas a este tipo de comunicaciones.',
    destinatarios:
      'encargados del tratamiento por cuenta de La Trastienda: Resend (envío de correo), Supabase (base de datos y alojamiento), Clerk (identidad y acceso al campus) y Stripe (cobro de la sesión, si la reservas). Si pagas a plazos con Klarna, la gestión del crédito corre a cargo de Klarna. No se cederán tus datos a otros terceros salvo obligación legal.',
  })

  const html = fill(head + BODY + footer + CLOSE, {
    Nombre: esc(v.firstName || 'de nuevo'),
    Precio: esc(v.price),
    'Precio con descuento': esc(v.priceDiscount),
    CODIGO: esc(v.promoCode),
    DESCUENTO: esc(v.discountLabel),
    URL_RESERVA_1A1: esc(v.bookingUrl),
    'Fecha límite': esc(v.promoExpiry),
    URL_BAJA: esc(v.unsubscribeUrl),
  })

  return { subject, html }
}
