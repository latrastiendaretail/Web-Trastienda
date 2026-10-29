export interface YTPlayer {
  destroy(): void
  getCurrentTime(): number
  getDuration(): number
}
export interface YTPlayerOptions {
  videoId: string
  playerVars?: Record<string, number | string>
  events?: {
    onReady?: () => void
    onStateChange?: (e: { data: number }) => void
  }
}
declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayer
      PlayerState: { ENDED: 0; PLAYING: 1; PAUSED: 2 }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export function extractVideoId(url: string | null | undefined): string | null {
  if (!url) return null
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return match ? match[1] : null
}

// Carga la API de YouTube una sola vez, compartida entre VideoPlayer y SlideDeck.
let apiReady: Promise<void> | null = null
export function loadYTApi(): Promise<void> {
  if (apiReady) return apiReady
  apiReady = new Promise((resolve) => {
    if (typeof window === 'undefined') return
    if (window.YT?.Player) { resolve(); return }
    window.onYouTubeIframeAPIReady = resolve
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  })
  return apiReady
}
