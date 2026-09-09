/**
 * Iconografía Academia — portada 1:1 de ltt-icons.js (marcas geométricas macizas, 24×24).
 */
const PATHS: Record<string, string> = {
  leccion: '<rect x="2.5" y="4" width="8.5" height="16"/><rect x="13" y="4" width="8.5" height="16"/>',
  autoevaluacion:
    '<rect x="2.5" y="4" width="5" height="5"/><rect x="10" y="5" width="11.5" height="3"/><rect x="2.5" y="15" width="5" height="5"/><rect x="10" y="16" width="11.5" height="3"/>',
  escenario: '<circle cx="8.5" cy="7.5" r="4.5"/><rect x="2" y="15" width="20" height="5"/>',
  clasificacion: '<rect x="2.5" y="5" width="8" height="14"/><rect x="13.5" y="10" width="8" height="9"/>',
  emparejamiento:
    '<circle cx="6" cy="12" r="4.5"/><circle cx="18" cy="12" r="4.5"/><rect x="9" y="10.75" width="6" height="2.5"/>',
  reflexion: '<path d="M2.5 4h19v13H9.5l-4.5 4.5V17H2.5z"/>',
  repaso: '<path d="M12 1.8 22.2 12 12 22.2 1.8 12z"/>',
  modulo:
    '<rect x="2.5" y="2.5" width="8" height="8"/><rect x="13.5" y="2.5" width="8" height="8"/><rect x="2.5" y="13.5" width="8" height="8"/><rect x="13.5" y="13.5" width="8" height="8"/>',
  acierto: '<path d="M9.55 17.3 4.3 12.05l1.7-1.7 3.55 3.55L18 5.45l1.7 1.7z"/>',
  fallo: '<path d="M18.4 7.3 16.7 5.6 12 10.3 7.3 5.6 5.6 7.3 10.3 12l-4.7 4.7 1.7 1.7L12 13.7l4.7 4.7 1.7-1.7L13.7 12z"/>',
  bloqueado:
    '<rect x="3.5" y="10.5" width="17" height="11" rx="1.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5h-2.6V8a1.4 1.4 0 0 0-2.8 0v2.5z"/>',
  abierto:
    '<rect x="3.5" y="10.5" width="17" height="11" rx="1.5"/><path d="M10.6 10.5V8a1.4 1.4 0 0 1 2.8 0H16a4 4 0 0 0-8 0v2.5z"/>',
  flecha: '<path d="M13 3.5 22 12l-9 8.5V14H2.5v-4H13z"/>',
  chevron: '<path d="M12 17 3 7h18z"/>',
  aviso: '<path d="M12 2.5 22.5 21H1.5z"/>',
  punto: '<circle cx="12" cy="12" r="6"/>',
}

export type IconName = keyof typeof PATHS

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <span
      className={`ltt-ico${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" focusable="false">${d}</svg>` }}
    />
  )
}
