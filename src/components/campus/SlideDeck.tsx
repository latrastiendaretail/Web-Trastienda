'use client'

import { useState } from 'react'
import Image from 'next/image'
import { markModuleComplete } from '@/app/actions/progress'
import { ProgressDial } from '@/components/campus/academia/icons'

interface Props {
  slideUrls: string[]
  moduleId: string
  initialCompleted: boolean
  title: string
}

export default function SlideDeck({ slideUrls, moduleId, initialCompleted, title }: Props) {
  const [index, setIndex] = useState(0)
  const [completed, setCompleted] = useState(initialCompleted)
  const [saving, setSaving] = useState(false)
  const total = slideUrls.length
  const isLast = index === total - 1

  async function goTo(next: number) {
    const clamped = Math.max(0, Math.min(total - 1, next))
    setIndex(clamped)
    if (clamped === total - 1 && !completed && !saving) {
      setSaving(true)
      await markModuleComplete(moduleId)
      setCompleted(true)
      setSaving(false)
    }
  }

  if (total === 0) return null

  return (
    <div className="bg-tinta">
      <div className="relative aspect-video w-full">
        <Image
          src={slideUrls[index]}
          alt={`${title} — diapositiva ${index + 1} de ${total}`}
          fill
          sizes="(max-width: 1024px) 100vw, 900px"
          className="object-contain"
          priority={index === 0}
          unoptimized
        />
        {completed && (
          <div className="absolute top-3 right-3 bg-acento text-tinta font-sans text-[9px] font-medium uppercase tracking-[0.1em] px-2 py-1 pointer-events-none">
            ✓ Completado
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-papel/10">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="font-mono text-[10px] text-papel/60 hover:text-papel uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] flex items-center"
        >
          ← Anterior
        </button>

        <div className="flex items-center gap-3">
          <ProgressDial total={total} completed={index + 1} markClassName="w-2 h-2" />
          <span className="font-mono text-[9px] text-papel/40 uppercase tracking-[0.1em]">
            {index + 1} / {total}
          </span>
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={isLast}
          className="font-mono text-[10px] text-papel/60 hover:text-papel uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed min-h-[44px] flex items-center"
        >
          {saving ? 'Guardando...' : 'Siguiente →'}
        </button>
      </div>
    </div>
  )
}
