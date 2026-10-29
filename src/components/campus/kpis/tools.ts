import { createElement, type ComponentType } from 'react'
import FichaExplicaVenta from './FichaExplicaVenta'
import FichaKpi from './FichaKpi'
import { FICHAS } from './fichas'

export const KPI_TOOLS: Record<string, ComponentType> = {
  'explica-tu-venta': FichaExplicaVenta,
  ...Object.fromEntries(
    Object.entries(FICHAS).map(([key, config]) => [key, () => createElement(FichaKpi, { config })]),
  ),
}

export function getKpiTool(toolKey: string | null) {
  if (!toolKey) return null
  return KPI_TOOLS[toolKey] ?? null
}
