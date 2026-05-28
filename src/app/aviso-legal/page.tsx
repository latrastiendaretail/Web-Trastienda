import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Aviso Legal — La Trastienda',
  description: 'Información legal obligatoria sobre La Trastienda conforme a la Ley 34/2002 de Servicios de la Sociedad de la Información.',
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

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="font-sans text-[11px] text-cuero uppercase tracking-[0.1em]">{children}</span>
)

export default function AvisoLegalPage() {
  return (
    <LegalLayout title="Aviso Legal" lastUpdated="Mayo 2026">

      <Section title="1. Datos identificativos del responsable">
        <P>
          En cumplimiento de lo establecido en el artículo 10 de la Ley 34/2002, de 11 de julio,
          de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se
          facilitan los siguientes datos identificativos:
        </P>
        <div className="border border-lino/60 divide-y divide-lino/40">
          {[
            ['Denominación social', '[DENOMINACIÓN SOCIAL]'],
            ['CIF', '[CIF]'],
            ['Domicilio social', '[DOMICILIO SOCIAL]'],
            ['Correo electrónico', '[EMAIL DE CONTACTO]'],
            ['Actividad', 'Formación y orientación laboral en el sector del comercio minorista'],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-2 px-5 py-3 gap-4">
              <Highlight>{label}</Highlight>
              <span className="font-sans text-[14px] text-tinta/80">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="2. Objeto y ámbito de aplicación">
        <P>
          El presente Aviso Legal regula el acceso y uso del sitio web <strong>latrastienda.com</strong>{' '}
          (en adelante, «el Sitio Web») y del Campus digital accesible desde el mismo, titularidad de
          [DENOMINACIÓN SOCIAL].
        </P>
        <P>
          La Trastienda es una iniciativa de impacto social en el sector del comercio minorista cuyo
          objeto es la formación de personas en riesgo de exclusión y su conexión con empresas del
          sector retail. El acceso y uso del Sitio Web implica la aceptación plena y sin reservas de
          las condiciones contenidas en el presente Aviso Legal.
        </P>
      </Section>

      <Section title="3. Propiedad intelectual e industrial">
        <P>
          Todos los contenidos del Sitio Web —incluyendo, sin carácter limitativo, textos, fotografías,
          gráficos, imágenes, vídeos, logotipos, iconos, diseño gráfico y código fuente— son propiedad
          de [DENOMINACIÓN SOCIAL] o de terceros que han autorizado su uso, y están protegidos por las
          leyes españolas e internacionales de propiedad intelectual e industrial.
        </P>
        <P>
          Queda expresamente prohibida la reproducción, distribución, comunicación pública o
          transformación de cualquier contenido sin autorización escrita previa. La descarga de
          contenidos para uso personal y sin fines comerciales se permite siempre que se mantengan
          íntegros los avisos de derechos de autor.
        </P>
      </Section>

      <Section title="4. Exclusión de garantías y responsabilidad">
        <P>
          [DENOMINACIÓN SOCIAL] no garantiza la disponibilidad y continuidad ininterrumpida del Sitio
          Web, ni que sus contenidos estén actualizados en todo momento. En la medida en que lo permita
          la legislación aplicable, queda excluida toda responsabilidad por daños y perjuicios de
          cualquier naturaleza derivados de la imposibilidad de acceso o del uso del Sitio Web.
        </P>
        <P>
          El Sitio Web puede contener enlaces a páginas de terceros. [DENOMINACIÓN SOCIAL] no asume
          responsabilidad alguna sobre los contenidos, servicios, productos o cualquier otra
          información que figure en dichos sitios de terceros.
        </P>
      </Section>

      <Section title="5. Modificaciones y actualizaciones">
        <P>
          [DENOMINACIÓN SOCIAL] se reserva el derecho a modificar el presente Aviso Legal en
          cualquier momento. Las modificaciones serán efectivas desde su publicación en el Sitio Web.
          El uso continuado del Sitio Web tras la publicación de cambios implicará su aceptación.
        </P>
      </Section>

      <Section title="6. Ley aplicable y jurisdicción">
        <P>
          Las relaciones entre [DENOMINACIÓN SOCIAL] y los usuarios del Sitio Web se rigen por la
          legislación española vigente. Para la resolución de cualquier controversia derivada o
          relacionada con el uso del Sitio Web, las partes se someten, con renuncia expresa a
          cualquier otro fuero, a los Juzgados y Tribunales del domicilio del usuario cuando
          este tenga la consideración de consumidor, conforme al artículo 16 del TRLGDCU.
        </P>
      </Section>

    </LegalLayout>
  )
}
