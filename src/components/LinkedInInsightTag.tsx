'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getMarketingConsent, CONSENT_EVENT } from '@/lib/consent'

export default function LinkedInInsightTag() {
  const partnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    setConsent(getMarketingConsent())

    const handler = () => setConsent(getMarketingConsent())
    window.addEventListener(CONSENT_EVENT, handler)
    return () => window.removeEventListener(CONSENT_EVENT, handler)
  }, [])

  if (!partnerId || !consent) return null

  return (
    <>
      <Script id="linkedin-insight-init" strategy="afterInteractive">{`
        _linkedin_partner_id = "${partnerId}";
        window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
        window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        (function(l) {
          if (!l) {
            window.lintrk = function(a,b) { window.lintrk.q.push([a,b]) };
            window.lintrk.q = [];
          }
          var s = document.getElementsByTagName("script")[0];
          var b = document.createElement("script");
          b.type = "text/javascript"; b.async = true;
          b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
          s.parentNode.insertBefore(b, s);
        })(window.lintrk);
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif`}
        />
      </noscript>
    </>
  )
}
