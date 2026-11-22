'use client'

import { useEffect, useRef, useState } from 'react'
import { LOGO_PATH, LOGO_VIEWBOX } from './certificate-logo'

// Lienzo del diseño v5 (apaisado). Todo se maqueta en px a este tamaño y se escala.
const CERT_W = 1200
const CERT_H = 630

export interface CertificateData {
  studentName: string
  courseName: string
  /** Horas de formación; 0 u omitido = no se muestra */
  durationHours?: number
  /** Modalidad, p. ej. "Online · Campus" */
  format?: string
  /** Fecha de finalización (ISO) */
  completedAt: string
  /** Número de certificado, p. ej. "LT · 2026 · 9F3A21BC" */
  certificateCode: string
  signer?: { name?: string; role: string; signatureUrl?: string }
}

const DEFAULT_SIGNER = { name: '', role: 'Dirección · La Trastienda' }

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  })
}

const CSS = `
.lt-cert { --papel:#F4EFE6; --tinta:#1A1714; --ocre:#B8821C; --bronce:#8F5E1A; --soft:rgba(26,23,20,.72); --rule:rgba(26,23,20,.22);
  position:relative; width:${CERT_W}px; height:${CERT_H}px; background:var(--papel); color:var(--tinta); overflow:hidden;
  font-family:var(--font-space-grotesk),system-ui,sans-serif; box-sizing:border-box; transform-origin:top left; }
.lt-cert *{ box-sizing:border-box; }
.lt-cert .rendija{ position:absolute; left:0; top:0; bottom:0; width:14px; background:var(--ocre); }
.lt-cert .marco{ position:absolute; inset:22px 22px 22px 36px; border:1px solid var(--tinta); pointer-events:none; }
.lt-cert .inner{ position:absolute; inset:22px 22px 22px 36px; padding:34px 66px 26px; display:flex; flex-direction:column; align-items:center; text-align:center; z-index:2; }
.lt-cert .logo{ height:30px; width:auto; color:var(--tinta); display:block; flex:none; }
.lt-cert .kicker{ margin-top:22px; font-family:var(--font-mono),monospace; font-weight:500; text-transform:uppercase; letter-spacing:.24em; font-size:11.5px; color:var(--bronce); }
.lt-cert .otorga{ margin-top:22px; font-family:var(--font-newsreader),Georgia,serif; font-style:italic; font-size:17px; color:var(--soft); }
.lt-cert .name{ margin-top:8px; min-width:560px; padding-bottom:8px; border-bottom:1px solid var(--rule); font-family:var(--font-newsreader),Georgia,serif; font-weight:500; font-size:60px; letter-spacing:-.02em; line-height:1.04; white-space:nowrap; }
.lt-cert .por{ margin-top:28px; font-size:14px; color:var(--soft); }
.lt-cert .course{ margin-top:6px; max-width:880px; font-family:var(--font-newsreader),Georgia,serif; font-style:italic; font-weight:500; font-size:34px; letter-spacing:-.012em; line-height:1.1; text-wrap:balance; }
.lt-cert .data{ margin-top:28px; display:flex; align-items:center; justify-content:center; flex-wrap:wrap; }
.lt-cert .it{ font-family:var(--font-mono),monospace; text-transform:uppercase; letter-spacing:.12em; white-space:nowrap; font-size:11.5px; padding:0 16px; }
.lt-cert .it span{ color:var(--soft); }
.lt-cert .it + .it{ border-left:1px solid var(--rule); }
.lt-cert .grow{ flex:1; min-height:12px; }
.lt-cert .foot{ display:grid; grid-template-columns:1fr auto 1fr; gap:36px; width:100%; align-items:end; }
.lt-cert .col{ display:flex; flex-direction:column; width:250px; }
.lt-cert .col.left{ align-items:flex-start; text-align:left; }
.lt-cert .col.right{ align-items:flex-end; text-align:right; margin-left:auto; }
.lt-cert .sigbox{ width:100%; height:54px; display:flex; align-items:flex-end; }
.lt-cert .sigbox img{ max-height:100%; max-width:100%; object-fit:contain; mix-blend-mode:multiply; }
.lt-cert .sigline{ width:100%; border-top:1px solid var(--tinta); }
.lt-cert .flabel{ margin-top:8px; font-family:var(--font-mono),monospace; text-transform:uppercase; letter-spacing:.16em; font-size:10.5px; color:var(--bronce); }
.lt-cert .fval{ margin-top:3px; font-weight:500; font-size:14px; }
.lt-cert .fval.small{ margin-top:2px; font-weight:400; font-size:12.5px; color:var(--soft); }
.lt-cert .fval.mono{ font-family:var(--font-mono),monospace; font-weight:400; letter-spacing:.08em; font-size:12px; }
.lt-cert .seal{ display:block; margin:-4px 0 -2px; width:160px; height:160px; max-width:none; }
.lt-cert .legal{ margin-top:12px; width:100%; text-align:center; font-family:var(--font-mono),monospace; text-transform:uppercase; letter-spacing:.14em; font-size:10px; color:var(--soft); }
`

function CertificateInner({
  studentName,
  courseName,
  durationHours,
  format,
  completedAt,
  certificateCode,
  signer,
}: CertificateData & { signer: NonNullable<CertificateData['signer']> }) {
  const fecha = formatDateLong(completedAt)
  const nameRef = useRef<HTMLDivElement>(null)

  // Reduce el nombre si no cabe en una línea
  useEffect(() => {
    const el = nameRef.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = ''
      const box = el.parentElement!
      const cs = getComputedStyle(box)
      const max = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      let fs = parseFloat(getComputedStyle(el).fontSize)
      let guard = 40
      while (el.scrollWidth > max && fs > 22 && guard-- > 0) {
        fs -= 2
        el.style.fontSize = `${fs}px`
      }
    }
    fit()
    document.fonts?.ready.then(fit)
  }, [studentName])

  return (
    <div className="lt-cert" data-cert>
      <div className="rendija" />
      <div className="marco" />
      <div className="inner">
        <svg className="logo" viewBox={LOGO_VIEWBOX} fill="currentColor" role="img" aria-label="La Trastienda">
          <path d={LOGO_PATH} fillRule="evenodd" />
        </svg>
        <div className="kicker">Certificado de completación</div>

        <div className="otorga">Se otorga a</div>
        <div className="name" ref={nameRef}>{studentName}</div>

        <div className="por">por haber completado el curso</div>
        <div className="course">{courseName}</div>

        <div className="data">
          {durationHours ? <span className="it">{durationHours} {durationHours === 1 ? 'hora' : 'horas'} <span>de formación</span></span> : null}
          {format ? <span className="it">{format}</span> : null}
          <span className="it"><span>Finalizado el</span> {fecha}</span>
        </div>

        <div className="grow" />

        <div className="foot">
          <div className="col left">
            <div className="sigbox">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {signer.signatureUrl ? <img src={signer.signatureUrl} alt="Firma" /> : null}
            </div>
            <div className="sigline" />
            <div className="flabel">Firma</div>
            <div className="fval">{signer.name || ' '}</div>
            <div className="fval small">{signer.role}</div>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="seal" src="/images/certificado/sello-gastado.png" alt="Sello de La Trastienda" />

          <div className="col right">
            <div className="sigbox" />
            <div className="sigline" />
            <div className="flabel">Fecha de finalización</div>
            <div className="fval">{fecha}</div>
            <div className="fval small mono">{certificateCode}</div>
          </div>
        </div>

        <div className="legal">Certificado de participación · Formación no reglada</div>
      </div>
    </div>
  )
}

export default function Certificate(props: CertificateData) {
  const holderRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.7)
  const [busy, setBusy] = useState<null | 'png' | 'pdf'>(null)
  const signer = props.signer ?? DEFAULT_SIGNER

  // Escala el lienzo 1200×630 al ancho disponible
  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const update = () => setScale(Math.min(1, frame.clientWidth / CERT_W))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(frame)
    return () => ro.disconnect()
  }, [])

  const d = new Date(props.completedAt)
  const linkedInUrl =
    `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
    `&name=${encodeURIComponent(props.courseName)}` +
    `&organizationName=${encodeURIComponent('La Trastienda')}` +
    `&issueYear=${d.getUTCFullYear()}` +
    `&issueMonth=${d.getUTCMonth() + 1}` +
    `&certId=${encodeURIComponent(props.certificateCode)}`

  const fileBase = `certificado-${props.certificateCode.replace(/\s·\s/g, '-')}`

  async function capture(): Promise<HTMLCanvasElement | null> {
    const el = holderRef.current?.querySelector<HTMLElement>('[data-cert]')
    if (!el) return null
    const prev = el.style.transform
    el.style.transform = 'none'
    try {
      await document.fonts.ready
      const html2canvas = (await import('html2canvas')).default
      return await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F4EFE6',
        width: CERT_W,
        height: CERT_H,
        logging: false,
      })
    } finally {
      el.style.transform = prev
    }
  }

  async function download(kind: 'png' | 'pdf') {
    setBusy(kind)
    try {
      const canvas = await capture()
      if (!canvas) return
      if (kind === 'png') {
        const a = document.createElement('a')
        a.download = `${fileBase}.png`
        a.href = canvas.toDataURL('image/png')
        a.click()
      } else {
        const { jsPDF } = await import('jspdf')
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [CERT_W, CERT_H], hotfixes: ['px_scaling'] })
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, CERT_W, CERT_H)
        pdf.save(`${fileBase}.pdf`)
      }
    } finally {
      setBusy(null)
    }
  }

  const btn =
    'font-sans text-[15px] font-medium px-6 min-h-[48px] inline-flex items-center transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div>
      <style>{CSS}</style>

      <div ref={frameRef} className="w-full">
        <div style={{ width: CERT_W * scale, height: CERT_H * scale, overflow: 'hidden' }} className="shadow-[0_20px_50px_-24px_rgba(26,23,20,0.45)]">
          <div ref={holderRef} style={{ width: CERT_W, height: CERT_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <CertificateInner {...props} signer={signer} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button onClick={() => download('pdf')} disabled={busy !== null} className={`${btn} text-papel bg-tinta hover:bg-acento hover:text-tinta`}>
          {busy === 'pdf' ? 'Generando PDF…' : 'Descargar PDF'}
        </button>
        <button onClick={() => download('png')} disabled={busy !== null} className={`${btn} text-tinta border border-tinta hover:bg-tinta hover:text-papel`}>
          {busy === 'png' ? 'Generando imagen…' : 'Descargar imagen (PNG)'}
        </button>
        <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" className={`${btn} text-tinta border border-lino hover:border-tinta`}>
          Añadir a LinkedIn
        </a>
      </div>
    </div>
  )
}
