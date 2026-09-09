'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { loadStore, saveStore } from './store'

interface AcademiaContextValue {
  id: string
  save: (exerciseId: string, key: string, value: unknown) => void
  load: <T = unknown>(exerciseId: string, key: string) => T | undefined
  markDone: (blockId: string) => void
  isDone: (blockId: string) => boolean
  registerBlock: (blockId: string) => void
  doneCount: number
  totalBlocks: number
  pct: number
  complete: () => void
}

const AcademiaContext = createContext<AcademiaContextValue | null>(null)

interface AcademiaProviderProps {
  id: string
  children: ReactNode
  onProgress?: (info: { done: number; total: number; pct: number }) => void
  onComplete?: () => void
}

export function AcademiaProvider({ id, children, onProgress, onComplete }: AcademiaProviderProps) {
  const dataRef = useRef<Record<string, unknown> | null>(null)
  if (dataRef.current === null) dataRef.current = loadStore(id)

  const [doneBlocks, setDoneBlocks] = useState<Record<string, boolean>>(
    () => (dataRef.current!.blocks as Record<string, boolean>) || {},
  )
  const [blockOrder, setBlockOrder] = useState<string[]>([])

  const persist = useCallback(() => {
    saveStore(id, dataRef.current!)
  }, [id])

  const save = useCallback(
    (exerciseId: string, key: string, value: unknown) => {
      dataRef.current![`${exerciseId}:${key}`] = value
      persist()
    },
    [persist],
  )

  const load = useCallback(<T,>(exerciseId: string, key: string): T | undefined => {
    return dataRef.current![`${exerciseId}:${key}`] as T | undefined
  }, [])

  const markDone = useCallback(
    (blockId: string) => {
      setDoneBlocks((prev) => {
        if (prev[blockId]) return prev
        const next = { ...prev, [blockId]: true }
        dataRef.current!.blocks = next
        persist()
        return next
      })
    },
    [persist],
  )

  const isDone = useCallback((blockId: string) => !!doneBlocks[blockId], [doneBlocks])

  const registerBlock = useCallback((blockId: string) => {
    setBlockOrder((prev) => (prev.includes(blockId) ? prev : [...prev, blockId]))
  }, [])

  const { doneCount, totalBlocks, pct } = useMemo(() => {
    const total = blockOrder.length
    const done = blockOrder.filter((b) => doneBlocks[b]).length
    const p = total ? Math.round((done / total) * 100) : 0
    return { doneCount: done, totalBlocks: total, pct: p }
  }, [blockOrder, doneBlocks])

  const prevPctRef = useRef(-1)
  if (onProgress && prevPctRef.current !== pct) {
    prevPctRef.current = pct
    onProgress({ done: doneCount, total: totalBlocks, pct })
  }

  const complete = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  const value: AcademiaContextValue = {
    id,
    save,
    load,
    markDone,
    isDone,
    registerBlock,
    doneCount,
    totalBlocks,
    pct,
    complete,
  }

  return <AcademiaContext.Provider value={value}>{children}</AcademiaContext.Provider>
}

export function useAcademia(): AcademiaContextValue {
  const ctx = useContext(AcademiaContext)
  if (!ctx) throw new Error('useAcademia debe usarse dentro de <AcademiaProvider>')
  return ctx
}
