import { Icon, Watermark } from '@/components/campus/academia/icons'

const resourceCategories = [
  {
    category: 'Plantillas',
    resources: [
      { title: 'Checklist apertura de tienda', type: 'PDF', pages: '2 págs.' },
      { title: 'Plantilla planograma básico', type: 'PDF', pages: '4 págs.' },
      { title: 'Registro de incidencias de almacén', type: 'PDF', pages: '1 pág.' },
    ],
  },
  {
    category: 'Guías prácticas',
    resources: [
      { title: 'Guía de atención al cliente en Retail', type: 'PDF', pages: '12 págs.' },
      { title: 'Manual de prevención de pérdidas', type: 'PDF', pages: '8 págs.' },
    ],
  },
  {
    category: 'Materiales formativos',
    resources: [
      { title: 'Glosario del sector Retail', type: 'PDF', pages: '6 págs.' },
      { title: 'Esquemas de visual merchandising', type: 'PDF', pages: '10 págs.' },
    ],
  },
]

export default function RecursosPage() {
  const totalResources = resourceCategories.reduce((sum, c) => sum + c.resources.length, 0)

  return (
    <div className="max-w-5xl">
      <div className="relative mb-14 pb-10 border-b border-lino/50 overflow-hidden">
        <Watermark text={String(totalResources).padStart(2, '0')} className="text-[16rem] -right-6 -top-16 md:text-[20rem]" />
        <span className="relative block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          Biblioteca
        </span>
        <h1 className="relative font-display text-[clamp(2.25rem,5vw,4rem)] font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-4">
          Recursos
        </h1>
        <p className="relative font-sans text-base text-cuero leading-relaxed max-w-[52ch]">
          Plantillas, guías y materiales de apoyo para tu desarrollo profesional en Retail.
        </p>
      </div>

      <div className="space-y-12">
        {resourceCategories.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-4 mb-5">
              <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.14em] shrink-0">
                {cat.category}
              </span>
              <div className="h-px flex-1 bg-lino/40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.resources.map((res) => (
                <div
                  key={res.title}
                  className="flex items-center justify-between bg-blanco border border-lino/50 px-5 py-4 opacity-50 select-none"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-9 h-11 bg-lino/30 border border-lino/50 flex items-end justify-center pb-1 shrink-0 overflow-hidden">
                      <Icon name="leccion" className="absolute -top-1 -right-1 w-6 h-6 text-cuero/20" />
                      <span className="relative font-mono text-[7px] text-cuero uppercase tracking-[0.06em]">
                        {res.type}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="block font-sans text-sm font-medium text-tinta truncate">
                        {res.title}
                      </span>
                      <span className="font-mono text-[10px] text-cuero uppercase tracking-[0.08em]">
                        {res.pages}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.1em] border border-lino/60 px-2 py-1 shrink-0">
                    Próximamente
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
