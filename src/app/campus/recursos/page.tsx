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
    <div className="max-w-4xl">
      <div className="mb-12">
        <span className="block font-sans text-[9px] text-cuero uppercase tracking-[0.16em] mb-3">
          Biblioteca
        </span>
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-3">
          Recursos
        </h1>
        <p className="font-sans text-base text-cuero leading-relaxed max-w-[52ch]">
          Plantillas, guías y materiales de apoyo para tu desarrollo profesional en Retail.
        </p>
      </div>

      <div className="space-y-10">
        {resourceCategories.map((cat) => (
          <div key={cat.category}>
            <div className="font-sans text-[10px] text-cuero uppercase tracking-[0.14em] mb-4 pb-3 border-b border-lino/40">
              {cat.category}
            </div>
            <div className="space-y-3">
              {cat.resources.map((res) => (
                <div
                  key={res.title}
                  className="flex items-center justify-between bg-blanco border border-lino/50 px-6 py-5 opacity-50 select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-10 bg-lino/30 border border-lino/50 flex items-end justify-center pb-1 shrink-0">
                      <span className="font-sans text-[7px] text-cuero uppercase tracking-[0.06em]">
                        {res.type}
                      </span>
                    </div>
                    <div>
                      <span className="block font-sans text-sm font-medium text-tinta">
                        {res.title}
                      </span>
                      <span className="font-sans text-[10px] text-cuero uppercase tracking-[0.08em]">
                        {res.pages}
                      </span>
                    </div>
                  </div>
                  <span className="font-sans text-[9px] text-cuero uppercase tracking-[0.1em] border border-lino/60 px-2 py-1 shrink-0">
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
