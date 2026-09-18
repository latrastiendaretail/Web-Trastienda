import type { ComponentType } from 'react'
import FichaExplicaVenta from './FichaExplicaVenta'

export const KPI_TOOLS: Record<string, ComponentType> = {
  'explica-tu-venta': FichaExplicaVenta,
}

export function getKpiTool(toolKey: string | null) {
  if (!toolKey) return null
  return KPI_TOOLS[toolKey] ?? null
}
