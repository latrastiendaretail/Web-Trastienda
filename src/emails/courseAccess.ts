import { EMAIL_HEAD, esc, fill, legalFooter } from './shared'

export interface CourseAccessVars {
  firstName: string
  courseTitle: string
  courseUrl: string
  moduleCount: number
  amount: string
  date: string
  paymentMethod: string
  unsubscribeUrl: string
}

const BODY = `
<body style="margin:0;padding:0;background:#ede8df;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#ede8df;opacity:0;">Tu matrícula está confirmada: ya puedes entrar en [Curso] y empezar cuando quieras.</div>
<table role="presentation" class="bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ede8df;">
<tbody><tr><td align="center" style="padding:32px 14px 40px 14px;">
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

<tbody><tr><td class="paper px" style="background:#ffffff;padding:36px 44px 22px 44px;border-radius:6px 6px 0 0;">
<p class="gold" style="margin:0 0 10px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#b5821a;">Matrícula confirmada</p>
<p class="ink" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1;color:#2a1a0a;">La&nbsp;Trastienda</p>
</td></tr>

<tr><td class="paper" style="background:#ffffff;padding:0 44px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td class="rule" style="height:1px;line-height:1px;font-size:1px;background:#ddd5c8;">&nbsp;</td></tr></tbody></table></td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:34px 44px 0 44px;">
<h1 class="display ink" style="margin:0 0 18px 0;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:normal;line-height:1.12;color:#2a1a0a;">Hola [Nombre], ya tienes <em class="gold" style="font-style:italic;color:#b5821a;">acceso.</em></h1>
<p class="body-text" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#4a3a28;">Aprende a tu ritmo, desde donde quieras. El material está hecho con casos del día a día del comercio: nada de teoría de manual, cosas que puedes aplicar mañana en tu tienda.</p>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:26px 44px 0 44px;">
<table role="presentation" class="box" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f1;border:1px solid #ddd5c8;border-radius:6px;">
<tbody><tr><td class="pxi" style="padding:26px 28px 28px 28px;">
<p class="muted" style="margin:0 0 10px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#6b5540;">Tu curso &nbsp;◆&nbsp; [Nº] módulos</p>
<p class="h2 ink" style="margin:0 0 22px 0;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.2;color:#2a1a0a;">[Curso]</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td align="center" bgcolor="#b5821a" style="border-radius:6px;">
<a class="btn" href="[URL_CURSO]" target="_blank" style="display:inline-block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#ffffff;text-decoration:none;padding:15px 30px;border-radius:6px;">Empezar ahora →</a>
</td></tr></tbody></table>
</td></tr></tbody></table>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:30px 44px 0 44px;">
<p class="muted" style="margin:0 0 14px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#6b5540;">Detalle de tu compra</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;">
<tbody><tr class="stackrow"><td class="muted stackcell" width="42%" style="padding:9px 0;border-bottom:1px solid #ddd5c8;color:#6b5540;">Concepto</td><td class="ink stackcell" align="right" style="padding:9px 0;border-bottom:1px solid #ddd5c8;color:#2a1a0a;font-weight:600;">[Curso]</td></tr>
<tr class="stackrow"><td class="muted stackcell" style="padding:9px 0;border-bottom:1px solid #ddd5c8;color:#6b5540;">Importe</td><td class="ink stackcell" align="right" style="padding:9px 0;border-bottom:1px solid #ddd5c8;color:#2a1a0a;font-weight:600;">[Importe]</td></tr>
<tr class="stackrow"><td class="muted stackcell" style="padding:9px 0;border-bottom:1px solid #ddd5c8;color:#6b5540;">Fecha</td><td class="ink stackcell" align="right" style="padding:9px 0;border-bottom:1px solid #ddd5c8;color:#2a1a0a;font-weight:600;">[Fecha]</td></tr>
<tr class="stackrow"><td class="muted stackcell" style="padding:9px 0;color:#6b5540;">Método de pago</td><td class="ink stackcell" align="right" style="padding:9px 0;color:#2a1a0a;font-weight:600;">[Método de pago]</td></tr>
</tbody></table>
<p class="legal" style="margin:14px 0 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#7d6f5e;">Stripe te envía el justificante de pago por separado. Si pagaste a plazos con Klarna, la gestión del crédito corre a cargo de Klarna.</p>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:26px 44px 0 44px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
<td valign="top" width="24" class="gold" style="font-family:Georgia,serif;font-size:13px;color:#b5821a;padding-top:2px;">◆</td>
<td class="body-text" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#4a3a28;">Al completar todos los módulos recibirás un <strong class="ink" style="color:#2a1a0a;">certificado acreditativo</strong> de La Trastienda con tu nombre y la fecha de finalización.</td>
</tr></tbody></table>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:30px 44px 0 44px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td class="rule" style="height:1px;line-height:1px;font-size:1px;background:#ddd5c8;">&nbsp;</td></tr></tbody></table></td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:22px 44px 34px 44px;border-radius:0 0 6px 6px;">
<p class="muted" style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:15px;color:#6b5540;">El comercio, desde dentro.</p>
<p class="legal" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:#7d6f5e;"><a href="https://latrastienda.es" target="_blank" class="gold" style="color:#b5821a;text-decoration:none;">latrastienda.es</a> &nbsp;◆&nbsp; <a href="mailto:latrastienda.retail@gmail.com" class="gold" style="color:#b5821a;text-decoration:none;">latrastienda.retail@gmail.com</a><br>Puedes <a href="[URL_BAJA]" target="_blank" class="legal" style="color:#7d6f5e;text-decoration:underline;">darte de baja de los avisos del campus</a> cuando quieras.</p>
</td></tr>
`

const CLOSE = `
</tbody></table>
</td></tr>
</tbody></table>
</body></html>`

export function renderCourseAccessEmail(v: CourseAccessVars): { subject: string; html: string } {
  const subject = `Ya tienes acceso a "${v.courseTitle}"`
  const head = EMAIL_HEAD.replace('[TITLE]', 'Ya tienes acceso a tu curso — La Trastienda')

  const footer = legalFooter({
    finalidad:
      'gestión de tu matrícula, alta en el campus, acceso al curso contratado y atención de las obligaciones derivadas de la compra.',
    legitimacion:
      'ejecución del contrato de formación que has suscrito (art. 6.1.b RGPD) y cumplimiento de obligaciones legales, fiscales y contables (art. 6.1.c RGPD).',
    conservacion:
      'mientras se mantenga la relación formativa y, después, durante los plazos legales de prescripción fiscal y contable, o mientras puedan derivarse responsabilidades del contrato.',
    destinatarios:
      'encargados del tratamiento por cuenta de La Trastienda: Stripe (cobros y facturación), Resend (envío de correo), Supabase (base de datos y alojamiento) y Clerk (identidad y acceso al campus). No se cederán tus datos a otros terceros salvo obligación legal. Si pagaste a plazos con Klarna, la gestión del crédito corre a cargo de Klarna como responsable independiente de ese tratamiento.',
  })

  const html = fill(head + BODY + footer + CLOSE, {
    Nombre: esc(v.firstName || 'de nuevo'),
    Curso: esc(v.courseTitle),
    'Nº': String(v.moduleCount),
    URL_CURSO: esc(v.courseUrl),
    Importe: esc(v.amount),
    Fecha: esc(v.date),
    'Método de pago': esc(v.paymentMethod),
    URL_BAJA: esc(v.unsubscribeUrl),
  })

  return { subject, html }
}
