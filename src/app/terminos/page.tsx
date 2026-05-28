import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Términos y Condiciones — La Trastienda',
  description: 'Condiciones generales de uso del sitio web y Campus digital de La Trastienda.',
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

export default function TerminosPage() {
  return (
    <LegalLayout title="Términos y Condiciones" lastUpdated="Mayo 2026">

      <Section title="1. Objeto">
        <P>
          Los presentes Términos y Condiciones (en adelante, «Términos») regulan el acceso y uso
          del sitio web <strong>latrastienda.com</strong> y del Campus digital de La Trastienda
          (en adelante, «los Servicios»), cuya titularidad corresponde a [DENOMINACIÓN SOCIAL],
          con CIF [CIF] y domicilio en [DOMICILIO SOCIAL].
        </P>
        <P>
          El acceso o uso de cualquiera de los Servicios implica la aceptación plena y sin reservas
          de estos Términos. Si no estás de acuerdo con ellos, debes abstenerte de utilizar los
          Servicios.
        </P>
      </Section>

      <Section title="2. Acceso al Campus digital">
        <P>
          El Campus digital es un entorno formativo privado destinado a personas inscritas en los
          programas de La Trastienda. El acceso requiere registro previo y autenticación mediante
          credenciales personales.
        </P>
        <P>
          La inscripción en un programa formativo se entenderá formalizada cuando el usuario haya
          completado el proceso de registro y, en su caso, cuando La Trastienda haya confirmado
          el acceso. El usuario es responsable de mantener la confidencialidad de sus credenciales
          de acceso.
        </P>
        <ul className="space-y-2">
          <Li>El acceso es personal e intransferible.</Li>
          <Li>
            La Trastienda se reserva el derecho a suspender o cancelar el acceso en caso de uso
            fraudulento o contrario a estos Términos.
          </Li>
          <Li>
            Los contenidos formativos (vídeos, textos, materiales) están protegidos por derechos
            de propiedad intelectual y no pueden reproducirse ni distribuirse sin autorización.
          </Li>
        </ul>
      </Section>

      <Section title="3. Condiciones de uso">
        <P>
          El usuario se compromete a hacer un uso lícito y correcto de los Servicios, respetando
          la legislación vigente, la moral y el orden público. Queda expresamente prohibido:
        </P>
        <ul className="space-y-2">
          <Li>Reproducir, distribuir o comunicar públicamente los contenidos formativos sin autorización.</Li>
          <Li>Utilizar los Servicios para fines ilícitos, fraudulentos o contrarios a estos Términos.</Li>
          <Li>
            Intentar acceder a áreas o datos de otros usuarios, o interferir en el correcto
            funcionamiento de la plataforma.
          </Li>
          <Li>
            Compartir las credenciales de acceso con terceras personas.
          </Li>
        </ul>
      </Section>

      <Section title="4. Propiedad intelectual">
        <P>
          Todos los contenidos disponibles en los Servicios —incluyendo materiales formativos,
          vídeos, textos, diseño gráfico, logotipos y código— son propiedad de [DENOMINACIÓN SOCIAL]
          o de terceros que han licenciado su uso, y están protegidos por la legislación española
          e internacional en materia de propiedad intelectual.
        </P>
        <P>
          El usuario recibe una licencia de uso personal, no exclusiva, intransferible y revocable
          para acceder a los contenidos formativos únicamente con fines de aprendizaje. Cualquier
          otro uso requiere autorización escrita previa.
        </P>
      </Section>

      <Section title="5. Responsabilidades y garantías">
        <P>
          La Trastienda realizará sus mejores esfuerzos para garantizar la disponibilidad y calidad
          de los Servicios, pero no garantiza un acceso ininterrumpido ni libre de errores. En la
          medida permitida por la legislación aplicable, La Trastienda no será responsable de:
        </P>
        <ul className="space-y-2">
          <Li>Interrupciones o fallos técnicos ajenos a su control.</Li>
          <Li>Daños indirectos, pérdida de datos o pérdidas económicas derivadas del uso de los Servicios.</Li>
          <Li>Contenidos de terceros accesibles a través de enlaces o reproductores integrados.</Li>
        </ul>
      </Section>

      <Section title="6. Modificaciones de los Términos">
        <P>
          La Trastienda podrá modificar estos Términos en cualquier momento publicando la nueva versión
          en esta página. Si la modificación afecta de manera sustancial a los derechos del usuario,
          se le notificará con antelación razonable. El uso continuado de los Servicios tras la
          publicación de los cambios implica su aceptación.
        </P>
      </Section>

      <Section title="7. Nulidad parcial">
        <P>
          Si alguna cláusula de estos Términos fuera declarada nula o inaplicable, las restantes
          cláusulas mantendrán su plena vigencia y eficacia.
        </P>
      </Section>

      <Section title="8. Ley aplicable y jurisdicción">
        <P>
          Estos Términos se rigen por la legislación española. Para la resolución de cualquier
          controversia derivada de los Servicios, las partes se someten a los Juzgados y Tribunales
          competentes conforme a la normativa vigente, sin perjuicio del fuero que pudiera
          corresponder al usuario en su condición de consumidor.
        </P>
        <P>
          Si tienes cualquier duda sobre estos Términos, puedes contactar con nosotros en{' '}
          <strong>[EMAIL DE CONTACTO]</strong>.
        </P>
      </Section>

    </LegalLayout>
  )
}
