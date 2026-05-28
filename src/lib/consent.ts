export type ConsentLevel = 'all' | 'essential'

const KEY = 'lt_consent'
export const CONSENT_EVENT = 'lt-consent-change'

export function getConsent(): ConsentLevel | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(KEY) as ConsentLevel | null
}

export function setConsent(level: ConsentLevel): void {
  localStorage.setItem(KEY, level)
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

export function clearConsent(): void {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new Event(CONSENT_EVENT))
}
