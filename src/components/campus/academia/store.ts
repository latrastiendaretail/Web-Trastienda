/**
 * Persistencia — puerto 1:1 de Store(id) en ltt-academia.js.
 * Única función a sustituir si el guardado pasa a Supabase (ver LEEME.md del paquete original).
 */
export function loadStore(moduleId: string): Record<string, unknown> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(`ltt:${moduleId}`) || '{}') || {}
  } catch {
    return {}
  }
}

export function saveStore(moduleId: string, data: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(`ltt:${moduleId}`, JSON.stringify(data))
  } catch {
    // localStorage lleno o bloqueado (modo privado) — se ignora, igual que en el prototipo
  }
}
