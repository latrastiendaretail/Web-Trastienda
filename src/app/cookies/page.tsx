import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Política de Cookies — La Trastienda',
  description: 'Información sobre el uso de cookies en el sitio web y Campus digital de La Trastienda.',
  robots: { index: false },
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-14">
    <h2 className="font-display font-medium text-tinta text-2xl tracking-[-0.01em] mb-5 pb-4 border-b border-lino/50">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </section>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="font-sans text-[15px] text-tinta/80 leading-relaxed">{children}</p>
)

const Li = ({ children }: { children: React.ReactNode }) => (
  <li className="font-sans text-[15px] text-tinta/80 leading-relaxed flex gap-2">
    <span className="text-acento mt-1 shrink-0">—</span>
    <span>{children}</span>
  </li>
)

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de Cookies" lastUpdated="Mayo 2026">

      <Section title="1. ¿Qué son las cookies?">
        <P>
          Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando
          visitas un sitio web. Permiten al sitio recordar información sobre tu visita, como tu
          sesión de usuario o tus preferencias. Las cookies pueden ser propias (establecidas por
          este sitio) o de terceros (establecidas por dominios distintos).
        </P>
      </Section>

      <Section title="2. Cookies que utilizamos">
        <div className="overflow-x-auto">
          <table className="w-full border border-lino/60 text-[13px]">
            <thead>
              <tr className="bg-tinta/5 border-b border-lino/60">
                {['Cookie / proveedor', 'Tipo', 'Finalidad', 'Duración'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 font-sans font-medium text-[10px] text-cuero uppercase tracking-[0.08em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-lino/40">
              {[
                [
                  '__session (Clerk)',
                  'Técnica / Necesaria',
                  'Mantiene la sesión autenticada del Campus. Imprescindible para el funcionamiento del servicio.',
                  'Sesión',
                ],
                [
                  '__client_uat (Clerk)',
                  'Técnica / Necesaria',
                  'Verifica el estado de autenticación del usuario en cada página.',
                  '1 año',
                ],
                [
                  'YouTube (Google)',
                  'Terceros',
                  'Se establecen al reproducir vídeos formativos integrados. Google puede usarlas para personalización y estadísticas de vídeo.',
                  'Variable (Google)',
                ],
              ].map((row) => (
                <tr key={row[0]} className="hover:bg-tinta/[0.02] transition-colors align-top">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`px-4 py-3 font-sans leading-snug ${i === 0 ? 'font-medium text-tinta/90' : 'text-tinta/60'}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Las cookies técnicas marcadas como «Necesarias» no requieren tu consentimiento ya que son
          imprescindibles para la prestación del servicio que has solicitado (Campus digital). No se
          utilizan con fines publicitarios ni de seguimiento entre sitios.
        </P>
      </Section>

      <Section title="3. Cookies de YouTube (terceros)">
        <P>
          Nuestro sitio web integra reproductores de vídeo de YouTube (propiedad de Google LLC)
          para la visualización de contenidos formativos y episodios del podcast. Cuando interactúas
          con estos reproductores, YouTube puede establecer sus propias cookies en tu dispositivo.
        </P>
        <P>
          El uso que YouTube hace de estas cookies está sujeto a la{' '}
          <a
            href="https://policies.google.com/privacy"
            className="text-acento hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidad de Google
          </a>{' '}
          y a su política de cookies. La Trastienda no tiene control sobre estas cookies ni sobre
          los datos que Google pueda recopilar a través de ellas.
        </P>
        <P>
          Si deseas evitar las cookies de YouTube, puedes desactivar JavaScript para el dominio{' '}
          <code className="font-mono text-[13px] bg-tinta/5 px-1.5 py-0.5">youtube.com</code> o
          utilizar una extensión de bloqueo de contenidos en tu navegador.
        </P>
      </Section>

      <Section title="4. Gestión y configuración de cookies">
        <P>
          Puedes configurar tu navegador para bloquear o eliminar las cookies. A continuación
          encontrarás los enlaces de ayuda de los principales navegadores:
        </P>
        <ul className="space-y-2">
          <Li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              className="text-acento hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Chrome
            </a>
          </Li>
          <Li>
            <a
              href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
              className="text-acento hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mozilla Firefox
            </a>
          </Li>
          <Li>
            <a
              href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
              className="text-acento hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apple Safari
            </a>
          </Li>
          <Li>
            <a
              href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              className="text-acento hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Edge
            </a>
          </Li>
        </ul>
        <P>
          Ten en cuenta que bloquear las cookies técnicas de autenticación (Clerk) impedirá el
          acceso al Campus digital, ya que son imprescindibles para mantener tu sesión.
        </P>
      </Section>

      <Section title="5. Actualizaciones de esta política">
        <P>
          Podemos actualizar esta Política de Cookies si añadimos nuevas funcionalidades o
          integraciones de terceros. Te recomendamos revisarla periódicamente. Si tienes dudas,
          contáctanos en <strong>[EMAIL DE CONTACTO]</strong>.
        </P>
      </Section>

    </LegalLayout>
  )
}
