'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import Image from 'next/image'
import { getCalApi } from '@calcom/embed-react'
import YoutubeConsentGate from '@/components/YoutubeConsentGate'
import ManageCookiesButton from '@/components/ManageCookiesButton'
import { submitContact, type ContactResult } from '@/app/actions/contact'

// ── Data ──────────────────────────────────────────────────────────────────────

const navLinks = [
  { href: '#que-hacemos',    label: 'Qué hacemos' },
  { href: '#programas',      label: 'Programas' },
  { href: '#quienes',        label: 'Quiénes somos' },
  { href: '#campus',         label: 'Campus' },
  { href: '#podcast',        label: 'Podcast' },
  { href: '/ltt-consulting', label: 'LTT Consulting' },
  { href: '/blog',           label: 'Blog' },
]

// Oculto temporalmente (bloques de "Qué hacemos") — se conservan por si se reactivan
/*
const pillars = [
  {
    icon: <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.8 5.5 21l2-7.5L2 9h7z" />,
    title: 'Consultoría de Ejecución',
    desc: 'Diagnóstico en tienda y rediseño del método comercial para convertir tráfico en ventas.',
    href: '/ltt-consulting',
  },
  {
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    title: 'Formación de Managers',
    desc: 'Liderazgo y mando intermedio con casos reales de la propia tienda, no de manual.',
    href: '#programas',
  },
  {
    icon: <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />,
    title: 'Desarrollo de Talento',
    desc: 'Preparamos a personas para crecer en retail: de vendedor a manager, con criterio real.',
    href: '#campus',
  },
  {
    icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    title: 'Resultados Medibles',
    desc: 'Conversión, ticket medio y unidades por venta — trabajamos sobre indicadores, no intuiciones.',
    href: '/ltt-consulting#porque',
  },
]
*/

const roadmapSteps = [
  { n: '01', label: 'Observación',  desc: 'Diagnóstico sobre el terreno, en tienda.' },
  { n: '02', label: 'Diagnóstico',  desc: 'Identificamos la brecha entre tráfico y venta.' },
  { n: '03', label: 'Formación',    desc: 'Equipos y mandos intermedios, con casos propios.' },
  { n: '04', label: 'Ejecución',    desc: 'El método se instala en el día a día de la tienda.' },
  { n: '05', label: 'Acompañamiento', desc: 'Seguimos junto al equipo para que el cambio se consolide.' },
  { n: '06', label: 'Resultados',   desc: 'Conversión y ticket medio, medidos y sostenidos.' },
]

const marqueeItems = [
  'Método de Ejecución en Tienda',
  'Desarrollo de Talento',
  'Liderazgo en el punto de venta',
  'Formación para Managers',
  'Rutinas y hábitos',
  'Empleabilidad',
  'Profesionalización del Retail',
  'Workshops',
  'Resultados reales',
]

const founders = [
  {
    name: 'Javi',
    role: 'Ventas & Alianzas',
    description:
      'He desarrollado mi carrera en retail, pasando por marcas como Decathlon, Fnac, Primark y Casa del Libro, desde posiciones de venta hasta dirección de tienda. Siempre he trabajado muy cerca de las personas, ayudando a sacar su mejor versión en el día a día. Hoy ayudo a jóvenes a entender qué buscan las empresas y a afrontar procesos reales con seguridad y criterio.',
    photo: '/images/PerfilJavi.jpg',
  },
  {
    name: 'Yeray',
    role: 'Operaciones & Instituciones',
    description:
      'He desarrollado mi trayectoria en retail creciendo desde tienda hasta posiciones de dirección, en compañías como MediaMarkt, Fnac y Casa del Libro. A lo largo de este recorrido he trabajado en entornos exigentes, entendiendo cómo se toman decisiones, cómo se construyen equipos y qué hace que un perfil encaje de verdad en tienda. Hoy trabajo en cómo transformar ese conocimiento en una preparación útil y real para quienes quieren entrar en el sector.',
    photo: '/images/PerfilYeray.jpg',
  },
  {
    name: 'David',
    role: 'Tecnología & Identidad Visual',
    description:
      'Mi trayectoria en retail me dio una visión de lo que el sector necesita de verdad. En La Trastienda llevo la identidad visual y la parte tecnológica — me encargo de que el proyecto tenga una presencia coherente, cuidada y que funcione.',
    photo: '/images/PerfilDavid.jpg',
  },
]

const campusFeatures = [
  {
    label: 'Formación online',
    desc: 'Cursos específicos del sector Retail accesibles desde cualquier dispositivo.',
  },
  {
    label: 'Seguimiento personal',
    desc: 'Tu propio dashboard con progreso, certificados y próximos pasos.',
  },
  {
    label: 'Recursos exclusivos',
    desc: 'Materiales, plantillas y guías prácticas para el comercio.',
  },
  {
    label: 'Comunidad',
    desc: 'Conecta con otros profesionales del sector Retail.',
  },
]

const campusTopics = [
  {
    topic: 'Atención al cliente',
    desc: 'Técnicas y herramientas para la excelencia en el trato al cliente presencial.',
  },
  {
    topic: 'Gestión de almacén',
    desc: 'Procesos de recepción, organización y distribución de mercancía en tienda.',
  },
  {
    topic: 'Visual merchandising',
    desc: 'Cómo presentar el producto para maximizar su atractivo y las ventas.',
  },
]

const podcasts = [
  {
    videoId: 'A6Cme7AnbtI',
    episode: '01',
    title: 'De vendedor a Business Manager',
    guest: 'con Iván Alcántara',
    thumbnail: '/images/Podcast/miniatura-ivan-alcantara.png',
  },
  {
    videoId: 'QD3x4ZIEeOs',
    episode: '02',
    title: 'De vendedor a Responsable de Talento',
    guest: 'con Manuel del Barrio',
    thumbnail: '/images/Podcast/miniatura-manuel-del-barrio.png',
  },
  {
    videoId: 'VibCuRyc3Do',
    episode: '03',
    title: 'De vendedor a Área Manager',
    guest: 'con Alex Vila',
    thumbnail: '/images/Podcast/miniatura-alex-villa.png',
  },
  {
    videoId: null as string | null,
    episode: '04',
    title: 'Próximamente',
    guest: 'en camino',
    thumbnail: null as string | null,
  },
]

// ── Contact Form ──────────────────────────────────────────────────────────────

type Audience = 'particular' | 'empresa' | 'institucion' | null

function ContactForm() {
  const [audience, setAudience] = useState<Audience>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isPending) return
    const fd = new FormData(e.currentTarget)
    if (audience) fd.set('audience', audience)
    startTransition(async () => {
      const result: ContactResult = await submitContact(fd)
      if (result.success) {
        setStatus('success')
        formRef.current?.reset()
        setAudience(null)
      } else {
        setStatus('error')
        setErrorMsg(result.error)
      }
    })
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-6 py-10">
        <div className="h-px w-10 bg-acento" />
        <h3 className="font-display text-3xl font-medium text-tinta tracking-[-0.02em]">
          Mensaje enviado
        </h3>
        <p className="font-sans text-base text-cuero leading-relaxed">
          Nos pondremos en contacto contigo pronto.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="font-mono text-[10px] text-cuero uppercase tracking-[0.1em] hover:text-tinta transition-colors duration-200"
        >
          Enviar otro mensaje →
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} className="space-y-8" onSubmit={handleSubmit}>
      {/* Honeypot anti-spam */}
      <input type="text" name="website" className="hidden" tabIndex={-1} aria-hidden="true" />

      <div>
        <label className="block font-mono text-[10px] text-cuero uppercase tracking-[0.1em] mb-3">
          Soy...
        </label>
        <div className="flex gap-2">
          {(
            [
              { id: 'particular', label: 'Particular' },
              { id: 'empresa', label: 'Empresa' },
              { id: 'institucion', label: 'Institución' },
            ] as { id: NonNullable<Audience>; label: string }[]
          ).map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAudience(a.id)}
              className={`btn flex-1 font-mono text-[10px] uppercase tracking-[0.08em] border py-3 cursor-pointer min-h-[44px] ${
                audience === a.id
                  ? 'bg-tinta text-papel border-tinta'
                  : 'text-tinta border-lino hover:border-tinta'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-7">
        <div>
          <label
            htmlFor="name"
            className="block font-mono text-[10px] text-cuero uppercase tracking-[0.1em] mb-2"
          >
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full border-b border-lino bg-transparent pb-3 font-sans text-base text-tinta placeholder:text-lino focus:border-tinta focus:outline-none transition-colors duration-200"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block font-mono text-[10px] text-cuero uppercase tracking-[0.1em] mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full border-b border-lino bg-transparent pb-3 font-sans text-base text-tinta placeholder:text-lino focus:border-tinta focus:outline-none transition-colors duration-200"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block font-mono text-[10px] text-cuero uppercase tracking-[0.1em] mb-2"
          >
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            className="w-full border-b border-lino bg-transparent pb-3 font-sans text-base text-tinta placeholder:text-lino focus:border-tinta focus:outline-none transition-colors duration-200 resize-none"
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>
      </div>

      {status === 'error' && (
        <p role="alert" className="font-mono text-[10px] text-red-700 tracking-[0.06em]">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn group w-full font-sans text-[11px] font-medium text-papel bg-tinta uppercase tracking-[0.08em] py-4 hover:bg-acento hover:text-tinta cursor-pointer min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="inline-flex items-center gap-2">
          {isPending ? 'Enviando...' : 'Enviar mensaje'}
          {!isPending && (
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          )}
        </span>
      </button>
    </form>
  )
}

// ── Home ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expandedFounders, setExpandedFounders] = useState<Record<number, boolean>>({})

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: 'reunion' })
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' })
    })()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [navOpen])

  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main className="bg-papel overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-30 anim-nav flex transition-shadow duration-500 ${
          scrolled ? 'shadow-[0_2px_32px_rgba(26,23,20,0.12)]' : ''
        }`}
      >
        {/* Bloque oscuro izquierdo — solo desktop */}
        <div
          className={`hidden md:flex bg-tinta items-center justify-center shrink-0 w-52 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled ? 'py-3' : 'py-5'
          }`}
        >
          <a href="/" className="cursor-pointer block">
            <img
              src="/images/Logos/imagotipov2.svg"
              alt="La Trastienda"
              className="h-9 w-auto brightness-0 invert"
            />
          </a>
        </div>

        {/* Divisor vertical acento */}
        <div className="hidden md:block w-px bg-acento shrink-0" />

        {/* Nav principal */}
        <nav
          className={`flex-1 flex items-center bg-papel transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled ? 'px-5 py-3' : 'px-7 py-5'
          }`}
        >
          {/* Logo mobile */}
          <a href="/" className="md:hidden cursor-pointer mr-auto">
            <img src="/images/Logos/imagotipov2.svg" alt="La Trastienda" className="h-8 w-auto" />
          </a>

          {/* Links numerados — desktop */}
          <div className="hidden md:flex items-center gap-7 flex-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link font-mono text-[10px] font-medium text-cuero hover:text-tinta transition-colors duration-200 tracking-[0.1em] uppercase cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + burger */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <a
              href="#contacto"
              className="btn hidden md:inline-flex items-center gap-2 font-mono text-[10px] font-medium text-papel bg-tinta px-5 min-h-[40px] hover:bg-acento hover:text-tinta tracking-[0.1em] uppercase cursor-pointer"
            >
              Contactar
            </a>

            <button
              type="button"
              onClick={() => setNavOpen(!navOpen)}
              className="md:hidden w-11 h-11 flex flex-col items-center justify-center gap-[5px] cursor-pointer"
              aria-label={navOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={navOpen}
            >
              <span className={`block w-6 h-px bg-tinta origin-center transition-all duration-300 ${navOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
              <span className={`block h-px bg-tinta transition-all duration-300 ${navOpen ? 'w-0 opacity-0' : 'w-3.5'}`} />
              <span className={`block w-6 h-px bg-tinta origin-center transition-all duration-300 ${navOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Overlay mobile fullscreen */}
      <div
        aria-hidden={!navOpen}
        className={`md:hidden fixed inset-0 z-40 flex transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          navOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Tira tinta izquierda con texto vertical */}
        <div
          className={`bg-tinta flex flex-col items-center justify-between py-6 shrink-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            navOpen ? 'w-14' : 'w-0 overflow-hidden'
          }`}
        >
          <div className="w-px flex-1 bg-acento/25 mx-auto" />
          <span
            className="font-mono text-[8px] text-acento/60 uppercase tracking-[0.22em] my-6 select-none"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            La Trastienda
          </span>
          <div className="w-px flex-1 bg-acento/25 mx-auto" />
        </div>

        {/* Contenido derecho */}
        <div className="flex-1 bg-papel flex flex-col">
          {/* Header del overlay */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-lino/60">
            <img src="/images/Logos/imagotipov2.svg" alt="La Trastienda" className="h-8 w-auto" />
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              className="font-mono text-[10px] text-cuero uppercase tracking-[0.12em] min-h-[44px] flex items-center gap-2 hover:text-tinta transition-colors duration-200 cursor-pointer"
              aria-label="Cerrar menú"
            >
              Cerrar <span className="text-acento text-base leading-none">×</span>
            </button>
          </div>

          {/* Links Newsreader grandes */}
          <nav className="flex-1 flex flex-col justify-center px-6">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setNavOpen(false)}
                className={`group flex items-baseline gap-4 py-[1.1rem] border-b border-lino/50 transition-all duration-500 ${
                  navOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: navOpen ? `${80 + i * 55}ms` : '0ms' }}
              >
                <span className="font-mono text-[9px] text-acento tracking-[0.14em] tabular-nums shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[2rem] font-medium text-tinta leading-none tracking-[-0.025em] group-hover:text-acento transition-colors duration-200">
                  {link.label}
                </span>
                <span className="ml-auto text-tinta/20 group-hover:text-acento group-hover:translate-x-1 transition-all duration-200 inline-block">
                  →
                </span>
              </a>
            ))}
          </nav>

          {/* CTA bottom */}
          <div className="px-6 py-6 border-t border-lino/60">
            <a
              href="#contacto"
              onClick={() => setNavOpen(false)}
              className="btn w-full font-sans text-[11px] font-medium text-papel bg-tinta py-4 uppercase tracking-[0.1em] text-center flex items-center justify-center gap-2 cursor-pointer min-h-[50px] hover:bg-acento hover:text-tinta"
            >
              Contactar ahora →
            </a>
          </div>
        </div>
      </div>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="min-h-[100svh] md:min-h-screen flex flex-col">

        {/* Split layout: spine tinta + contenido */}
        <div className="flex flex-1">


          {/* Contenido hero */}
          <div className="flex-1 relative flex flex-col justify-center px-6 md:px-14 pt-20 md:pt-24 pb-8 md:pb-10 overflow-hidden">

            {/* Ghost RETAIL */}
            <div
              aria-hidden
              className="pointer-events-none select-none absolute right-[-3%] top-1/2 -translate-y-1/2 font-display font-medium leading-none text-tinta/[0.04]"
              style={{ fontSize: 'clamp(9rem, 19vw, 18rem)', letterSpacing: '-0.04em' }}
            >
              RETAIL
            </div>

            <div className="relative z-10">

              {/* Eyebrow */}
              <div className="anim-hero-1 flex items-center gap-4 mb-6 md:mb-10">
                <div className="h-px w-10 bg-acento anim-line" />
                <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.18em]">
                  Ejecución en tienda · Formación · Talento · Retail España
                </span>
              </div>

              {/* H1 */}
              <h1
                className="anim-hero-2 font-display font-medium text-tinta tracking-[-0.025em] leading-[1.05] mb-6 md:mb-10 max-w-[22ch]"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
              >
                Hacemos del retail un{' '}
                <span className="relative inline-block">
                  <em className="italic text-acento">motor de oportunidades.</em>
                  <span
                    aria-hidden
                    className="absolute left-0 bottom-1 h-px bg-acento/30 anim-line"
                    style={{ right: 0 }}
                  />
                </span>
              </h1>

              {/* Sub */}
              <p className="anim-hero-3 font-sans text-base md:text-lg text-cuero leading-relaxed mb-8 md:mb-12 max-w-[48ch]">
                Conectamos <strong className="font-semibold text-tinta underline decoration-acento decoration-2 underline-offset-4">empresas, profesionales e instituciones</strong> para
                fortalecer el <strong className="font-semibold text-acento">talento y la empleabilidad</strong> en
                las tiendas.
              </p>

              {/* CTAs */}
              <div className="anim-hero-4 flex flex-col sm:flex-row gap-3 mb-10 md:mb-16">
                <a
                  href="#programas"
                  className="btn group w-full sm:w-auto inline-flex items-center justify-center gap-2 font-sans text-[11px] font-medium text-tinta bg-acento px-8 min-h-[48px] uppercase tracking-[0.08em] hover:bg-tinta hover:text-papel cursor-pointer"
                >
                  Soy empresa
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                <a
                  href="#programas"
                  className="btn group w-full sm:w-auto inline-flex items-center justify-center gap-2 font-sans text-[11px] font-medium text-tinta border border-tinta px-8 min-h-[48px] uppercase tracking-[0.08em] hover:bg-tinta hover:text-papel cursor-pointer"
                >
                  Quiero formarme
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                <a
                  href="#programas"
                  className="btn group w-full sm:w-auto inline-flex items-center justify-center gap-2 font-sans text-[11px] font-medium text-cuero border border-lino px-8 min-h-[48px] uppercase tracking-[0.08em] hover:border-tinta hover:text-tinta cursor-pointer"
                >
                  Soy institución
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="border-t border-lino/40 py-3 overflow-hidden bg-papel/80">
          <div className="flex whitespace-nowrap anim-marquee">
            {[0, 1].map((i) => (
              <div key={i} className="flex items-center shrink-0">
                {marqueeItems.map((item, j) => (
                  <span key={j} className="font-mono text-[9px] text-cuero/50 uppercase tracking-[0.14em]">
                    <span className="px-7">{item}</span>
                    <span className="text-acento/30">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ HACEMOS ───────────────────────────────────── */}
      <section id="que-hacemos" className="py-16 md:py-28 lg:py-36 bg-blanco border-t border-lino/40 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="mb-16 max-w-[62ch]" data-reveal>
            <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-4">
              Qué hacemos
            </span>
            <h2
              className="font-display font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Mejoramos el resultado de <em className="italic text-acento">tus tiendas.</em>
            </h2>
            <p className="font-sans text-base text-cuero leading-relaxed">
              Implantamos <strong className="font-semibold text-tinta underline decoration-acento/40 underline-offset-4">sistemas de trabajo, hábitos y rutinas</strong> que
              aumentan el rendimiento de los equipos y mejoran los KPIs del negocio.
              No nos quedamos en las recomendaciones: <strong className="font-semibold text-tinta underline decoration-acento/40 underline-offset-4">trabajamos con tu equipo hasta
              que los cambios forman parte del día a día</strong>.
            </p>
          </div>

          {/* Hoja de ruta */}
          <div data-reveal>
            <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-8 sm:mb-10">
              Nuestra hoja de ruta
            </span>

            {/* Mobile: stepper vertical compacto */}
            <div className="sm:hidden flex flex-col">
              {roadmapSteps.map((s, i) => (
                <div key={s.n} className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <span className="w-8 h-8 rounded-full border border-acento/40 flex items-center justify-center font-mono text-[10px] text-acento tabular-nums shrink-0">
                      {s.n}
                    </span>
                    {i < roadmapSteps.length - 1 && <span className="w-px flex-1 bg-lino my-1" />}
                  </div>
                  <div className="pb-6">
                    <h4 className="font-display text-base font-medium text-tinta tracking-[-0.01em] mb-1">
                      {s.label}
                    </h4>
                    {/* {s.desc} — oculto temporalmente */}
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet+: divide horizontal original */}
            <div className="hidden sm:flex sm:flex-row sm:divide-x divide-lino">
              {roadmapSteps.map((s, i) => (
                <div
                  key={s.n}
                  data-reveal
                  data-delay={String(i + 1)}
                  className="group flex-1 sm:px-7 first:sm:pl-0 last:sm:pr-0"
                >
                  <span className="block font-display text-[56px] md:text-[64px] leading-none tracking-[-0.03em] text-lino tabular-nums mb-4 transition-colors duration-500 group-hover:text-acento/40">
                    {s.n}
                  </span>
                  <h4 className="font-display text-base font-medium text-tinta tracking-[-0.01em] mb-2">
                    {s.label}
                  </h4>
                  {/* <p className="font-sans text-xs text-cuero leading-relaxed max-w-[22ch]">{s.desc}</p> — oculto temporalmente */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAMAS ─────────────────────────────────────── */}
      <section id="programas" className="py-16 md:py-28 lg:py-36 bg-papel scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="mb-16" data-reveal>
            <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-4">
              Lo que ofrecemos
            </span>
            <h2
              className="font-display font-medium text-tinta leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Programas
            </h2>
          </div>

          {/* Mobile: carrusel horizontal */}
          <div className="sm:hidden -mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Particulares */}
            <div className="shrink-0 w-[86%] snap-start bg-blanco border border-lino/50 p-6 flex flex-col">
              <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-5">
                Soy Profesional
              </div>
              <h3 className="font-display text-2xl font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-4">
                Formación <em>real</em> para crecer en Retail
              </h3>
              <p className="font-sans text-sm text-cuero leading-relaxed mb-6 line-clamp-3">
                Si quieres dar el salto a manager o mando intermedio, tenemos formación
                práctica orientada a resultados: liderazgo, rutinas de tienda y
                capacidad de ejecución.
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  'Formación práctica orientada a la ejecución',
                  'Mentorías y sesiones 1:1',
                  'Comunidad de profesionales del Retail',
                ].map((item) => (
                  <li key={item} className="font-sans text-sm text-tinta flex items-start gap-3">
                    <span className="text-acento font-medium mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#campus"
                className="btn inline-flex items-center gap-2 self-start font-sans text-[11px] font-medium text-tinta uppercase tracking-[0.08em] border border-tinta px-6 min-h-[44px] cursor-pointer"
              >
                Ver Campus →
              </a>
            </div>

            {/* Empresas */}
            <div className="shrink-0 w-[86%] snap-start bg-tinta p-6 flex flex-col">
              <div className="font-mono text-[9px] text-acento uppercase tracking-[0.16em] mb-5">
                Soy Empresa
              </div>
              <h3 className="font-display text-2xl font-medium text-papel leading-[1.05] tracking-[-0.02em] mb-4">
                Método de <em>Ejecución</em> en Tienda
              </h3>
              <p className="font-sans text-sm text-papel/60 leading-relaxed mb-6 line-clamp-3">
                Ponemos el foco en tus store managers: liderazgo real de tienda,
                rutinas que se sostienen en el tiempo y resultados homogéneos
                entre puntos de venta.
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  'Método de Ejecución en Tienda',
                  'Formación de managers y workshops',
                  'Desarrollo de talento y Retail Analytics',
                ].map((item) => (
                  <li key={item} className="font-sans text-sm text-papel/75 flex items-start gap-3">
                    <span className="text-acento font-medium mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#que-hacemos"
                className="btn inline-flex items-center gap-2 self-start font-sans text-[11px] font-medium text-papel uppercase tracking-[0.08em] border border-papel/30 px-6 min-h-[44px] cursor-pointer"
              >
                Ver método →
              </a>
            </div>

            {/* Instituciones */}
            <div className="shrink-0 w-[86%] snap-start bg-blanco border border-lino/50 p-6 flex flex-col">
              <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-5">
                Soy Institución
              </div>
              <h3 className="font-display text-2xl font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-4">
                Alianzas con <em>centros y asociaciones</em>
              </h3>
              <p className="font-sans text-sm text-cuero leading-relaxed mb-6 line-clamp-3">
                Trabajamos con centros de FP, cámaras de comercio y asociaciones
                sectoriales para acercar el retail real a sus alumnos y asociados.
              </p>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  'Convenios de prácticas con centros de FP',
                  'Colaboración con cámaras de comercio',
                  'Formación a medida para asociaciones',
                ].map((item) => (
                  <li key={item} className="font-sans text-sm text-tinta flex items-start gap-3">
                    <span className="text-acento font-medium mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#instituciones"
                className="btn inline-flex items-center gap-2 self-start font-sans text-[11px] font-medium text-tinta uppercase tracking-[0.08em] border border-tinta px-6 min-h-[44px] cursor-pointer"
              >
                Ver programa →
              </a>
            </div>
          </div>

          {/* Tablet+: grid original */}
          <div className="hidden sm:grid md:grid-cols-3 gap-6">
            {/* Particulares */}
            <div
              data-reveal
              data-delay="1"
              className="bg-blanco border border-lino/50 p-10 md:p-12 hover:border-acento/40 hover:shadow-[0_4px_24px_rgba(26,23,20,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-8">
                Soy Profesional
              </div>
              <h3
                className="font-display font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-6"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                Formación <em>real</em> para crecer en Retail
              </h3>
              <p className="font-sans text-base text-cuero leading-relaxed mb-8">
                Si quieres dar el salto a manager o mando intermedio, tenemos formación
                práctica orientada a resultados: liderazgo, rutinas de tienda y
                capacidad de ejecución.
              </p>
              <ul className="space-y-3 mb-10 flex-1">
                {[
                  'Formación práctica orientada a la ejecución',
                  'Mentorías y sesiones 1:1',
                  'Comunidad de profesionales del Retail',
                ].map((item) => (
                  <li key={item} className="font-sans text-sm text-tinta flex items-start gap-3">
                    <span className="text-acento font-medium mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#campus"
                className="btn group/btn inline-flex items-center gap-2 self-start font-sans text-[11px] font-medium text-tinta uppercase tracking-[0.08em] border border-tinta px-6 min-h-[44px] hover:bg-tinta hover:text-papel cursor-pointer"
              >
                Ver Campus
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </a>
            </div>

            {/* Empresas */}
            <div
              data-reveal
              data-delay="2"
              className="bg-tinta p-10 md:p-12 flex flex-col group ring-1 ring-transparent hover:ring-acento/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="font-mono text-[9px] text-acento uppercase tracking-[0.16em] mb-8">
                Soy Empresa
              </div>
              <h3
                className="font-display font-medium text-papel leading-[1.05] tracking-[-0.02em] mb-6"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                Método de <em>Ejecución</em> en Tienda
              </h3>
              <p className="font-sans text-base text-papel/60 leading-relaxed mb-8">
                Ponemos el foco en tus store managers: liderazgo real de tienda,
                rutinas que se sostienen en el tiempo y resultados homogéneos
                entre puntos de venta.
              </p>
              <ul className="space-y-3 mb-10 flex-1">
                {[
                  'Método de Ejecución en Tienda',
                  'Formación de managers y workshops',
                  'Desarrollo de talento y Retail Analytics',
                ].map((item) => (
                  <li key={item} className="font-sans text-sm text-papel/75 flex items-start gap-3">
                    <span className="text-acento font-medium mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#que-hacemos"
                className="btn group/btn inline-flex items-center gap-2 self-start font-sans text-[11px] font-medium text-papel uppercase tracking-[0.08em] border border-papel/30 px-6 min-h-[44px] hover:bg-acento hover:text-tinta hover:border-acento cursor-pointer"
              >
                Ver método
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </a>
            </div>

            {/* Instituciones */}
            <div
              data-reveal
              data-delay="3"
              className="bg-blanco border border-lino/50 p-10 md:p-12 hover:border-acento/40 hover:shadow-[0_4px_24px_rgba(26,23,20,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-8">
                Soy Institución
              </div>
              <h3
                className="font-display font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-6"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                Alianzas con <em>centros y asociaciones</em>
              </h3>
              <p className="font-sans text-base text-cuero leading-relaxed mb-8">
                Trabajamos con centros de FP, cámaras de comercio y asociaciones
                sectoriales para acercar el retail real a sus alumnos y asociados.
              </p>
              <ul className="space-y-3 mb-10 flex-1">
                {[
                  'Convenios de prácticas con centros de FP',
                  'Colaboración con cámaras de comercio',
                  'Formación a medida para asociaciones',
                ].map((item) => (
                  <li key={item} className="font-sans text-sm text-tinta flex items-start gap-3">
                    <span className="text-acento font-medium mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#instituciones"
                className="btn group/btn inline-flex items-center gap-2 self-start font-sans text-[11px] font-medium text-tinta uppercase tracking-[0.08em] border border-tinta px-6 min-h-[44px] hover:bg-tinta hover:text-papel cursor-pointer"
              >
                Ver programa
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSTITUCIONES ─────────────────────────────────── */}
      <section id="instituciones" className="py-16 md:py-28 lg:py-36 bg-tinta scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="mb-16 max-w-[62ch]" data-reveal>
            <span className="block font-mono text-[9px] text-acento uppercase tracking-[0.16em] mb-4">
              Para instituciones
            </span>
            <h2
              className="font-display font-medium text-papel leading-[1.05] tracking-[-0.02em] mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Alianzas con centros y asociaciones
            </h2>
            <p className="font-sans text-base text-papel/60 leading-relaxed">
              Sabemos que a los centros de FP les cuesta conseguir prácticas y convenios
              reales con empresas de retail. Tendemos ese puente con centros educativos,
              cámaras de comercio y asociaciones sectoriales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Centros educativos y FP',
                desc: 'Convenios de prácticas con empresas de retail reales, para que tus alumnos hagan prácticas de verdad.',
              },
              {
                title: 'Cámaras de comercio',
                desc: 'Programas formativos y jornadas para las empresas asociadas a tu cámara.',
              },
              {
                title: 'Asociaciones sectoriales',
                desc: 'Contenido y formación a medida para los socios de tu asociación.',
              },
            ].map((item, i) => (
              <div
                key={item.title}
                data-reveal
                data-delay={String(i + 1)}
                className="border border-papel/15 p-8 hover:border-acento/40 transition-colors duration-300"
              >
                <h3 className="font-display text-xl font-medium text-papel mb-3">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-papel/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <a
            data-reveal
            href="#contacto"
            className="btn group/btn mt-12 inline-flex items-center gap-2 font-sans text-[11px] font-medium text-tinta bg-acento px-8 min-h-[48px] uppercase tracking-[0.08em] hover:bg-papel cursor-pointer"
          >
            Hablar con el equipo
            <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </a>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ─────────────────────────────────── */}
      <section id="quienes" className="bg-tinta pt-16 md:pt-28 lg:pt-36 pb-16 md:pb-20 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">

          {/* Header */}
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div data-reveal>
              <span className="block font-mono text-[9px] text-acento uppercase tracking-[0.16em] mb-4">
                El equipo
              </span>
              <h2
                className="font-display font-medium text-papel leading-[1.05] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
              >
                Quiénes somos
              </h2>
            </div>
            <p
              data-reveal
              data-delay="2"
              className="font-sans text-sm text-papel/40 max-w-[34ch] leading-relaxed md:text-right"
            >
              Tres personas unidas por la convicción de que el Retail necesita una nueva mirada.
            </p>
          </div>

          {/* Mobile: carrusel horizontal */}
          <div className="sm:hidden -mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {founders.map((founder, i) => (
              <div key={founder.name} className="shrink-0 w-[80%] snap-start bg-papel/[0.03] border border-papel/10 p-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-1 ring-papel/10">
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-display text-xl font-medium text-papel tracking-[-0.01em] mb-1">
                  {founder.name}
                </h3>
                <div className="font-mono text-[9px] text-acento uppercase tracking-[0.14em] mb-4">
                  {founder.role}
                </div>
                <p
                  className={`font-sans text-sm text-papel/60 leading-relaxed ${
                    expandedFounders[i] ? '' : 'line-clamp-4'
                  }`}
                >
                  {founder.description}
                </p>
                {!expandedFounders[i] && (
                  <button
                    type="button"
                    onClick={() => setExpandedFounders((prev) => ({ ...prev, [i]: true }))}
                    className="mt-2 self-start font-mono text-[9px] text-acento uppercase tracking-[0.1em] cursor-pointer"
                  >
                    Leer más →
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tablet+: grid original */}
          <div className="hidden sm:grid md:grid-cols-3 gap-px bg-papel/8">
            {founders.map((founder, i) => (
              <div
                key={founder.name}
                data-reveal
                data-delay={String(i + 1)}
                className="bg-tinta p-8 md:p-10 hover:bg-papel/[0.04] hover:-translate-y-1 transition duration-300 group cursor-default"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-5 ring-1 ring-papel/10">
                  <Image
                    src={founder.photo}
                    alt={founder.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-display text-2xl font-medium text-papel tracking-[-0.01em] mb-1">
                  {founder.name}
                </h3>
                <div className="font-mono text-[9px] text-acento uppercase tracking-[0.14em] mb-5">
                  {founder.role}
                </div>
                <p className="font-sans text-sm text-papel/60 leading-relaxed">
                  {founder.description}
                </p>
                <div className="mt-8 h-px bg-papel/10 group-hover:bg-acento/25 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRE-CONTACTO ──────────────────────────────────── */}
      <section className="bg-tinta py-10 md:py-14">
        <div className="max-w-[720px] mx-auto px-6 text-center" data-reveal>
          <div className="w-12 h-0.5 bg-acento mx-auto mb-10" aria-hidden="true" />
          <h2
            className="font-display font-medium text-papel leading-[1.05] tracking-[-0.02em] mb-10"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}
          >
            Convertimos la estrategia en{' '}
            <em className="italic text-acento">resultados reales.</em>
          </h2>
          <a
            href="#contacto"
            className="btn group inline-flex items-center gap-2 font-sans text-[11px] font-medium text-tinta bg-acento px-8 min-h-[48px] uppercase tracking-[0.08em] hover:bg-papel cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento"
          >
            Hablemos
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </section>

      {/* ── CAMPUS ────────────────────────────────────────── */}
      <section id="campus" className="py-16 md:py-28 lg:py-36 bg-blanco border-t border-lino/40 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">

          {/* Header */}
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div data-reveal>
              <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-4">
                Plataforma de formación
              </span>
              <h2
                className="font-display font-medium text-tinta leading-[1.05] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
              >
                Campus
              </h2>
            </div>
            <a
              data-reveal
              data-delay="2"
              href="/campus/login"
              className="btn group/btn self-start md:self-end inline-flex items-center gap-2 font-sans text-[11px] font-medium text-tinta bg-acento px-6 min-h-[44px] uppercase tracking-[0.08em] hover:bg-tinta hover:text-papel cursor-pointer"
            >
              Acceder al Campus
              <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
            </a>
          </div>

          {/* Main campus block */}
          <div data-reveal className="bg-tinta mb-12 p-10 md:p-14">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="block font-mono text-[9px] text-acento uppercase tracking-[0.16em] mb-4">
                  La Trastienda Campus
                </span>
                <h3
                  className="font-display font-medium text-papel leading-[1.05] tracking-[-0.02em] mb-6"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
                >
                  Formación online para el Retail
                </h3>
                <p className="font-sans text-base text-papel/60 leading-relaxed">
                  Nuestra plataforma de formación online. Cursos prácticos, seguimiento
                  personalizado y recursos exclusivos para personas y empresas.
                </p>
              </div>
              <ul className="space-y-5">
                {campusFeatures.map((f, i) => (
                  <li
                    key={f.label}
                    data-reveal
                    data-delay={String(i + 1)}
                    className="flex items-start gap-4 group/item"
                  >
                    <span className="text-acento font-medium mt-0.5 shrink-0 group-hover/item:text-papel transition-colors duration-200">
                      —
                    </span>
                    <div>
                      <span className="font-sans text-sm font-medium text-papel block mb-0.5">
                        {f.label}
                      </span>
                      <span className="font-sans text-sm text-papel/50 leading-relaxed">
                        {f.desc}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Topic preview cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {campusTopics.map((item, i) => (
              <div
                key={item.topic}
                data-reveal
                data-delay={String(i + 1)}
                className="border border-lino/50 p-8 opacity-40 select-none"
              >
                <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-4">
                  Próximamente
                </div>
                <h3 className="font-display text-xl font-medium text-tinta mb-3">
                  {item.topic}
                </h3>
                <p className="font-sans text-sm text-cuero leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <p data-reveal className="font-sans text-sm text-cuero mt-12 max-w-[50ch]">
            Estamos preparando recursos sobre el sector Retail. Pronto disponibles para
            nuestros participantes y empresas asociadas.
          </p>
        </div>
      </section>

      {/* ── PODCAST ───────────────────────────────────────── */}
      <section id="podcast" className="py-16 md:py-28 lg:py-36 bg-tinta scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">

          <div className="mb-16" data-reveal>
            <span className="block font-mono text-[9px] text-acento uppercase tracking-[0.16em] mb-4">
              Podcast
            </span>
            <h2
              className="font-display font-medium text-papel leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              La Trastienda Podcast
            </h2>
            <p className="font-sans text-base text-papel/50 mt-4 max-w-[52ch]">
              Conversaciones reales con profesionales del Retail. Trayectorias, aprendizajes
              y el detrás de las tiendas.
            </p>
          </div>

          {/* Mobile: carrusel horizontal */}
          <div className="sm:hidden -mx-6 px-6 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {podcasts.map((p) => (
              <div key={p.episode} className="shrink-0 w-[78%] snap-start flex flex-col group">
                <div className="aspect-video w-full overflow-hidden">
                  {p.videoId ? (
                    <YoutubeConsentGate videoId={p.videoId} title={p.title} thumbnail={p.thumbnail ?? undefined} />
                  ) : (
                    <div className="w-full h-full border border-papel/10 flex flex-col items-center justify-center gap-3 bg-papel/[0.03]">
                      <div className="w-8 h-px bg-papel/20" />
                      <span className="font-mono text-[9px] text-papel/25 uppercase tracking-[0.18em]">
                        En producción
                      </span>
                      <div className="w-8 h-px bg-papel/20" />
                    </div>
                  )}
                </div>
                <div className="pt-4 pb-4 border-b border-papel/10 flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-acento tabular-nums shrink-0">{p.episode}</span>
                  <div>
                    <h3 className={`font-display text-base font-medium leading-snug tracking-[-0.01em] ${p.videoId ? 'text-papel' : 'text-papel/20'}`}>
                      {p.title}
                    </h3>
                    {p.guest && (
                      <p className="font-mono text-[10px] text-papel/40 mt-1 tracking-[0.04em]">{p.guest}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet+: grid original */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {podcasts.map((p, i) => (
              <div
                key={p.episode}
                data-reveal
                data-delay={String(i + 1)}
                className="flex flex-col group"
              >
                <div className="aspect-video w-full overflow-hidden">
                  {p.videoId ? (
                    <YoutubeConsentGate videoId={p.videoId} title={p.title} thumbnail={p.thumbnail ?? undefined} />
                  ) : (
                    <div className="w-full h-full border border-papel/10 flex flex-col items-center justify-center gap-3 bg-papel/[0.03]">
                      <div className="w-8 h-px bg-papel/20" />
                      <span className="font-mono text-[9px] text-papel/25 uppercase tracking-[0.18em]">
                        En producción
                      </span>
                      <div className="w-8 h-px bg-papel/20" />
                    </div>
                  )}
                </div>
                <div className="pt-5 pb-5 border-b border-papel/10">
                  <span
                    className="block font-display font-medium text-papel/[0.07] leading-none tracking-[-0.04em] mb-2 select-none"
                    style={{ fontSize: '3.5rem' }}
                  >
                    {p.episode}
                  </span>
                  <h3 className={`font-display text-xl font-medium leading-snug tracking-[-0.01em] ${p.videoId ? 'text-papel' : 'text-papel/20'}`}>
                    {p.title}
                  </h3>
                  {p.guest && (
                    <p className="font-mono text-[11px] text-papel/40 mt-1 tracking-[0.04em]">{p.guest}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-10 border-t border-papel/10" data-reveal>
            <a
              href="https://www.youtube.com/@LaTrastiendaRetail"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-mono text-[11px] font-medium text-papel/50 uppercase tracking-[0.08em] hover:text-papel transition-colors duration-200 cursor-pointer"
            >
              Ver todos los episodios en YouTube
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACTO ──────────────────────────────────────── */}
      <section
        id="contacto"
        className="py-16 md:py-28 lg:py-36 bg-papel border-t border-lino/40 scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div data-reveal="left">
              <span className="block font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-4">
                Hablemos
              </span>
              <h2
                className="font-display font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-8"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
              >
                Contacto
              </h2>
              <p className="font-sans text-lg text-cuero leading-relaxed mb-12 max-w-[42ch]">
                Tanto si buscas un programa para mejorar la ejecución de tu empresa,
                como si quieres formarte para crecer en Retail — estamos aquí.
              </p>
              <div className="border-t border-lino/60 pt-8 space-y-6">
                <div>
                  <p className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-3">
                    Equipo
                  </p>
                  <p className="font-sans text-sm text-tinta">Javi · Yeray · David</p>
                  <p className="font-sans text-sm text-cuero mt-1">La Trastienda</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-3">
                    Síguenos
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://www.linkedin.com/company/la-trastienda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/li inline-flex items-center gap-2 font-sans text-sm text-tinta hover:text-acento transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn — La Trastienda
                      <span className="transition-transform duration-300 group-hover/li:translate-x-1 inline-block">→</span>
                    </a>
                    <a
                      href="https://www.youtube.com/@LaTrastiendaRetail"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/yt inline-flex items-center gap-2 font-sans text-sm text-tinta hover:text-acento transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube — La Trastienda Retail
                      <span className="transition-transform duration-300 group-hover/yt:translate-x-1 inline-block">→</span>
                    </a>
                    <a
                      href="https://www.instagram.com/latrastienda.retail/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/ig inline-flex items-center gap-2 font-sans text-sm text-tinta hover:text-acento transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                      </svg>
                      Instagram — La Trastienda Retail
                      <span className="transition-transform duration-300 group-hover/ig:translate-x-1 inline-block">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div data-reveal="right" data-delay="1">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── RESERVA ───────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-blanco border-t border-lino/40">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div data-reveal className="flex flex-col items-center text-center gap-5">
            <div className="h-px w-10 bg-acento" />
            <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.16em]">
              Agenda una reunión
            </span>
            <h2
              className="font-display font-medium text-tinta leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              Hablemos en persona
            </h2>
            <p className="font-sans text-base text-cuero leading-relaxed max-w-[38ch]">
              30 minutos para contarnos tu situación y ver cómo podemos ayudarte.
            </p>
            <button
              data-cal-namespace="reunion"
              data-cal-link="la-trastienda-ckfbtg"
              data-cal-config='{"layout":"month_view"}'
              className="btn group inline-flex items-center gap-2 font-sans text-[11px] font-medium text-papel bg-tinta px-8 min-h-[48px] uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta cursor-pointer mt-2"
            >
              Reservar reunión
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-tinta pt-10 pb-6 border-t border-papel/5">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6">
            <div>
              <span className="block font-display text-lg font-medium text-papel leading-none">
                La Trastienda
              </span>
              <span className="block font-mono text-[9px] text-papel/40 uppercase tracking-[0.14em] mt-1">
                Motor de oportunidades en el Retail
              </span>
            </div>
            <div className="flex flex-wrap gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[9px] text-papel/40 hover:text-papel/70 uppercase tracking-[0.1em] transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="font-mono text-[9px] text-papel/30 tracking-[0.06em]">
              © {new Date().getFullYear()} La Trastienda
            </p>
          </div>
          <div className="border-t border-papel/10 pt-5 flex flex-wrap items-center gap-5">
            {[
              { href: '/privacidad', label: 'Privacidad' },
              { href: '/terminos', label: 'Términos y condiciones' },
              { href: '/cookies', label: 'Cookies' },
              { href: '/aviso-legal', label: 'Aviso legal' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[9px] text-papel/25 hover:text-papel/50 uppercase tracking-[0.1em] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <ManageCookiesButton className="font-mono text-[9px] text-papel/25 hover:text-papel/50 uppercase tracking-[0.1em] transition-colors duration-200" />
            <div className="flex items-center gap-4 ml-auto">
              <a
                href="https://www.linkedin.com/company/la-trastienda"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn de La Trastienda"
                className="text-papel/25 hover:text-papel/60 transition-colors duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@LaTrastiendaRetail"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube de La Trastienda"
                className="text-papel/25 hover:text-papel/60 transition-colors duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/latrastienda.retail/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de La Trastienda"
                className="text-papel/25 hover:text-papel/60 transition-colors duration-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}
