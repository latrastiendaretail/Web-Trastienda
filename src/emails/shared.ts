import { LEGAL_ENTITY } from '@/lib/legal'

/** Escapa texto que se interpola dentro del HTML del correo. */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Sustituye marcadores tipo [CLAVE] por su valor. Los valores ya deben venir escapados. */
export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\[([^\]]+)\]/g, (match, key) =>
    key in vars ? vars[key] : match,
  )
}

export const EMAIL_HEAD = `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>[TITLE]</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
img{-ms-interpolation-mode:bicubic;border:0;line-height:100%;outline:none;text-decoration:none}
table{border-collapse:collapse!important}
body{margin:0!important;padding:0!important;width:100%!important}
a{text-decoration:none}
a:hover{text-decoration:underline}
@media screen and (max-width:600px){
.container{width:100%!important}
.px{padding-left:24px!important;padding-right:24px!important}
.pxi{padding-left:20px!important;padding-right:20px!important}
.display{font-size:29px!important;line-height:1.14!important}
.h2{font-size:21px!important}
.btn{display:block!important;width:100%!important;box-sizing:border-box!important}
.stackrow,.stackcell{display:block!important;width:100%!important;text-align:left!important}
.stackcell{padding:2px 0!important}
}
@media (prefers-color-scheme:dark){
body,.bg{background:#1a120a!important}
.paper{background:#241a10!important}
.ink{color:#f2ece1!important}
.body-text{color:#ded4c4!important}
.muted{color:#b3a28b!important}
.legal{color:#9d8d78!important}
.rule{background:#3b2f22!important;border-color:#3b2f22!important}
.box{background:#2c2015!important;border-color:#3b2f22!important}
.gold,.gold a{color:#d9a43a!important}
.outline-btn a{color:#d9a43a!important;border-color:#d9a43a!important}
}
[data-ogsc] body,[data-ogsc] .bg{background:#1a120a!important}
[data-ogsc] .paper{background:#241a10!important}
[data-ogsc] .ink{color:#f2ece1!important}
[data-ogsc] .body-text{color:#ded4c4!important}
[data-ogsc] .muted{color:#b3a28b!important}
[data-ogsc] .legal{color:#9d8d78!important}
[data-ogsc] .box{background:#2c2015!important;border-color:#3b2f22!important}
[data-ogsc] .gold{color:#d9a43a!important}
</style>
</head>`

const LEGAL_P =
  'style="margin:0 0 8px 0;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.65;color:#8a7b68;"'
const LEGAL_A = 'class="legal" style="color:#8a7b68;text-decoration:underline;"'

/**
 * Bloque "Información básica de protección de datos" para el pie del correo.
 * `finalidad`, `legitimacion` y `destinatarios` cambian según el tipo de correo.
 */
export function legalFooter(opts: {
  finalidad: string
  legitimacion: string
  conservacion: string
  destinatarios: string
}): string {
  const e = LEGAL_ENTITY
  return `<tr><td class="px" style="padding:24px 44px 0 44px;">
<p class="legal" style="margin:0 0 10px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#8a7b68;">Información básica de protección de datos</p>
<p class="legal" ${LEGAL_P}><strong>Responsable:</strong> ${esc(e.name)}, NIF ${esc(e.taxId)}, domicilio en ${esc(e.address)}. Contacto: <a href="mailto:${e.privacyEmail}" ${LEGAL_A}>${e.privacyEmail}</a>.</p>
<p class="legal" ${LEGAL_P}><strong>Finalidad:</strong> ${opts.finalidad}</p>
<p class="legal" ${LEGAL_P}><strong>Legitimación:</strong> ${opts.legitimacion}</p>
<p class="legal" ${LEGAL_P}><strong>Conservación:</strong> ${opts.conservacion}</p>
<p class="legal" ${LEGAL_P}><strong>Destinatarios:</strong> ${opts.destinatarios}</p>
<p class="legal" ${LEGAL_P}><strong>Derechos:</strong> puedes ejercer los derechos de acceso, rectificación, supresión, oposición, portabilidad y limitación del tratamiento escribiendo a <a href="mailto:${e.privacyEmail}" ${LEGAL_A}>${e.privacyEmail}</a>, indicando el derecho que ejerces. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD, <a href="https://www.aepd.es" target="_blank" ${LEGAL_A}>www.aepd.es</a>).</p>
<p class="legal" style="margin:0 0 14px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.65;color:#8a7b68;"><strong>Información adicional:</strong> política de privacidad completa en <a href="${e.privacyUrl}" target="_blank" ${LEGAL_A}>latrastienda.es/privacidad</a>.</p>
<p class="legal" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.65;color:#8a7b68;">Correo automático, no respondas aquí. Para cualquier duda escribe a <a href="mailto:${e.supportEmail}" ${LEGAL_A}>${e.supportEmail}</a>.</p>
</td></tr>`
}
