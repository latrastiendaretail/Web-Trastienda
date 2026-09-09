/**
 * Datos del responsable del tratamiento y direcciones de contacto,
 * usados en los pies legales de los correos transaccionales.
 *
 * Valores por defecto = los ya publicados en /privacidad y /terminos.
 * Se pueden sobrescribir por entorno sin tocar código.
 */
export const LEGAL_ENTITY = {
  name:
    process.env.LEGAL_ENTITY_NAME ??
    'Asociación Española para el Desarrollo del Talento y la Empleabilidad en Retail (AEDTER)',
  taxId: process.env.LEGAL_ENTITY_NIF ?? 'G88929443',
  address:
    process.env.LEGAL_ENTITY_ADDRESS ??
    'C/ Francesc Layret, 10-16, 1º P3, 08208 Sabadell (Barcelona)',
  privacyEmail: process.env.LEGAL_PRIVACY_EMAIL ?? 'latrastienda.retail@gmail.com',
  supportEmail: process.env.LEGAL_SUPPORT_EMAIL ?? 'latrastienda.retail@gmail.com',
  privacyUrl: 'https://latrastienda.es/privacidad',
  siteUrl: 'https://latrastienda.es',
} as const

/** Texto exacto de la casilla de consentimiento de newsletter mostrada en el checkout. */
export const NEWSLETTER_CONSENT_TEXT =
  'Quiero recibir la newsletter de La Trastienda con formación, recursos y novedades ' +
  'sobre comercio y retail. Puedo darme de baja en cualquier momento. Consulta la ' +
  'política de privacidad en latrastienda.es/privacidad.'
