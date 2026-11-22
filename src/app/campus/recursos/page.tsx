import { Icon } from '@/components/campus/academia/icons'

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
  return (
    <div>
      <header className="mb-12">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-3">
          Recursos
        </h1>
        <p className="font-sans text-[17px] text-tinta/70 leading-relaxed max-w-[56ch]">
          Plantillas, guías y materiales de apoyo. Disponibles próximamente.
        </p>
      </header>

      <div className="space-y-12">
        {resourceCategories.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-4 mb-5">
              <span className="font-display text-xl font-medium text-tinta shrink-0">
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
                      <Icon name="leccion" className="absolute -top-1 -right-1 w-6 h-6 text-tinta/10" />
                      <span className="relative font-sans text-[10px] font-medium text-tinta/60">
                        {res.type}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="block font-sans text-sm font-medium text-tinta truncate">
                        {res.title}
                      </span>
                      <span className="font-sans text-[14px] text-tinta/60">
                        {res.pages}
                      </span>
                    </div>
                  </div>
                  <span className="font-sans text-[14px] text-tinta/60 shrink-0">
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
