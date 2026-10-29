export type FieldDef =
  | { id: string; label: string; type: 'text'; placeholder?: string }
  | { id: string; label: string; type: 'date' }
  | { id: string; label: string; type: 'textarea' }
  | { id: string; label: string; type: 'radio' | 'check'; options: string[] }

export interface FichaSection {
  title: string
  hint?: string
  fields: FieldDef[]
}

export interface FichaConfig {
  chapter: string
  title: string
  intro: string
  sections: FichaSection[]
  footer: string
  fileSlug: string
}

const TENDENCIA = ['Sube', 'Se mantiene', 'Baja']
const SI_NO = ['Sí', 'No']

const text = (id: string, label: string, placeholder?: string): FieldDef => ({ id, label, type: 'text', placeholder })
const area = (id: string, label: string): FieldDef => ({ id, label, type: 'textarea' })
const date = (id: string, label: string): FieldDef => ({ id, label, type: 'date' })
const radio = (id: string, label: string, options: string[]): FieldDef => ({ id, label, type: 'radio', options })
const check = (id: string, label: string, options: string[]): FieldDef => ({ id, label, type: 'check', options })

export const FICHAS: Record<string, FichaConfig> = {
  'semaforo-presupuesto': {
    chapter: '02',
    title: 'Semáforo de presupuesto',
    intro: 'Ficha guiada en 4 pasos. Tradúcela a euros y baja a las palancas que explican el cumplimiento.',
    fileSlug: 'semaforo-presupuesto',
    footer: 'Cumplir el objetivo no es entender el negocio.',
    sections: [
      {
        title: 'Resultado',
        fields: [
          text('venta', 'Venta €'), text('ppto', 'Presupuesto €'), text('cumplimiento', 'Cumplimiento %'),
          text('desvEur', 'Desviación €'), text('desvPct', 'Desviación %'), text('periodo', 'Periodo'),
        ],
      },
      {
        title: 'Contexto',
        fields: [
          text('n1', 'N-1 %'), text('historico', 'Histórico %'), text('cluster', 'Cluster %'),
          radio('tendencia', 'Tendencia', ['↑ Sube', '→ Estable', '↓ Baja']),
        ],
      },
      {
        title: 'Palancas',
        hint: 'Marca las palancas que explican la desviación.',
        fields: [check('palancas', 'Palancas', ['Tráfico', 'Conversión', 'UPT', 'PMU', 'Margen'])],
      },
      {
        title: 'Diagnóstico',
        fields: [
          area('diagnostico', '¿Voy bien o mal? ¿Por qué?'),
          area('cambiar', '¿Qué puedo cambiar?'),
          text('kpiAccion', 'KPI que medirá la acción'),
          date('revision', 'Fecha de revisión'),
        ],
      },
    ],
  },

  'checklist-n1': {
    chapter: '03',
    title: 'Checklist de comparabilidad N-1',
    intro: 'Ficha guiada en 3 pasos. Comprueba que los dos periodos son comparables antes de leer el dato.',
    fileSlug: 'checklist-n1',
    footer: 'No compares porcentajes. Compara situaciones.',
    sections: [
      {
        title: '¿Son comparables?',
        hint: 'Marca los factores que afectan a la comparación entre periodos.',
        fields: [
          check('factores', 'Factores', [
            'Días de apertura', 'Calendario y festivos', 'Promociones y campañas', 'Producto y lanzamientos',
            'Venta extraordinaria', 'Incidencias y clima', 'Categorización', 'Otros',
          ]),
        ],
      },
      {
        title: 'Aislar',
        fields: [
          area('aislo', 'Si algo no es comparable: qué aíslo y cuánto supone'),
          area('lectura', 'Cómo cambia la lectura una vez aislado'),
        ],
      },
      {
        title: 'Resultado',
        fields: [text('evolucion', 'Evolución vs N-1 %'), text('impacto', 'Impacto €'), text('periodo', 'Periodo')],
      },
    ],
  },

  'matriz-trafico': {
    chapter: '04',
    title: 'Matriz de análisis de tráfico',
    intro: 'Ficha guiada en 5 pasos. Distingue si el tráfico ha crecido o ha cambiado su distribución.',
    fileSlug: 'matriz-trafico',
    footer: 'El tráfico es oportunidad, no venta.',
    sections: [
      {
        title: 'Datos',
        fields: [text('periodo', 'Periodo'), text('trafico', 'Tráfico actual'), text('impacto', 'Impacto absoluto')],
      },
      {
        title: 'Evolución',
        fields: [text('n1', 'vs N-1 %'), text('historico', 'vs histórico %'), text('prevision', 'vs previsión %')],
      },
      {
        title: 'Distribución',
        fields: [
          text('diaMax', 'Día de mayor tráfico'), text('diaMin', 'Día de menor tráfico'),
          text('franjaMax', 'Franja de mayor tráfico'),
          radio('distCambia', '¿Ha cambiado la distribución?', SI_NO),
        ],
      },
      {
        title: 'Contexto',
        hint: 'Marca lo que aplique.',
        fields: [
          check('contexto', 'Contexto', [
            'Calendario', 'Festivo', 'Clima', 'Turismo', 'Evento', 'Obras', 'Huelga', 'Campaña', 'Incidencia técnica', 'Otro',
          ]),
        ],
      },
      {
        title: 'Decisión',
        fields: [
          area('diagnostico', '¿Es puntual o tendencia? ¿Ha crecido la demanda o ha cambiado su distribución?'),
          area('decision', 'Decisión que se toma (implicaciones para la planificación)'),
          date('revision', 'Fecha de revisión'),
          text('responsable', 'Responsable'),
        ],
      },
    ],
  },

  'mapa-conversion': {
    chapter: '05',
    title: 'Mapa de conversión',
    intro: 'Ficha guiada en 4 pasos. Pasa de «la conversión está mal» a saber dónde, por qué y qué cambiar.',
    fileSlug: 'mapa-conversion',
    footer: 'No corrijas el KPI. Corrige el comportamiento que lo provoca.',
    sections: [
      {
        title: 'Datos',
        fields: [
          text('conversion', 'Conversión actual %'), text('ppto', 'vs presupuesto %'), text('n1', 'vs N-1 %'),
          radio('tendencia', 'Tendencia 4 semanas', TENDENCIA),
        ],
      },
      {
        title: 'Franjas',
        fields: [
          text('mejor', 'Mejor franja'), text('peor', 'Peor franja'),
          area('donde', '¿Dónde se concentra el problema?'),
        ],
      },
      {
        title: 'Causa',
        hint: 'Marca lo que aplique.',
        fields: [
          check('problema', '¿Existe problema de…?', ['Cobertura', 'Orientación al cliente', 'Producto / stock', 'Factor externo']),
          area('causa', 'Causa principal detectada'),
        ],
      },
      {
        title: 'Acción',
        fields: [
          area('accion', 'Acción · qué vamos a cambiar'),
          text('responsable', 'Responsable'), date('revision', 'Fecha de revisión'),
          text('kpiSeguimiento', 'KPI de seguimiento'),
        ],
      },
    ],
  },

  'desmontando-cesta': {
    chapter: '06',
    title: 'Desmontando la cesta',
    intro: 'Ficha guiada en 5 pasos. Descompón la cesta en UPT, PMU y mix y valora su calidad.',
    fileSlug: 'desmontando-cesta',
    footer: 'No persigas una cesta media alta. Persigue una cesta de calidad.',
    sections: [
      {
        title: 'Resultado',
        fields: [
          text('cesta', 'Cesta actual €'), text('ppto', 'vs presupuesto %'), text('n1', 'vs N-1 %'),
          radio('tendencia', 'Tendencia', TENDENCIA),
        ],
      },
      {
        title: '¿De qué está hecha?',
        fields: [text('upt', 'UPT'), text('uptN1', 'UPT vs N-1 %'), text('pmu', 'PMU €'), text('pmuN1', 'PMU vs N-1 %')],
      },
      {
        title: 'Mix',
        fields: [
          text('crece', 'Familia que más crece'), text('cae', 'Familia que más cae'),
          radio('mixPvp', '¿Ha cambiado el mix de PVP?', SI_NO),
          radio('promo', '¿Existe promoción?', SI_NO),
        ],
      },
      {
        title: 'Calidad de la venta',
        hint: 'Marca lo que aplique.',
        fields: [
          check('calidad', 'Calidad', [
            'Se ganan unidades por ticket', 'Se pierden unidades por ticket', 'Se vende más caro', 'Se vende más barato',
            'Existe oportunidad de venta complementaria', 'Existe impacto relevante en margen',
          ]),
        ],
      },
      {
        title: 'Decisión',
        fields: [
          area('causa', 'Causa principal'), area('accion', 'Acción'),
          text('responsable', 'Responsable'), text('kpiSeguimiento', 'KPI de seguimiento'),
          date('revision', 'Fecha de revisión'),
        ],
      },
    ],
  },

  'mapa-upt': {
    chapter: '07',
    title: 'Mapa de oportunidades UPT',
    intro: 'Ficha guiada en 4 pasos. Trabaja el UPT producto a producto, con oportunidades A + B concretas.',
    fileSlug: 'mapa-upt',
    footer: 'No bajes el valor de lo que vendes para subir el UPT.',
    sections: [
      {
        title: 'Resultado',
        fields: [
          text('upt', 'UPT actual'), text('ppto', 'vs ppto.'), text('n1', 'vs N-1'),
          text('pmu', 'PMU'), text('cesta', 'Cesta'),
          radio('tendencia', 'Tendencia', TENDENCIA),
        ],
      },
      {
        title: 'Oportunidades A + B',
        hint: 'Identifica 3 oportunidades A + B.',
        fields: [1, 2, 3].flatMap((n): FieldDef[] => [
          text(`a${n}`, `Producto A · ${n}`), text(`b${n}`, `Producto B · ${n}`), text(`upt${n}`, `UPT actual · ${n}`),
          radio(`op${n}`, `Oportunidad · ${n}`, ['Alta', 'Media', 'Baja']),
        ]),
      },
      {
        title: 'Diagnóstico',
        fields: [
          area('donde', '¿Dónde está cayendo el UPT? ¿Qué oportunidades de venta complementaria existen?'),
          area('otros', '¿Qué hacen otras tiendas o el cluster? ¿Qué comportamiento se observa en el equipo?'),
        ],
      },
      {
        title: 'Plan',
        fields: [
          area('comportamiento', 'Comportamiento a modificar'), area('accion', 'Acción'),
          text('responsable', 'Responsable'), text('kpiSeguimiento', 'KPI de seguimiento'),
          date('revision', 'Fecha de revisión'),
        ],
      },
    ],
  },
}
