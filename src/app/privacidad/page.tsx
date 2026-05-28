import type { Metadata } from 'next'
import LegalLayout from '@/components/legal/LegalLayout'

export const metadata: Metadata = {
  title: 'Política de Privacidad — La Trastienda',
  description: 'Información sobre el tratamiento de datos personales en La Trastienda conforme al RGPD y la LOPD-GDD.',
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

const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-6">
    <h3 className="font-sans text-[11px] text-cuero uppercase tracking-[0.1em] mb-3">{title}</h3>
    <div className="space-y-3 pl-4 border-l-2 border-lino/50">{children}</div>
  </div>
)

const Li = ({ children }: { children: React.ReactNode }) => (
  <li className="font-sans text-[15px] text-tinta/80 leading-relaxed flex gap-2">
    <span className="text-acento mt-1 shrink-0">—</span>
    <span>{children}</span>
  </li>
)

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de Privacidad" lastUpdated="Mayo 2026">

      <div className="mb-12 p-6 border border-acento/30 bg-acento/5">
        <p className="font-sans text-[14px] text-tinta/70 leading-relaxed">
          En La Trastienda respetamos tu privacidad. Esta política explica qué datos personales
          recogemos, con qué finalidad y cómo puedes ejercer tus derechos conforme al{' '}
          <strong>Reglamento (UE) 2016/679 (RGPD)</strong> y la{' '}
          <strong>Ley Orgánica 3/2018 (LOPD-GDD)</strong>.
        </p>
      </div>

      <Section title="1. Responsable del tratamiento">
        <P>
          El responsable del tratamiento de sus datos personales es:
        </P>
        <div className="border border-lino/60 divide-y divide-lino/40">
          {[
            ['Denominación social', '[DENOMINACIÓN SOCIAL]'],
            ['CIF', '[CIF]'],
            ['Domicilio', '[DOMICILIO SOCIAL]'],
            ['Correo electrónico', '[EMAIL DE CONTACTO]'],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-2 px-5 py-3 gap-4">
              <span className="font-sans text-[11px] text-cuero uppercase tracking-[0.1em]">{label}</span>
              <span className="font-sans text-[14px] text-tinta/80">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="2. Datos personales que tratamos">
        <P>
          Según la forma en que interactúes con nuestra plataforma, tratamos las siguientes
          categorías de datos:
        </P>

        <SubSection title="Formulario de contacto">
          <ul className="space-y-2">
            <Li>Nombre y correo electrónico</Li>
            <Li>Tipo de audiencia (Particular, Empresa o Institución)</Li>
            <Li>Contenido del mensaje</Li>
          </ul>
        </SubSection>

        <SubSection title="Campus digital (registro y acceso)">
          <ul className="space-y-2">
            <Li>Nombre, dirección de correo electrónico e imagen de perfil (gestionados por Clerk)</Li>
            <Li>Progreso formativo: lecciones completadas y tiempo de visionado</Li>
            <Li>Datos de inscripción a cursos</Li>
          </ul>
        </SubSection>

        <SubSection title="Navegación en el sitio web">
          <ul className="space-y-2">
            <Li>
              Datos técnicos estrictamente necesarios para el funcionamiento del sitio (sesión de
              autenticación). No utilizamos herramientas de analítica ni publicidad comportamental.
            </Li>
          </ul>
        </SubSection>
      </Section>

      <Section title="3. Finalidades y bases jurídicas del tratamiento">
        <div className="overflow-x-auto">
          <table className="w-full border border-lino/60 text-[13px]">
            <thead>
              <tr className="bg-tinta/5 border-b border-lino/60">
                <th className="text-left px-4 py-3 font-sans font-medium text-[10px] text-cuero uppercase tracking-[0.08em]">Finalidad</th>
                <th className="text-left px-4 py-3 font-sans font-medium text-[10px] text-cuero uppercase tracking-[0.08em]">Base jurídica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lino/40">
              {[
                ['Atender tu solicitud de contacto', 'Interés legítimo del responsable (art. 6.1.f RGPD)'],
                ['Gestionar tu acceso al Campus digital', 'Ejecución de una relación contractual/formativa (art. 6.1.b RGPD)'],
                ['Registrar el progreso formativo', 'Ejecución de la relación formativa (art. 6.1.b RGPD)'],
                ['Comunicaciones sobre el servicio', 'Interés legítimo / consentimiento (art. 6.1.a y 6.1.f RGPD)'],
              ].map(([fin, base]) => (
                <tr key={fin} className="hover:bg-tinta/[0.02] transition-colors">
                  <td className="px-4 py-3 font-sans text-tinta/80 leading-snug">{fin}</td>
                  <td className="px-4 py-3 font-sans text-tinta/60 leading-snug">{base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="4. Transferencias internacionales de datos">
        <P>
          Para la prestación de nuestros servicios utilizamos los siguientes proveedores que pueden
          tratar datos fuera del Espacio Económico Europeo:
        </P>
        <ul className="space-y-3 mt-2">
          <Li>
            <strong>Clerk Technologies, Inc.</strong> (EEUU) — gestión de identidad y autenticación.
            Las transferencias se amparan en las garantías adecuadas previstas en el RGPD (Cláusulas
            Contractuales Tipo o decisión de adecuación).
          </Li>
          <Li>
            <strong>Supabase, Inc.</strong> — base de datos y almacenamiento de progreso formativo.
            Los datos se almacenan en servidores dentro de la UE cuando así está configurado.
          </Li>
          <Li>
            <strong>Google LLC / YouTube</strong> (EEUU) — reproducción de vídeos formativos embebidos.
            La interacción con los reproductores puede implicar la transmisión de datos a Google
            conforme a su propia política de privacidad.
          </Li>
        </ul>
      </Section>

      <Section title="5. Conservación de los datos">
        <ul className="space-y-3">
          <Li>
            <strong>Formulario de contacto:</strong> los datos se conservan durante el tiempo necesario
            para atender la solicitud y, en su caso, durante los plazos de prescripción legal
            aplicables (máximo 3 años).
          </Li>
          <Li>
            <strong>Campus digital:</strong> los datos de acceso y progreso se conservan mientras
            mantengas una cuenta activa. Tras la baja, se eliminan en un plazo máximo de 6 meses,
            salvo obligación legal de conservación.
          </Li>
        </ul>
      </Section>

      <Section title="6. Derechos de los interesados">
        <P>
          Puedes ejercer en cualquier momento los siguientes derechos reconocidos por el RGPD y
          la LOPD-GDD:
        </P>
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          {[
            ['Acceso', 'Conocer qué datos tratamos sobre ti.'],
            ['Rectificación', 'Corregir datos inexactos o incompletos.'],
            ['Supresión', 'Solicitar la eliminación de tus datos.'],
            ['Oposición', 'Oponerte al tratamiento basado en interés legítimo.'],
            ['Limitación', 'Restringir el tratamiento en determinados supuestos.'],
            ['Portabilidad', 'Recibir tus datos en formato estructurado.'],
          ].map(([right, desc]) => (
            <div key={right} className="border border-lino/60 px-4 py-4">
              <span className="block font-sans text-[10px] text-cuero uppercase tracking-[0.1em] mb-1">{right}</span>
              <span className="font-sans text-[14px] text-tinta/70">{desc}</span>
            </div>
          ))}
        </div>
        <P>
          Para ejercer cualquiera de estos derechos, dirígete a <strong>[EMAIL DE CONTACTO]</strong>{' '}
          adjuntando copia de tu documento de identidad. Tienes derecho a presentar una reclamación
          ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong>{' '}
          en <a href="https://www.aepd.es" className="text-acento hover:underline" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.
        </P>
      </Section>

      <Section title="7. Seguridad de los datos">
        <P>
          Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos personales
          frente a accesos no autorizados, pérdida o destrucción accidental. Entre ellas:
          comunicaciones cifradas mediante TLS, autenticación segura gestionada por Clerk, y
          control de acceso mediante Row Level Security (RLS) en nuestra base de datos.
        </P>
      </Section>

      <Section title="8. Cambios en esta política">
        <P>
          Podemos actualizar esta Política de Privacidad para reflejar cambios legales o en
          nuestros servicios. Publicaremos la nueva versión en esta misma página con la fecha de
          última actualización. Te recomendamos revisarla periódicamente.
        </P>
      </Section>

    </LegalLayout>
  )
}
