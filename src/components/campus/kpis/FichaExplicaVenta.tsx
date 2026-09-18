'use client'

import { useState } from 'react'

interface FichaState {
  venta: string
  vsN1: string
  vsPpto: string
  impacto: string
  tienda: string
  periodo: string
  trafico: string
  conversion: string
  cesta: string
  upt: string
  pmu: string
  devoluciones: string
  hipotesis: string
  evidencia: string
  tipo: 'Puntual' | 'Tendencia' | 'Todavía no lo sé' | ''
  accion: string
  kpiSeguimiento: string
  fechaRevision: string
}

const EMPTY: FichaState = {
  venta: '', vsN1: '', vsPpto: '', impacto: '', tienda: '', periodo: '',
  trafico: '', conversion: '', cesta: '', upt: '', pmu: '', devoluciones: '',
  hipotesis: '', evidencia: '', tipo: '',
  accion: '', kpiSeguimiento: '', fechaRevision: '',
}

const STEPS = ['Datos', 'Qué ha pasado', 'Lectura', 'Compromiso'] as const

const inputClass =
  'w-full bg-transparent border-b border-lino/60 focus:border-acento outline-none py-1.5 font-sans text-[13px] text-tinta placeholder:text-cuero/40 transition-colors duration-150'
const labelClass = 'font-mono text-[9px] text-cuero uppercase tracking-[0.1em] block mb-1'

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}

export default function FichaExplicaVenta() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [f, setF] = useState<FichaState>(EMPTY)
  const [generating, setGenerating] = useState(false)

  function set<K extends keyof FichaState>(key: K, value: FichaState[K]) {
    setF((prev) => ({ ...prev, [key]: value }))
  }

  async function handleDownload() {
    setGenerating(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const marginX = 48
      let y = 56

      const acento = '#b06a3a'
      const tinta = '#1c1a17'
      const cuero = '#6b6058'

      doc.setTextColor(tinta)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text('LA TRASTIENDA · MANUAL DE KPIS', marginX, y)
      y += 28

      doc.setFontSize(20)
      doc.text('Ficha del capítulo 01 — Explica tu venta', marginX, y)
      y += 24

      doc.setDrawColor(acento)
      doc.setLineWidth(1)
      doc.line(marginX, y, 548, y)
      y += 24

      const row = (pairs: [string, string][]) => {
        const colW = (548 - marginX) / pairs.length
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(cuero)
        pairs.forEach(([label], i) => {
          doc.text(label.toUpperCase(), marginX + i * colW, y)
        })
        y += 14
        doc.setFontSize(12)
        doc.setTextColor(tinta)
        pairs.forEach(([, value], i) => {
          doc.text(value || '—', marginX + i * colW, y)
        })
        y += 22
      }

      row([['Venta €', f.venta], ['vs N-1 %', f.vsN1], ['vs Ppto %', f.vsPpto]])
      row([['Impacto €', f.impacto], ['Tienda', f.tienda], ['Periodo', f.periodo]])

      y += 4
      doc.setDrawColor('#e5ded2')
      doc.line(marginX, y, 548, y)
      y += 20

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(tinta)
      doc.text('¿Qué ha pasado?', marginX, y)
      y += 20

      row([['Tráfico', f.trafico], ['Conversión', f.conversion], ['Cesta', f.cesta]])
      row([['UPT', f.upt], ['PMU', f.pmu], ['Devoluciones', f.devoluciones]])

      y += 4
      doc.line(marginX, y, 548, y)
      y += 20

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('Lectura', marginX, y)
      y += 20

      const wrapField = (label: string, value: string) => {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(cuero)
        doc.text(label.toUpperCase(), marginX, y)
        y += 14
        doc.setFontSize(11)
        doc.setTextColor(tinta)
        const lines = doc.splitTextToSize(value || '—', 500)
        doc.text(lines, marginX, y)
        y += lines.length * 14 + 10
      }

      wrapField('Hipótesis principal', f.hipotesis)
      wrapField('Evidencia que la confirma', f.evidencia)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(cuero)
      doc.text('¿ES PUNTUAL O TENDENCIA?', marginX, y)
      y += 14
      doc.setFontSize(12)
      doc.setTextColor(tinta)
      doc.text(f.tipo || '—', marginX, y)
      y += 24

      doc.line(marginX, y, 548, y)
      y += 20

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('Compromiso', marginX, y)
      y += 20

      wrapField('Acción', f.accion)
      row([['KPI de seguimiento', f.kpiSeguimiento], ['Fecha de revisión', f.fechaRevision], ['', '']])

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(cuero)
      doc.text('Esta ficha obliga al Store Manager a explicar el dato antes de actuar.', marginX, 780)

      const fecha = new Date().toISOString().slice(0, 10)
      doc.save(`explica-tu-venta-${fecha}.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  if (!open) {
    return (
      <div className="border border-lino/50 bg-blanco px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] text-acento uppercase tracking-[0.12em] block mb-1">
            Herramienta interactiva · Capítulo 01
          </span>
          <h3 className="font-display text-lg text-tinta mb-1">Explica tu venta</h3>
          <p className="font-sans text-[12px] text-cuero leading-relaxed max-w-[52ch]">
            Ficha guiada en 4 pasos. Complétala cuando exista una desviación relevante en tu venta.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 font-mono text-[11px] font-medium text-papel bg-acento px-5 min-h-[40px] flex items-center uppercase tracking-[0.08em] hover:bg-acento-deep transition-colors duration-200 cursor-pointer"
        >
          Abrir ficha →
        </button>
      </div>
    )
  }

  return (
    <div className="border border-lino/50 bg-blanco">
      <div className="px-6 py-4 border-b border-lino/50 flex items-center justify-between">
        <div>
          <span className="font-mono text-[9px] text-acento uppercase tracking-[0.12em] block mb-1">
            Herramienta interactiva · Capítulo 01
          </span>
          <h3 className="font-display text-lg text-tinta">Explica tu venta</h3>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
        >
          Cerrar
        </button>
      </div>

      {/* Progress steps */}
      <div className="flex items-center px-6 pt-5">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => setStep(i)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] shrink-0 transition-colors duration-150 ${
                  i === step
                    ? 'bg-acento text-papel'
                    : i < step
                      ? 'bg-tinta text-papel'
                      : 'bg-lino/50 text-cuero'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </span>
              <span
                className={`hidden sm:inline font-mono text-[9px] uppercase tracking-[0.08em] transition-colors duration-150 ${
                  i === step ? 'text-tinta' : 'text-cuero/60 group-hover:text-cuero'
                }`}
              >
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-lino/50 mx-3" />}
          </div>
        ))}
      </div>

      <div className="px-6 py-6 min-h-[280px]">
        {step === 0 && (
          <div className="space-y-4">
            <p className="font-sans text-[12px] text-cuero leading-relaxed max-w-[60ch]">
              Completa esta ficha cada vez que exista una desviación relevante en la venta de tu tienda.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Venta €" value={f.venta} onChange={(v) => set('venta', v)} placeholder="0" />
              <Field label="vs N-1 %" value={f.vsN1} onChange={(v) => set('vsN1', v)} placeholder="0" />
              <Field label="vs PPTO %" value={f.vsPpto} onChange={(v) => set('vsPpto', v)} placeholder="0" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Impacto €" value={f.impacto} onChange={(v) => set('impacto', v)} placeholder="0" />
              <Field label="Tienda" value={f.tienda} onChange={(v) => set('tienda', v)} />
              <Field label="Periodo" value={f.periodo} onChange={(v) => set('periodo', v)} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Tráfico" value={f.trafico} onChange={(v) => set('trafico', v)} />
              <Field label="Conversión" value={f.conversion} onChange={(v) => set('conversion', v)} />
              <Field label="Cesta" value={f.cesta} onChange={(v) => set('cesta', v)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="UPT" value={f.upt} onChange={(v) => set('upt', v)} />
              <Field label="PMU" value={f.pmu} onChange={(v) => set('pmu', v)} />
              <Field label="Devoluciones" value={f.devoluciones} onChange={(v) => set('devoluciones', v)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className={labelClass}>Hipótesis principal</span>
              <textarea
                value={f.hipotesis}
                onChange={(e) => set('hipotesis', e.target.value)}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <span className={labelClass}>Evidencia que la confirma</span>
              <textarea
                value={f.evidencia}
                onChange={(e) => set('evidencia', e.target.value)}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <span className={labelClass}>¿Es puntual o tendencia?</span>
              <div className="flex flex-wrap gap-4 mt-1">
                {(['Puntual', 'Tendencia', 'Todavía no lo sé'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 font-sans text-[12px] text-tinta cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      checked={f.tipo === opt}
                      onChange={() => set('tipo', opt)}
                      className="accent-acento"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className={labelClass}>Acción</span>
              <textarea
                value={f.accion}
                onChange={(e) => set('accion', e.target.value)}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="KPI de seguimiento" value={f.kpiSeguimiento} onChange={(v) => set('kpiSeguimiento', v)} />
              <Field label="Fecha de revisión" value={f.fechaRevision} onChange={(v) => set('fechaRevision', v)} type="date" />
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-lino/50 flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step === 0 ? setF(EMPTY) : setStep(step - 1))}
          className="font-mono text-[10px] text-cuero hover:text-tinta uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
        >
          {step === 0 ? 'Vaciar ficha' : '← Atrás'}
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="font-mono text-[11px] font-medium text-tinta border border-tinta/30 px-5 min-h-[40px] flex items-center uppercase tracking-[0.08em] hover:border-tinta transition-colors duration-200 cursor-pointer"
          >
            Siguiente →
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDownload}
            disabled={generating}
            className="font-mono text-[11px] font-medium text-papel bg-acento px-5 min-h-[40px] flex items-center uppercase tracking-[0.08em] hover:bg-acento-deep transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generando...' : 'Descargar PDF →'}
          </button>
        )}
      </div>
    </div>
  )
}
