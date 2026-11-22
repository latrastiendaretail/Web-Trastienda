'use client'

import { useState } from 'react'
import type { FichaConfig, FieldDef } from './fichas'

type Value = string | string[]

const inputClass =
  'w-full bg-transparent border-b border-tinta/30 focus:border-acento outline-none py-2 font-sans text-[16px] text-tinta placeholder:text-tinta/35 transition-colors duration-150'
const labelClass = 'font-sans text-[14px] text-tinta/70 block mb-1'

export default function FichaKpi({ config }: { config: FichaConfig }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Record<string, Value>>({})
  const [generating, setGenerating] = useState(false)

  const steps = config.sections
  const str = (id: string) => (typeof values[id] === 'string' ? (values[id] as string) : '')
  const list = (id: string) => (Array.isArray(values[id]) ? (values[id] as string[]) : [])
  const setVal = (id: string, v: Value) => setValues((prev) => ({ ...prev, [id]: v }))
  const toggle = (id: string, opt: string) =>
    setVal(id, list(id).includes(opt) ? list(id).filter((o) => o !== opt) : [...list(id), opt])

  function display(f: FieldDef): string {
    if (f.type === 'check') return list(f.id).join(', ')
    return str(f.id)
  }

  async function handleDownload() {
    setGenerating(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const marginX = 48
      const right = 548
      const tinta = '#1c1a17'
      const cuero = '#6b6058'
      let y = 56

      const ensure = (h: number) => {
        if (y + h > 790) {
          doc.addPage()
          y = 56
        }
      }

      doc.setTextColor(tinta)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text('LA TRASTIENDA · MANUAL DE KPIS', marginX, y)
      y += 28
      doc.setFontSize(20)
      doc.text(`Ficha del capítulo ${config.chapter} — ${config.title}`, marginX, y, { maxWidth: right - marginX })
      y += 24
      doc.setDrawColor('#B8821C')
      doc.setLineWidth(1)
      doc.line(marginX, y, right, y)
      y += 24

      config.sections.forEach((section) => {
        ensure(40)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(tinta)
        doc.text(section.title, marginX, y)
        y += 18

        const short = section.fields.filter((f) => f.type === 'text' || f.type === 'date')
        const colW = (right - marginX) / 3
        for (let i = 0; i < short.length; i += 3) {
          ensure(40)
          const row = short.slice(i, i + 3)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          doc.setTextColor(cuero)
          row.forEach((f, c) => doc.text(f.label.toUpperCase(), marginX + c * colW, y, { maxWidth: colW - 8 }))
          y += 14
          doc.setFontSize(12)
          doc.setTextColor(tinta)
          row.forEach((f, c) => doc.text(display(f) || '—', marginX + c * colW, y, { maxWidth: colW - 8 }))
          y += 22
        }

        section.fields
          .filter((f) => f.type !== 'text' && f.type !== 'date')
          .forEach((f) => {
            const lines = doc.splitTextToSize(display(f) || '—', right - marginX) as string[]
            ensure(30 + lines.length * 14)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(8)
            doc.setTextColor(cuero)
            doc.text(f.label.toUpperCase(), marginX, y, { maxWidth: right - marginX })
            y += 14
            doc.setFontSize(11)
            doc.setTextColor(tinta)
            doc.text(lines, marginX, y)
            y += lines.length * 14 + 10
          })

        doc.setDrawColor('#e5ded2')
        doc.line(marginX, y, right, y)
        y += 20
      })

      ensure(60)
      y += 16
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(cuero)
      doc.text('FIRMA DEL RESPONSABLE', marginX, y)
      doc.line(marginX + 120, y + 2, right, y + 2)
      y += 24
      doc.text(config.footer, marginX, y)

      doc.save(`${config.fileSlug}-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  function renderField(f: FieldDef) {
    if (f.type === 'text' || f.type === 'date') {
      return (
        <div key={f.id}>
          <span className={labelClass}>{f.label}</span>
          <input
            type={f.type}
            value={str(f.id)}
            onChange={(e) => setVal(f.id, e.target.value)}
            placeholder={f.type === 'text' ? f.placeholder : undefined}
            className={inputClass}
          />
        </div>
      )
    }
    if (f.type === 'textarea') {
      return (
        <div key={f.id} className="sm:col-span-3">
          <span className={labelClass}>{f.label}</span>
          <textarea
            value={str(f.id)}
            onChange={(e) => setVal(f.id, e.target.value)}
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>
      )
    }
    return (
      <div key={f.id} className="sm:col-span-3">
        <span className={labelClass}>{f.label}</span>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1">
          {f.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 font-sans text-[15px] text-tinta cursor-pointer">
              <input
                type={f.type === 'radio' ? 'radio' : 'checkbox'}
                name={f.id}
                checked={f.type === 'radio' ? str(f.id) === opt : list(f.id).includes(opt)}
                onChange={() => (f.type === 'radio' ? setVal(f.id, opt) : toggle(f.id, opt))}
                className="accent-acento"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    )
  }

  const header = (
    <div>
      <span className="font-sans text-[14px] text-acento-deep block mb-1">
            Ficha del capítulo {config.chapter}
      </span>
      <h3 className="font-display text-[22px] font-medium text-tinta">{config.title}</h3>
    </div>
  )

  if (!open) {
    return (
      <div className="border border-lino bg-blanco px-6 py-5 flex items-center justify-between gap-4">
        <div>
          {header}
          <p className="font-sans text-[15px] text-tinta/70 leading-relaxed max-w-[52ch] mt-1">{config.intro}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 font-sans text-[15px] font-medium text-papel bg-tinta px-6 min-h-[44px] flex items-center hover:bg-acento hover:text-tinta transition-colors duration-200 cursor-pointer"
        >
          Abrir ficha
        </button>
      </div>
    )
  }

  const section = steps[step]

  return (
    <div className="border border-lino bg-blanco">
      <div className="px-6 py-4 border-b border-lino flex items-center justify-between">
        {header}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-sans text-[15px] text-tinta/65 hover:text-tinta min-h-[44px] transition-colors duration-200 cursor-pointer"
        >
          Cerrar
        </button>
      </div>

      <div className="flex items-center px-6 pt-5">
        {steps.map((s, i) => (
          <div key={s.title} className="flex items-center flex-1 last:flex-none">
            <button type="button" onClick={() => setStep(i)} className="flex items-center gap-2 cursor-pointer group">
              <span className={`font-sans text-[14px] tabular-nums ${i === step ? 'text-acento-deep font-medium' : i < step ? 'text-tinta' : 'text-tinta/45'}`}>{i < step ? '✓' : `${i + 1}.`}</span>
              <span
                className={`hidden sm:inline font-sans text-[14px] transition-colors duration-150 ${
                  i === step ? 'text-tinta font-medium' : 'text-tinta/55 group-hover:text-tinta'
                }`}
              >
                {s.title}
              </span>
            </button>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-lino/50 mx-3" />}
          </div>
        ))}
      </div>

      <div className="px-6 py-6 min-h-[280px]">
        {section.hint && (
          <p className="font-sans text-[15px] text-tinta/70 leading-relaxed max-w-[60ch] mb-4">{section.hint}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{section.fields.map(renderField)}</div>
      </div>

      <div className="px-6 py-4 border-t border-lino flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step === 0 ? setValues({}) : setStep(step - 1))}
          className="font-sans text-[15px] text-tinta/65 hover:text-tinta min-h-[44px] transition-colors duration-200 cursor-pointer"
        >
          {step === 0 ? 'Vaciar ficha' : 'Atrás'}
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="font-sans text-[15px] font-medium text-tinta border border-tinta px-6 min-h-[44px] flex items-center hover:bg-tinta hover:text-papel transition-colors duration-200 cursor-pointer"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDownload}
            disabled={generating}
            className="font-sans text-[15px] font-medium text-papel bg-tinta px-6 min-h-[44px] flex items-center hover:bg-acento hover:text-tinta transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Generando…' : 'Descargar PDF'}
          </button>
        )}
      </div>
    </div>
  )
}
