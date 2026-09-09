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
    <div className="max-w-4xl">
      <div className="mb-6 border border-lino bg-tinta text-papel px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em]">
        Previo — estructura del curso, sin conectar a Supabase todavía
      </div>

      <a
        href="/campus/cursos"
        className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200"
      >
        ← Todos los cursos
      </a>

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.16em]">Formación intensiva</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] border text-acento border-acento/40 px-2 py-0.5">
            Próximamente
          </span>
        </div>
        <h1 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-4">
          Del aula a la tienda
        </h1>
        <p className="font-sans text-base text-cuero leading-relaxed max-w-[58ch]">
          Lo que nadie te cuenta sobre trabajar en retail — 6 vídeos cortos y un repaso final con
          ejercicios para fijar cada idea.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border border-lino/50 divide-y md:divide-y-0 md:divide-x divide-lino/30 mb-10">
        <div className="px-4 py-5 bg-blanco">
          <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-1.5">Formato</div>
          <div className="font-sans text-[12px] font-medium text-tinta leading-snug">Online</div>
        </div>
        <div className="px-4 py-5 bg-blanco">
          <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-1.5">Duración</div>
          <div className="font-sans text-[12px] font-medium text-tinta leading-snug">
            6 vídeos · ~{totalVideoMin} min + repaso
          </div>
        </div>
        <div className="px-4 py-5 bg-blanco">
          <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-1.5">Repaso</div>
          <div className="font-sans text-[12px] font-medium text-acento leading-snug">80% para superar</div>
        </div>
        <div className="px-4 py-5 bg-blanco">
          <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-1.5">Enfoque</div>
          <div className="font-sans text-[12px] font-medium text-tinta leading-snug">Charla + ejercicios</div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-lino/40" />
          <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.14em] shrink-0">
            6 vídeos + repaso final
          </span>
          <div className="h-px flex-1 bg-lino/40" />
        </div>

        <div className="space-y-3">
          {VIDEOS.map((v) => (
            <div
              key={v.n}
              className="flex items-center gap-5 bg-blanco border border-lino/50 px-6 py-5 opacity-70 select-none"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-medium bg-tinta text-papel">
                {v.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-sm font-medium text-tinta leading-snug">{v.title}</div>
                <div className="font-sans text-[11px] text-cuero mt-0.5 leading-relaxed max-w-[60ch]">{v.desc}</div>
              </div>
              <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.08em] shrink-0">
                {v.duration}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-cuero/40 shrink-0"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          ))}

          <a
            href="/campus/demo-del-aula-a-la-tienda"
            className="flex items-center gap-5 bg-blanco border border-acento/40 px-6 py-5 hover:border-acento transition-colors duration-200 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-medium bg-acento/10 text-acento border border-acento/30">
              ★
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-sm font-medium text-tinta leading-snug">Repaso final — lecciones, ejercicios y tipo test</div>
              <div className="font-sans text-[11px] text-cuero mt-0.5 leading-relaxed max-w-[60ch]">
                El módulo interactivo ya construido: fija cada idea de los 6 vídeos y cierra con el
                tipo test (80% para completar el curso).
              </div>
            </div>
            <span className="font-mono text-[13px] text-acento group-hover:text-tinta transition-colors shrink-0">
              →
            </span>
          </a>
        </div>
      </div>

      <div className="border border-lino/50 bg-blanco px-6 py-8">
        <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-1.5">Pendiente para producción</div>
        <ul className="font-sans text-[12px] text-cuero leading-relaxed list-disc pl-4 space-y-1">
          <li>Grabar y subir los 6 vídeos, sustituir estas tarjetas por lecciones reales (video_url en Supabase).</li>
          <li>Decidir si el repaso vive como bloque final del mismo curso o como módulo aparte con su propio gate.</li>
          <li>Certificado solo se emite si: 6 vídeos vistos + repaso superado (80%).</li>
        </ul>
      </div>
    </div>
  )
}
