import { EMAIL_HEAD, esc, fill, legalFooter } from './shared'

export interface NewsletterConfirmVars {
  confirmUrl: string
  unsubscribeUrl: string
}

const BODY = `
<body style="margin:0;padding:0;background:#ede8df;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#ede8df;opacity:0;">Confirma tu suscripción a la newsletter de La Trastienda con un clic.</div>
<table role="presentation" class="bg" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ede8df;">
<tbody><tr><td align="center" style="padding:32px 14px 40px 14px;">
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

<tbody><tr><td class="paper px" style="background:#ffffff;padding:36px 44px 22px 44px;border-radius:6px 6px 0 0;">
<p class="gold" style="margin:0 0 10px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#b5821a;">Newsletter</p>
<p class="ink" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1;color:#2a1a0a;">La&nbsp;Trastienda</p>
</td></tr>

<tr><td class="paper" style="background:#ffffff;padding:0 44px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td class="rule" style="height:1px;line-height:1px;font-size:1px;background:#ddd5c8;">&nbsp;</td></tr></tbody></table></td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:34px 44px 0 44px;">
<h1 class="display ink" style="margin:0 0 18px 0;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:normal;line-height:1.12;color:#2a1a0a;">Un <em class="gold" style="font-style:italic;color:#b5821a;">último</em> paso.</h1>
<p class="body-text" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#4a3a28;">Al comprar tu curso marcaste que querías recibir nuestra newsletter. Confirma que eres tú y empezamos a enviártela.</p>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:26px 44px 0 44px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td align="center" bgcolor="#b5821a" style="border-radius:6px;">
<a class="btn" href="[URL_CONFIRMAR]" target="_blank" style="display:inline-block;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#ffffff;text-decoration:none;padding:15px 30px;border-radius:6px;">Confirmar suscripción →</a>
</td></tr></tbody></table>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:28px 44px 0 44px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
<td valign="top" width="24" class="gold" style="font-family:Georgia,serif;font-size:13px;color:#b5821a;padding-top:2px;">◆</td>
<td class="body-text" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#4a3a28;">Recibirás formación, recursos y novedades sobre comercio y retail. Una vez al mes, más o menos. Sin ruido.</td>
</tr></tbody></table>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:22px 44px 0 44px;">
<p class="legal" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#7d6f5e;">Si no fuiste tú, ignora este correo: no te suscribiremos.</p>
</td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:24px 44px 0 44px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td class="rule" style="height:1px;line-height:1px;font-size:1px;background:#ddd5c8;">&nbsp;</td></tr></tbody></table></td></tr>

<tr><td class="paper px" style="background:#ffffff;padding:22px 44px 34px 44px;border-radius:0 0 6px 6px;">
<p class="muted" style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:15px;color:#6b5540;">El comercio, desde dentro.</p>
<p class="legal" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.7;color:#7d6f5e;"><a href="https://latrastienda.es" target="_blank" class="gold" style="color:#b5821a;text-decoration:none;">latrastienda.es</a> &nbsp;◆&nbsp; <a href="mailto:latrastienda.retail@gmail.com" class="gold" style="color:#b5821a;text-decoration:none;">latrastienda.retail@gmail.com</a><br>Si no quieres saber nada más, <a href="[URL_BAJA]" target="_blank" class="legal" style="color:#7d6f5e;text-decoration:underline;">cancela aquí</a>.</p>
</td></tr>
`

const CLOSE = `
</tbody></table>
</td></tr>
</tbody></table>
</body></html>`

export function renderNewsletterConfirmEmail(v: NewsletterConfirmVars): {
  subject: string
  html: string
} {
  const subject = 'Confirma tu suscripción a la newsletter de La Trastienda'
  const head = EMAIL_HEAD.replace('[TITLE]', 'Confirma tu suscripción — La Trastienda')

  const footer = legalFooter({
    finalidad:
      'envío de comunicaciones comerciales de La Trastienda (newsletter con formación, recursos y novedades sobre comercio y retail).',
    legitimacion:
      'tu consentimiento expreso, prestado al marcar la casilla correspondiente durante la compra y confirmado mediante este correo (art. 6.1.a RGPD y art. 21 LSSI). Puedes retirarlo en cualquier momento sin que ello afecte a la licitud del tratamiento previo.',
    conservacion:
      'hasta que retires tu consentimiento o te des de baja de la newsletter.',
    destinatarios:
      'Resend, como encargado del tratamiento que presta el servicio de envío de correo por cuenta de La Trastienda, y Supabase, como encargado que aloja la base de datos. No se cederán tus datos a otros terceros salvo obligación legal.',
  })

  const html = fill(head + BODY + footer + CLOSE, {
    URL_CONFIRMAR: esc(v.confirmUrl),
    URL_BAJA: esc(v.unsubscribeUrl),
  })

  return { subject, html }
}
