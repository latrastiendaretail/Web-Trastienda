/**
 * Previo del curso completo "Del aula a la tienda": 6 vídeos + repaso final interactivo.
 * Mockup estático (sin Supabase) — misma estructura visual que cursos/[slug]/page.tsx real,
 * para validar cómo encaja el módulo interactivo (src/app/campus/demo-del-aula-a-la-tienda)
 * como cierre del curso.
 */
const VIDEOS = [
  {
    n: 1,
    title: 'Bienvenida — lo que realmente ocurre en una tienda',
    desc: 'Por qué el día a día de retail va mucho más allá de cobrar, colocar y reponer.',
    duration: '7 min',
  },
  {
    n: 2,
    title: 'Los primeros 30 días',
    desc: 'Qué mira de verdad un responsable al principio, y los 5 errores que frenan carreras.',
    duration: '8 min',
  },
  {
    n: 3,
    title: 'Vendedor normal vs. vendedor excelente',
    desc: 'La diferencia no es el don de gentes — es una forma distinta de entender el rol.',
    duration: '6 min',
  },
  {
    n: 4,
    title: 'Cómo se asciende',
    desc: 'La trayectoria real en retail y qué buscan las empresas en cada fase del proceso.',
    duration: '9 min',
  },
  {
    n: 5,
    title: 'El retail del futuro',
    desc: 'IA, omnicanalidad y por qué las personas siguen siendo el centro del sector.',
    duration: '7 min',
  },
  {
    n: 6,
    title: 'Cierre — tu plan a 5 años',
    desc: 'Antes del repaso: dónde quieres estar, y qué puedes empezar a hacer mañana.',
    duration: '5 min',
  },
]

export default function DemoCursoDelAulaALaTiendaPage() {
  const totalVideoMin = VIDEOS.reduce((acc, v) => acc + parseInt(v.duration, 10), 0)

  return (
    <div className="max-w-[760px] mx-auto">
      <p className="mb-8 border border-lino bg-blanco px-5 py-3 font-sans text-[15px] text-tinta/75">
        Previo: estructura del curso, sin conectar a Supabase todavía.
      </p>

      <a href="/campus/cursos" className="font-sans text-[15px] text-tinta/60 hover:text-tinta transition-colors duration-200">
        ← Todos los cursos
      </a>

      <header className="mt-8 mb-12">
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium text-tinta leading-[1.08] tracking-[-0.02em] mb-5">
          Del aula a la tienda
        </h1>
        <p className="font-sans text-[18px] text-tinta/75 leading-relaxed mb-5">
          Lo que nadie te cuenta sobre trabajar en retail: 6 vídeos cortos y un repaso final con ejercicios para fijar cada idea.
        </p>
        <p className="font-sans text-[15px] text-tinta/60">
          Online · 6 vídeos, unos {totalVideoMin} min · Repaso: 80% para superar
        </p>
      </header>

      <section className="mb-14" aria-labelledby="contenido">
        <h2 id="contenido" className="font-display text-2xl font-medium text-tinta mb-2">
          Contenido
        </h2>
        <ol className="border-t border-lino mt-4">
          {VIDEOS.map((v) => (
            <li key={v.n} className="border-b border-lino">
              <div className="flex items-start gap-4 py-5 opacity-70 select-none">
                <span className="font-display text-[26px] text-tinta/35 w-9 shrink-0 leading-none pt-0.5">{v.n}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-[17px] font-medium text-tinta leading-snug">{v.title}</div>
                  <p className="font-sans text-[15px] text-tinta/65 mt-1 leading-relaxed max-w-[60ch]">{v.desc}</p>
                </div>
                <span className="font-sans text-[14px] text-tinta/60 shrink-0 pt-0.5">{v.duration}</span>
              </div>
            </li>
          ))}
          <li className="border-b border-lino">
            <a href="/campus/demo-del-aula-a-la-tienda" className="flex items-start gap-4 py-5 group cursor-pointer">
              <span className="font-display text-[26px] text-acento w-9 shrink-0 leading-none pt-0.5">+</span>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-[17px] font-medium text-tinta leading-snug">
                  Repaso final: lecciones, ejercicios y test
                </div>
                <p className="font-sans text-[15px] text-tinta/65 mt-1 leading-relaxed max-w-[60ch]">
                  Fija cada idea de los 6 vídeos y cierra con el test (80% para completar el curso).
                </p>
              </div>
              <span className="font-sans text-tinta/40 group-hover:text-tinta transition-colors duration-200 mt-0.5" aria-hidden="true">→</span>
            </a>
          </li>
        </ol>
      </section>

      <section aria-labelledby="pendiente">
        <h2 id="pendiente" className="font-display text-xl font-medium text-tinta mb-3">
          Pendiente para producción
        </h2>
        <ul className="font-sans text-[15px] text-tinta/70 leading-relaxed list-disc pl-5 space-y-1.5">
          <li>Grabar y subir los 6 vídeos, y sustituir estas filas por lecciones reales (video_url en Supabase).</li>
          <li>Decidir si el repaso vive como bloque final del mismo curso o como módulo aparte con su propio gate.</li>
          <li>El certificado solo se emite con los 6 vídeos vistos y el repaso superado (80%).</li>
        </ul>
      </section>
    </div>
  )
}
