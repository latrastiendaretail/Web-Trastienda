'use client'

import { clearConsent } from '@/lib/consent'

interface Props {
  className?: string
}

export default function ManageCookiesButton({ className = '' }: Props) {
  function handle() {
    clearConsent()
    window.location.reload()
  }

  return (
    <button onClick={handle} className={`cursor-pointer ${className}`}>
      Gestionar cookies
    </button>
  )
}
