'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import LttIntroOverlay from './LttIntroOverlay'
import { submitContact, type ContactResult } from '@/app/actions/contact'

const services = [
  {
    n: 'S—01',
    icon: <path d="M3 3v18h18M7 14l3-4 4 3 5-7" />,
    title: 'Optimización comercial',
    description:
      'Diagnóstico de la operación de venta sobre el terreno: recorrido del cliente, conversión, ticket medio y unidades por venta. Rediseñamos el método para que la tienda rinda a su potencial real.',
    tags: ['Conversión', 'Ticket medio', 'Layout comercial'],
  },
  {
    n: 'S—02',
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    title: 'Formación de equipos',
    description:
      'Formación de venta aplicada a la sala, no a un aula. El equipo aprende a acompañar al cliente, leer la intención de compra y cerrar — con casos de su propia tienda.',
    tags: ['Venta asistida', 'Atención', 'Cierre'],
  },
  {
    n: 'S—03',
    icon: <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.8 5.5 21l2-7.5L2 9h7z" />,
    title: 'Mando intermedio',
    description:
      'Convertimos al encargado en un mando que dirige. Gestión de equipo, lectura de indicadores y conducción del día a día para que la tienda funcione cuando dirección no está delante.',
    tags: ['Liderazgo', 'KPIs de tienda', 'Gestión'],
  },
  {
    n: 'S—04',
    icon: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6" />
        <path d="M22 11h-6" />
      </>
    ),
    title: 'Onboarding',
    description:
      'Incorporación de nuevo personal con criterio desde el primer día. Un protocolo de entrada que acorta la curva y evita que cada alta empiece de cero.',
    tags: ['Protocolo', 'Curva de entrada', 'Estándar'],
  },
]

const reasons = [
  {
    icon: <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />,
    title: 'Criterio de tienda, no de teoría',
    description:
      'Cada recomendación nace de haber estado al otro lado del mostrador. Sabemos qué aguanta una sala real y qué se cae el primer sábado con afluencia.',
  },
  {
    icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    title: 'Resultados medibles',
    description:
      'Trabajamos sobre indicadores concretos —conversión, ticket, unidades por venta— y dejamos a la tienda capaz de sostenerlos sin nosotros.',
  },
  {
    icon: <path d="M20 6L9 17l-5-5" />,
    title: 'La marca detrás',
    description:
      'El mismo origen y el mismo oficio de La Trastienda, con un acabado corporativo para empresas con red de tiendas que exigen método y discreción.',
  },
]

const results = [
  {
    sector: 'Cadena de moda · red de tiendas',
    metric: '+18',
    unit: '%',
    description: 'Conversión sobre tráfico tras rediseñar el método de venta y formar a la sala durante un trimestre.',
    foot: 'Optimización comercial + Formación',
  },
  {
    sector: 'Retail especializado',
    metric: '+11',
    unit: '%',
    description: 'Ticket medio al implantar venta asistida y cierre, sin tocar el surtido ni el precio.',
    foot: 'Formación de equipos',
  },
  {
    sector: 'Grupo con encargados de tienda',
    metric: '−30',
    unit: '%',
    description: 'Tiempo de incorporación de nuevo personal con un protocolo de onboarding estandarizado.',
    foot: 'Mando intermedio + Onboarding',
  },
]

function LttContactForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isPending) return
    const fd = new FormData(e.currentTarget)
    fd.set('audience', 'empresa')
    startTransition(async () => {
      const result: ContactResult = await submitContact(fd)
      if (result.success) {
        setStatus('success')
        formRef.current?.reset()
      } else {
        setStatus('error')
        setErrorMsg(result.error)
      }
    })
  }

  if (status === 'success') {
    return (
      <div className="contact-done reveal in">
        <p className="contact-done-title">Solicitud enviada</p>
        <p className="contact-done-sub">Te contactaremos para agendar el diagnóstico.</p>
        <button type="button" className="btn-ghost" onClick={() => setStatus('idle')}>
          Enviar otra solicitud →
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="field">
        <label htmlFor="ltt-name">Nombre</label>
        <input id="ltt-name" name="name" type="text" required autoComplete="name" placeholder="Tu nombre" />
      </div>
      <div className="field">
        <label htmlFor="ltt-email">Email</label>
        <input id="ltt-email" name="email" type="email" required autoComplete="email" placeholder="tu@empresa.com" />
      </div>
      <div className="field">
        <label htmlFor="ltt-message">Mensaje</label>
        <textarea id="ltt-message" name="message" rows={4} required placeholder="Cuéntanos tu tienda o red de tiendas" />
      </div>
      {status === 'error' && <p role="alert" className="contact-error">{errorMsg}</p>}
      <button type="submit" className="btn-primary contact-submit" disabled={isPending}>
        {isPending ? 'Enviando...' : 'Solicitar diagnóstico'}
        {!isPending && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
        )}
      </button>
    </form>
  )
}

function useReveal() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const els = root.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))

    const safety = setTimeout(() => {
      root.querySelectorAll('.reveal:not(.in)').forEach((el) => el.classList.add('in'))
    }, 1400)

    return () => {
      io.disconnect()
      clearTimeout(safety)
    }
  }, [])

  return rootRef
}

const navItems = [
  { href: '#problema', label: 'El problema' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#porque', label: 'Por qué LTT' },
  { href: '#resultados', label: 'Resultados' },
]

export default function LttConsultingPage() {
  const [introDone, setIntroDone] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useReveal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      {!introDone && <LttIntroOverlay onComplete={() => setIntroDone(true)} />}
      <div className="ltt" ref={rootRef}>
        <style>{`
          .ltt {
            --tinta:    #1A1A1A;
            --tinta-2:  #201F1D;
            --tinta-3:  #262420;
            --tinta-4:  #2E2B26;
            --papel:    #F5F0E6;
            --papel-60: rgba(245,240,230,0.60);
            --papel-42: rgba(245,240,230,0.42);
            --papel-22: rgba(245,240,230,0.22);
            --papel-12: rgba(245,240,230,0.12);
            --papel-07: rgba(245,240,230,0.07);
            --ocre:     #B8821C;
            --trigo:    #C9A227;
            --bronce:   #8F5E1A;
            --cuero:    #8B7F70;
            --serif: var(--font-newsreader), Georgia, serif;
            --sans:  var(--font-space-grotesk), system-ui, sans-serif;
            --mono:  var(--font-mono), ui-monospace, monospace;
            --ease: cubic-bezier(0.22, 1, 0.36, 1);
            --maxw: 1200px;
            --gutter: clamp(22px, 5vw, 80px);

            background: var(--tinta);
            color: var(--papel);
            font-family: var(--sans);
            font-weight: 400;
            line-height: 1.6;
            overflow-x: hidden;
          }
          .ltt ::selection { background: var(--ocre); color: var(--tinta); }
          .ltt a { color: inherit; text-decoration: none; }
          .ltt .wrap { width: 100%; max-width: var(--maxw); margin: 0 auto; padding-inline: var(--gutter); }

          .ltt .kicker { display: inline-flex; align-items: center; gap: 12px; font-family: var(--mono); font-size: 12px; font-weight: 500; letter-spacing: 0.24em; text-transform: uppercase; color: var(--cuero); }
          .ltt .kicker .idx { color: var(--trigo); }
          .ltt .kicker .tick { width: 26px; height: 1px; background: var(--papel-22); }

          .ltt h2.title { font-family: var(--serif); font-weight: 500; font-size: clamp(30px, 4.6vw, 56px); line-height: 1.08; letter-spacing: -0.02em; text-wrap: balance; }
          .ltt h2.title em { font-style: italic; color: var(--trigo); }
          .ltt .lede { font-size: clamp(16px, 1.5vw, 19px); color: var(--papel-60); max-width: 54ch; line-height: 1.66; }

          .ltt header.site { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(26,26,26,0); border-bottom: 1px solid transparent; transition: background 0.4s var(--ease), border-color 0.4s var(--ease), backdrop-filter 0.4s var(--ease); }
          .ltt header.site.scrolled { background: rgba(26,26,26,0.82); backdrop-filter: blur(14px) saturate(1.1); border-bottom: 1px solid var(--papel-12); }
          .ltt .nav { display: flex; align-items: center; justify-content: space-between; height: 76px; }
          .ltt .lockup { display: flex; align-items: center; gap: calc(var(--s) * 0.42); }
          .ltt .lockup .mark { font-family: var(--sans); font-weight: 600; letter-spacing: -0.025em; line-height: 1; font-size: var(--s); color: var(--papel); }
          .ltt .lockup .bar { width: calc(var(--s) * 0.05); height: calc(var(--s) * 0.72); background: var(--trigo); flex-shrink: 0; }
          .ltt .lockup .sub { font-family: var(--mono); font-weight: 500; font-size: calc(var(--s) * 0.17); letter-spacing: 0.2em; text-transform: uppercase; color: var(--papel-60); line-height: 1; white-space: nowrap; }
          .ltt .brand-link { --s: 26px; display: flex; align-items: center; gap: 18px; }
          .ltt .brand-group { display: flex; align-items: center; gap: 18px; }
          .ltt .mother-link { display: flex; align-items: center; opacity: 0.9; transition: opacity 0.2s; }
          .ltt .mother-link:hover { opacity: 1; }
          .ltt .mother-logo { height: 22px; width: auto; filter: brightness(0) invert(1); }
          .ltt .brand-sep { width: 1px; height: 22px; background: var(--papel-22); }
          .ltt .nav-links { display: flex; align-items: center; gap: 34px; }
          .ltt .nav-links a { font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; color: var(--papel-60); transition: color 0.2s; }
          .ltt .nav-links a:hover { color: var(--papel); }
          .ltt .nav-cta { display: inline-flex; align-items: center; gap: 9px; white-space: nowrap; font-family: var(--mono); font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--tinta); background: var(--trigo); padding: 11px 18px; border-radius: 2px; transition: background 0.2s, transform 0.2s; }
          .ltt .nav-cta:hover { background: var(--papel); transform: translateY(-1px); }

          .ltt .hero { position: relative; padding-top: clamp(150px, 22vh, 230px); padding-bottom: clamp(80px, 12vh, 150px); overflow: hidden; }
          .ltt .hero::before { content: ""; position: absolute; inset: 0; background: radial-gradient(80% 60% at 78% 12%, rgba(201,162,39,0.10), transparent 58%), radial-gradient(70% 80% at 12% 95%, rgba(143,94,26,0.07), transparent 60%); pointer-events: none; }
          .ltt .hero-grid { position: relative; display: grid; gap: 40px; }
          .ltt .hero h1 { font-family: var(--serif); font-weight: 500; font-size: clamp(42px, 7vw, 92px); line-height: 1.02; letter-spacing: -0.028em; max-width: 16ch; text-wrap: balance; }
          .ltt .hero h1 em { font-style: italic; color: var(--trigo); }
          .ltt .hero-sub { font-size: clamp(17px, 1.7vw, 21px); color: var(--papel-60); max-width: 56ch; line-height: 1.6; }
          .ltt .hero-eyebrow { display: inline-flex; align-items: center; gap: 14px; font-family: var(--mono); font-size: 12px; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase; color: var(--cuero); }
          .ltt .hero-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--trigo); }
          .ltt .hero-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 26px; margin-top: 8px; }

          .ltt .btn-primary { display: inline-flex; align-items: center; gap: 11px; font-family: var(--sans); font-weight: 600; font-size: 15px; letter-spacing: 0.01em; color: var(--tinta); background: var(--trigo); padding: 16px 26px; border-radius: 3px; transition: background 0.25s var(--ease), transform 0.25s var(--ease), box-shadow 0.25s var(--ease); }
          .ltt .btn-primary:hover { background: #d8b133; transform: translateY(-2px); box-shadow: 0 14px 34px -16px rgba(201,162,39,0.7); }
          .ltt .btn-primary svg { width: 17px; height: 17px; transition: transform 0.25s var(--ease); }
          .ltt .btn-primary:hover svg { transform: translateX(3px); }
          .ltt .btn-ghost { display: inline-flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--papel-60); padding: 15px 4px; border-bottom: 1px solid var(--papel-22); transition: color 0.2s, border-color 0.2s; }
          .ltt .btn-ghost:hover { color: var(--papel); border-color: var(--trigo); }

          .ltt .hero-meta { display: flex; flex-wrap: wrap; gap: 20px 56px; margin-top: clamp(56px, 8vh, 92px); padding-top: 34px; border-top: 1px solid var(--papel-12); }
          .ltt .hero-meta .item { display: flex; flex-direction: column; gap: 5px; }
          .ltt .hero-meta .n { font-family: var(--serif); font-weight: 500; font-size: clamp(26px, 3vw, 38px); line-height: 1; color: var(--papel); letter-spacing: -0.01em; }
          .ltt .hero-meta .n em { font-style: italic; color: var(--trigo); }
          .ltt .hero-meta .l { font-family: var(--mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--papel-42); max-width: 22ch; }

          .ltt section { position: relative; }
          .ltt .sec-pad { padding-block: clamp(80px, 13vh, 150px); }
          .ltt .sec-head { display: grid; gap: 22px; max-width: 60ch; }

          .ltt .problema { background: var(--tinta); }
          .ltt .problema .body { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: clamp(40px, 6vw, 90px); align-items: start; margin-top: 56px; }
          .ltt .problema .statement { font-family: var(--serif); font-weight: 400; font-size: clamp(23px, 2.6vw, 33px); line-height: 1.32; letter-spacing: -0.01em; color: var(--papel); }
          .ltt .problema .statement em { font-style: italic; color: var(--trigo); }
          .ltt .gap-list { display: grid; gap: 2px; }
          .ltt .gap-item { display: grid; grid-template-columns: auto 1fr; gap: 20px; padding: 22px 0; border-top: 1px solid var(--papel-12); }
          .ltt .gap-item:last-child { border-bottom: 1px solid var(--papel-12); }
          .ltt .gap-item .num { font-family: var(--mono); font-size: 12px; letter-spacing: 0.1em; color: var(--trigo); padding-top: 4px; }
          .ltt .gap-item h4 { font-family: var(--sans); font-weight: 600; font-size: 17px; margin-bottom: 5px; }
          .ltt .gap-item p { font-size: 14.5px; color: var(--papel-60); line-height: 1.55; }

          .ltt .servicios { background: var(--tinta-2); border-block: 1px solid var(--papel-07); }
          .ltt .svc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; margin-top: 56px; background: var(--papel-12); border: 1px solid var(--papel-12); }
          .ltt .svc { background: var(--tinta-2); padding: clamp(30px, 3.4vw, 46px); display: flex; flex-direction: column; gap: 18px; transition: background 0.3s var(--ease); position: relative; min-height: 270px; }
          .ltt .svc:hover { background: var(--tinta-3); }
          .ltt .svc .svc-top { display: flex; align-items: center; justify-content: space-between; }
          .ltt .svc .svc-n { font-family: var(--mono); font-size: 12px; letter-spacing: 0.16em; color: var(--cuero); }
          .ltt .svc .ico { width: 30px; height: 30px; color: var(--trigo); }
          .ltt .svc h3 { font-family: var(--serif); font-weight: 500; font-size: clamp(22px, 2.3vw, 28px); line-height: 1.12; letter-spacing: -0.015em; margin-top: 4px; }
          .ltt .svc p { font-size: 15px; color: var(--papel-60); line-height: 1.58; }
          .ltt .svc .tags { margin-top: auto; display: flex; flex-wrap: wrap; gap: 8px; padding-top: 12px; }
          .ltt .svc .tag { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--papel-60); border: 1px solid var(--papel-12); border-radius: 2px; padding: 5px 9px; }

          .ltt .porque { background: var(--tinta); }
          .ltt .porque .body { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: clamp(44px, 7vw, 100px); align-items: center; margin-top: 56px; }
          .ltt .porque-quote { font-family: var(--serif); font-weight: 400; font-style: italic; font-size: clamp(28px, 4vw, 50px); line-height: 1.18; letter-spacing: -0.018em; }
          .ltt .porque-quote .hl { color: var(--trigo); font-style: italic; }
          .ltt .porque-quote .nl { font-style: normal; color: var(--papel); }
          .ltt .porque-sign { margin-top: 28px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--papel-42); }
          .ltt .reasons { display: grid; gap: 28px; }
          .ltt .reason { display: grid; grid-template-columns: auto 1fr; gap: 22px; align-items: start; }
          .ltt .reason .mk { width: 44px; height: 44px; flex-shrink: 0; border: 1px solid var(--papel-22); border-radius: 3px; display: grid; place-items: center; color: var(--trigo); }
          .ltt .reason .mk svg { width: 20px; height: 20px; }
          .ltt .reason h4 { font-family: var(--sans); font-weight: 600; font-size: 17px; margin-bottom: 6px; }
          .ltt .reason p { font-size: 15px; color: var(--papel-60); line-height: 1.58; }

          .ltt .resultados { background: var(--tinta-2); border-block: 1px solid var(--papel-07); }
          .ltt .res-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 56px; }
          .ltt .res-card { background: var(--tinta-3); border: 1px solid var(--papel-12); border-radius: 4px; padding: clamp(26px, 2.8vw, 38px); display: flex; flex-direction: column; gap: 16px; transition: border-color 0.3s var(--ease), transform 0.3s var(--ease); }
          .ltt .res-card:hover { border-color: var(--papel-22); transform: translateY(-3px); }
          .ltt .res-sector { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--cuero); }
          .ltt .res-metric { font-family: var(--serif); font-weight: 500; font-size: clamp(40px, 5vw, 60px); line-height: 0.98; letter-spacing: -0.02em; color: var(--trigo); }
          .ltt .res-metric span { font-size: 0.5em; color: var(--papel); }
          .ltt .res-desc { font-size: 14.5px; color: var(--papel-60); line-height: 1.55; }
          .ltt .res-foot { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--papel-12); font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; color: var(--papel-42); text-transform: uppercase; }
          .ltt .res-note { margin-top: 34px; font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; color: var(--papel-42); display: inline-flex; align-items: center; gap: 11px; }
          .ltt .res-note .tick { width: 22px; height: 1px; background: var(--papel-22); }

          .ltt .contacto { position: relative; overflow: hidden; }
          .ltt .contacto::before { content: ""; position: absolute; inset: 0; background: radial-gradient(70% 90% at 50% 0%, rgba(201,162,39,0.10), transparent 60%); pointer-events: none; }
          .ltt .contacto-grid { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px, 6vw, 90px); align-items: start; }
          .ltt .cta-mail { display: inline-flex; align-items: center; gap: 10px; font-family: var(--mono); font-size: 14px; letter-spacing: 0.04em; color: var(--papel); border-bottom: 1px solid var(--papel-22); padding-bottom: 4px; transition: color 0.2s, border-color 0.2s; }
          .ltt .cta-mail:hover { color: var(--trigo); border-color: var(--trigo); }

          .ltt .contact-form { display: grid; gap: 22px; background: var(--tinta-2); border: 1px solid var(--papel-12); border-radius: 6px; padding: clamp(26px, 3vw, 40px); }
          .ltt .contact-form .hp { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
          .ltt .contact-form .field { display: grid; gap: 8px; }
          .ltt .contact-form label { font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--cuero); }
          .ltt .contact-form input, .ltt .contact-form textarea { width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--papel-22); color: var(--papel); font-family: var(--sans); font-size: 15px; padding: 10px 2px; resize: none; transition: border-color 0.2s; }
          .ltt .contact-form input::placeholder, .ltt .contact-form textarea::placeholder { color: var(--papel-42); }
          .ltt .contact-form input:focus, .ltt .contact-form textarea:focus { outline: none; border-color: var(--trigo); }
          .ltt .contact-error { font-family: var(--mono); font-size: 12px; color: #e2836b; }
          .ltt .contact-submit { justify-self: start; border: none; cursor: pointer; }
          .ltt .contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }
          .ltt .contact-done { display: grid; gap: 14px; background: var(--tinta-2); border: 1px solid var(--papel-12); border-radius: 6px; padding: clamp(30px, 4vw, 46px); justify-items: start; }
          .ltt .contact-done-title { font-family: var(--serif); font-weight: 500; font-size: 26px; color: var(--papel); }
          .ltt .contact-done-sub { font-size: 14.5px; color: var(--papel-60); }

          @media (max-width: 880px) {
            .ltt .contacto-grid { grid-template-columns: 1fr; }
          }

          .ltt footer.site { background: var(--tinta); border-top: 1px solid var(--papel-12); padding-block: clamp(48px, 7vh, 80px); }
          .ltt .foot-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 40px; align-items: start; }
          .ltt .foot-brand { display: flex; flex-direction: column; gap: 22px; }
          .ltt .foot-endorse { font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--papel-42); line-height: 1.9; }
          .ltt .foot-endorse a { color: var(--papel-60); border-bottom: 1px solid var(--papel-22); transition: color 0.2s, border-color 0.2s; }
          .ltt .foot-endorse a:hover { color: var(--trigo); border-color: var(--trigo); }
          .ltt .foot-col h5 { font-family: var(--mono); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--cuero); margin-bottom: 16px; }
          .ltt .foot-col a, .ltt .foot-col p { display: block; font-size: 14px; color: var(--papel-60); line-height: 2; transition: color 0.2s; }
          .ltt .foot-col a:hover { color: var(--papel); }
          .ltt .foot-base { margin-top: clamp(40px, 6vh, 64px); padding-top: 24px; border-top: 1px solid var(--papel-12); display: flex; flex-wrap: wrap; gap: 14px 30px; justify-content: space-between; align-items: center; }
          .ltt .foot-base p { font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; color: var(--papel-42); }

          .ltt .reveal { opacity: 0; transform: translateY(26px); transition: opacity 0.8s var(--ease), transform 0.8s var(--ease); }
          .ltt .reveal.in { opacity: 1; transform: none; }
          .ltt .reveal.d1 { transition-delay: 0.08s; }
          .ltt .reveal.d2 { transition-delay: 0.16s; }
          .ltt .reveal.d3 { transition-delay: 0.24s; }
          .ltt .reveal.d4 { transition-delay: 0.32s; }
          @media (prefers-reduced-motion: reduce) {
            .ltt .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
          }

          @media (max-width: 880px) {
            .ltt .problema .body { grid-template-columns: 1fr; gap: 44px; }
            .ltt .porque .body { grid-template-columns: 1fr; gap: 48px; }
            .ltt .res-grid { grid-template-columns: 1fr; }
            .ltt .foot-grid { grid-template-columns: 1fr 1fr; }
            .ltt .foot-brand { grid-column: 1 / -1; }
          }
          .ltt .burger { display: none; width: 44px; height: 44px; flex-direction: column; align-items: center; justify-content: center; gap: 5px; cursor: pointer; }
          .ltt .burger span { display: block; width: 22px; height: 1px; background: var(--papel); transition: transform 0.25s var(--ease), opacity 0.25s var(--ease), width 0.25s var(--ease); }
          .ltt .burger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
          .ltt .burger.open span:nth-child(2) { opacity: 0; width: 0; }
          .ltt .burger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

          .ltt .mobile-menu { position: fixed; inset: 0; z-index: 60; background: var(--tinta-2); display: flex; flex-direction: column; opacity: 0; pointer-events: none; transition: opacity 0.35s var(--ease); }
          .ltt .mobile-menu.open { opacity: 1; pointer-events: auto; }
          .ltt .mobile-menu-head { display: flex; align-items: center; justify-content: space-between; height: 76px; padding-inline: var(--gutter); border-bottom: 1px solid var(--papel-12); }
          .ltt .mobile-menu-close { font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--papel-60); display: flex; align-items: center; gap: 8px; min-height: 44px; cursor: pointer; }
          .ltt .mobile-menu nav { flex: 1; display: flex; flex-direction: column; justify-content: center; padding-inline: var(--gutter); gap: 4px; }
          .ltt .mobile-menu nav a { font-family: var(--serif); font-size: clamp(28px, 8vw, 40px); font-weight: 500; color: var(--papel); padding-block: 16px; border-bottom: 1px solid var(--papel-12); }
          .ltt .mobile-menu-cta { padding: 24px var(--gutter) clamp(32px, 6vh, 56px); }

          @media (max-width: 960px) {
            .ltt .nav-links { display: none; }
            .ltt .burger { display: flex; }
            .ltt .hero-meta { gap: 24px 36px; }
          }
          @media (max-width: 640px) {
            .ltt .hero { padding-top: 108px; padding-bottom: 56px; }
            .ltt .sec-pad { padding-block: 56px; }
          }
          @media (max-width: 720px) {
            .ltt .svc-grid { grid-template-columns: 1fr; }
            .ltt .foot-grid { grid-template-columns: 1fr; }
          }
          @media (max-width: 460px) {
            .ltt .hero-meta .item { flex: 1 1 100%; }
          }
        `}</style>

        {/* ============================== HEADER ============================== */}
        <header className={`site${scrolled ? ' scrolled' : ''}`}>
          <div className="wrap nav">
            <div className="brand-group">
              <a href="/" aria-label="La Trastienda — volver a la web principal" className="mother-link">
                <img src="/images/Logos/imagotipov2.svg" alt="La Trastienda" className="mother-logo" />
              </a>
              <span className="brand-sep" />
              <a className="brand-link" href="#top" aria-label="LTT Consulting — inicio">
                <span className="lockup">
                  <span className="mark">LTT</span>
                  <span className="bar" />
                  <span className="sub">Consulting</span>
                </span>
              </a>
            </div>
            <nav className="nav-links">
              {navItems.map((item) => (
                <a key={item.href} href={item.href}>{item.label}</a>
              ))}
              <a className="nav-cta" href="#contacto">
                Solicitar diagnóstico
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              </a>
            </nav>
            <button
              type="button"
              className={`burger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </header>

        {/* ============================== MENÚ MÓVIL ============================== */}
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
          <div className="mobile-menu-head">
            <span className="lockup" style={{ ['--s' as string]: '24px' }}>
              <span className="mark">LTT</span>
              <span className="bar" />
              <span className="sub">Consulting</span>
            </span>
            <button type="button" className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
              Cerrar ×
            </button>
          </div>
          <nav>
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
            ))}
          </nav>
          <div className="mobile-menu-cta">
            <a className="btn-primary" href="#contacto" onClick={() => setMenuOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>
              Solicitar diagnóstico
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
            </a>
          </div>
        </div>

        {/* ============================== HERO ============================== */}
        <span id="top" />
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="reveal">
              <span className="hero-eyebrow"><span className="dot" /> Consultoría retail · una división de La Trastienda</span>
            </div>
            <h1 className="reveal d1">El potencial ya entra por la puerta. Nosotros lo <em>convertimos en ventas.</em></h1>
            <p className="hero-sub reveal d2">LTT Consulting interviene en tiendas con afluencia que rinden por debajo de su potencial. Optimización comercial, equipos y mando intermedio — con criterio de tienda, no de manual.</p>
            <div className="hero-cta-row reveal d3">
              <a className="btn-primary" href="#contacto">
                Solicitar diagnóstico
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              </a>
              <a className="btn-ghost" href="#servicios">Ver servicios</a>
            </div>

            <div className="hero-meta reveal d4">
              <div className="item">
                <span className="n"><em>20+</em></span>
                <span className="l">Años de retail vivido en tienda</span>
              </div>
              <div className="item">
                <span className="n">Operación</span>
                <span className="l">Diagnóstico sobre el terreno, no en remoto</span>
              </div>
              <div className="item">
                <span className="n">Medible</span>
                <span className="l">Resultados sobre conversión y ticket</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================== PROBLEMA ============================== */}
        <section className="problema sec-pad" id="problema">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker reveal"><span className="idx">01</span><span className="tick" /> El problema</span>
              <h2 className="title reveal d1">Entra gente. Pero el tráfico no se convierte en <em>ventas.</em></h2>
            </div>
            <div className="body">
              <p className="statement reveal d1">La mayoría de las tiendas no tienen un problema de afluencia. Tienen un problema de <em>conversión.</em> El cliente entra, mira y se va — y nadie en la sala sabe exactamente por qué. El potencial está ahí, intacto, cada día que abren la persiana.</p>
              <div className="gap-list reveal d2">
                <div className="gap-item">
                  <span className="num">01</span>
                  <div>
                    <h4>El equipo atiende, pero no vende</h4>
                    <p>Personal correcto y amable que despacha en lugar de acompañar la venta. Falta método comercial, no actitud.</p>
                  </div>
                </div>
                <div className="gap-item">
                  <span className="num">02</span>
                  <div>
                    <h4>El mando intermedio no manda</h4>
                    <p>Encargados que apagan fuegos en vez de dirigir el rendimiento de su tienda y de su gente.</p>
                  </div>
                </div>
                <div className="gap-item">
                  <span className="num">03</span>
                  <div>
                    <h4>Se mide la caja, no la conversión</h4>
                    <p>Sin datos de qué pasa entre la puerta y el ticket, las decisiones se toman a ciegas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================== SERVICIOS ============================== */}
        <section className="servicios sec-pad" id="servicios">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker reveal"><span className="idx">02</span><span className="tick" /> Servicios</span>
              <h2 className="title reveal d1">Cuatro frentes para cerrar la brecha entre <em>tráfico y venta.</em></h2>
            </div>
            <div className="svc-grid">
              {services.map((svc, i) => (
                <article key={svc.title} className={`svc reveal${i % 2 ? ' d1' : ''}`}>
                  <div className="svc-top">
                    <span className="svc-n">{svc.n}</span>
                    <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{svc.icon}</svg>
                  </div>
                  <h3>{svc.title}</h3>
                  <p>{svc.description}</p>
                  <div className="tags">
                    {svc.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============================== POR QUÉ LTT ============================== */}
        <section className="porque sec-pad" id="porque">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker reveal"><span className="idx">03</span><span className="tick" /> Por qué LTT</span>
            </div>
            <div className="body">
              <div className="reveal">
                <p className="porque-quote">Décadas de retail <span className="hl">vivido</span> detrás. <span className="nl">No un PowerPoint.</span></p>
                <p className="porque-sign">LTT Consulting · brazo profesional de La Trastienda</p>
              </div>
              <div className="reasons">
                {reasons.map((reason, i) => (
                  <div key={reason.title} className={`reason reveal d${i + 1}`}>
                    <span className="mk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{reason.icon}</svg></span>
                    <div>
                      <h4>{reason.title}</h4>
                      <p>{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================== RESULTADOS ============================== */}
        <section className="resultados sec-pad" id="resultados">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker reveal"><span className="idx">04</span><span className="tick" /> Resultados</span>
              <h2 className="title reveal d1">El trabajo se mide donde importa: <em>en la caja.</em></h2>
            </div>
            <div className="res-grid">
              {results.map((r, i) => (
                <article key={r.sector} className={`res-card reveal d${i}`}>
                  <span className="res-sector">{r.sector}</span>
                  <span className="res-metric">{r.metric}<span>{r.unit}</span></span>
                  <p className="res-desc">{r.description}</p>
                  <span className="res-foot">{r.foot}</span>
                </article>
              ))}
            </div>
            <span className="res-note reveal"><span className="tick" /> Casos reales anonimizados. Referencias con nombre disponibles bajo acuerdo.</span>
          </div>
        </section>

        {/* ============================== CONTACTO ============================== */}
        <section className="contacto sec-pad" id="contacto">
          <div className="wrap contacto-grid">
            <div className="reveal">
              <span className="kicker"><span className="idx">05</span><span className="tick" /> Contacto</span>
              <h2 className="title" style={{ marginTop: 22, marginBottom: 18 }}>Pongamos a rendir lo que <em>ya entra por la puerta.</em></h2>
              <p className="lede">Empezamos por un diagnóstico sobre el terreno de una de sus tiendas. Sin compromiso y con conclusiones concretas desde la primera visita.</p>
            </div>
            <div className="reveal d1">
              <LttContactForm />
            </div>
          </div>
        </section>

        {/* ============================== FOOTER ============================== */}
        <footer className="site">
          <div className="wrap">
            <div className="foot-grid">
              <div className="foot-brand">
                <span className="lockup" style={{ ['--s' as string]: '30px' }}>
                  <span className="mark">LTT</span>
                  <span className="bar" />
                  <span className="sub">Consulting</span>
                </span>
                <p className="foot-endorse">Una división de <a href="/">La Trastienda</a><br />Consultoría retail profesional</p>
              </div>
              <div className="foot-col">
                <h5>Servicios</h5>
                <a href="#servicios">Optimización comercial</a>
                <a href="#servicios">Formación de equipos</a>
                <a href="#servicios">Mando intermedio</a>
                <a href="#servicios">Onboarding</a>
              </div>
              <div className="foot-col">
                <h5>Contacto</h5>
                <a href="#contacto">Solicitar diagnóstico</a>
                <p>Visita sobre el terreno</p>
              </div>
            </div>
            <div className="foot-base">
              <p>© 2026 La Trastienda · LTT Consulting</p>
              <p>Criterio de tienda, no de manual</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
