'use client'

import { useActionState, useState } from 'react'
import { createPreviewLink, type PreviewLinkResult } from '@/app/actions/preview-link'

export default function PreviewLinkForm({ courses }: { courses: { slug: string; title: string }[] }) {
  const [state, action, pending] = useActionState<PreviewLinkResult, FormData>(createPreviewLink, {})
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (!state.url) return
    try {
      await navigator.clipboard.writeText(state.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* el usuario puede copiar a mano del campo */
    }
  }

  return (
    <div className="space-y-6">
      <form action={action} className="flex items-end gap-3 flex-wrap bg-blanco border border-lino/50 px-6 py-5">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.12em]">Curso</span>
          <select name="course" required className="font-sans text-[13px] text-tinta bg-papel border border-lino/60 px-3 py-2.5">
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>{c.title}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.12em]">Caduca en</span>
          <select name="days" defaultValue="7" className="font-sans text-[13px] text-tinta bg-papel border border-lino/60 px-3 py-2.5">
            <option value="1">24 horas</option>
            <option value="7">7 días</option>
            <option value="30">30 días</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="font-mono text-[10px] uppercase tracking-[0.08em] px-4 min-h-[40px] bg-tinta text-papel hover:bg-acento hover:text-tinta transition-colors duration-200 disabled:opacity-50"
        >
          {pending ? 'Generando…' : 'Generar enlace'}
        </button>
      </form>

      {state.error && <p className="font-sans text-sm text-red-600">{state.error}</p>}

      {state.url && (
        <div className="bg-blanco border border-acento/40 px-6 py-5 space-y-3">
          <p className="font-mono text-[9px] text-acento uppercase tracking-[0.12em]">
            Enlace de solo lectura · caduca el {state.expires}
          </p>
          <div className="flex gap-3 flex-wrap">
            <input
              readOnly
              value={state.url}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 min-w-[260px] font-mono text-[11px] text-tinta bg-papel border border-lino/60 px-3 py-2.5"
            />
            <button
              type="button"
              onClick={copy}
              className="font-mono text-[10px] uppercase tracking-[0.08em] px-4 min-h-[40px] border border-tinta text-tinta hover:bg-tinta hover:text-papel transition-colors duration-200"
            >
              {copied ? 'Copiado ✓' : 'Copiar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
