'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getMarketingConsent, CONSENT_EVENT } from '@/lib/consent'

let initialized = false

function initPostHog() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
    capture_pageview: false,
    capture_pageleave: true,
    opt_out_capturing_by_default: true,
  })
}

function PostHogPageView() {
  const pathname = usePathname()

  useEffect(() => {
    if (posthog.has_opted_in_capturing()) {
      posthog.capture('$pageview')
    }
  }, [pathname])

  return null
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog()

    if (getMarketingConsent()) posthog.opt_in_capturing()

    const handler = () => {
      if (getMarketingConsent()) {
        posthog.opt_in_capturing()
      } else {
        posthog.opt_out_capturing()
      }
    }

    window.addEventListener(CONSENT_EVENT, handler)
    return () => window.removeEventListener(CONSENT_EVENT, handler)
  }, [])

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  )
}
