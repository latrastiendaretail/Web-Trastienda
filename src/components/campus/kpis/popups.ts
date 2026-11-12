// Popups que aparecen sobre el vídeo de un capítulo en un minuto concreto.
// Clave: `${courseSlug}:${order_index}`.
export interface VideoPopup {
  /** Segundo del vídeo en el que aparece (3:20 → 200) */
  atSeconds: number
  title: string
  text: string
  ctaLabel: string
  /** Destino del botón. Sin href el botón sale como "Próximamente". */
  href?: string
}

export const VIDEO_POPUPS: Record<string, VideoPopup[]> = {
  // KPI 06 · Cesta media — "si quieres saber lo que es el PMU pincha aquí" (3:20)
  // TODO: apuntar href al capítulo KPI PMU cuando exista.
  'curso-de-kpis:6': [
    {
      atSeconds: 200,
      title: '¿Qué es el PMU?',
      text: 'Si quieres saber lo que es el PMU, pincha aquí.',
      ctaLabel: 'Saber más sobre el PMU',
    },
  ],
}

export function getVideoPopups(courseSlug: string, orderIndex: number): VideoPopup[] {
  return VIDEO_POPUPS[`${courseSlug}:${orderIndex}`] ?? []
}
