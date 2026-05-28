'use client'

import { useState, useEffect } from 'react'
import YoutubeConsentGate from '@/components/YoutubeConsentGate'
import ManageCookiesButton from '@/components/ManageCookiesButton'

// ── Data ──────────────────────────────────────────────────────────────────────

const navLinks = [
  { href: '#quienes',  label: 'Quiénes somos' },
  { href: '#programas', label: 'Programas' },
  { href: '#campus',   label: 'Campus' },
  { href: '#podcast',  label: 'Podcast' },
  { href: '/blog',     label: 'Blog' },
]

const marqueeItems = [
  'Formación Retail',
  'Talento con propósito',
  'Sector Comercio',
  'Impacto social',
  '−25 / +50',
  'Conexión empresa-persona',
  'Formación práctica',
  'Orientación laboral',
  'Crecimiento profesional',
]

const founders = [
  {
    num: '01',
    name: 'Javi',
    role: 'Ventas & Alianzas',
    description:
      'Lidera el frente comercial y la relación con empresas del sector. El primero en abrirle las puertas a Trastienda.',
  },
  {
    num: '02',
    name: 'Yeray',
    role: 'Operaciones & Instituciones',
    description:
      'Gestiona las alianzas institucionales y mantiene la operativa interna funcionando. El que hace que todo encaje.',
  },
  {
    num: '03',
    name: 'David',
    role: 'Tecnología & Digital',
    description:
      'Construye la presencia digital de Trastienda y coordina su identidad tecnológica. El que lo hace visible.',
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
  },
  {
    videoId: 'QD3x4ZIEeOs',
    episode: '02',
    title: 'De vendedor a Responsable de Talento',
    guest: 'con Manuel del Barrio',
  },
]

// ── Contact Form ──────────────────────────────────────────────────────────────

type Audience = 'particular' | 'empresa' | 'institucion' | null

function ContactForm() {
  const [audience, setAudience] = useState<Audience>(null)

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
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
            rows={4}
            required
            className="w-full border-b border-lino bg-transparent pb-3 font-sans text-base text-tinta placeholder:text-lino focus:border-tinta focus:outline-none transition-colors duration-200 resize-none"
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn group w-full font-sans text-[11px] font-medium text-papel bg-tinta uppercase tracking-[0.08em] py-4 hover:bg-acento hover:text-tinta cursor-pointer min-h-[44px]"
      >
        <span className="inline-flex items-center gap-2">
          Enviar mensaje
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </button>
    </form>
  )
}

// ── Home ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      <header className="fixed top-4 left-4 right-4 z-30 anim-nav">
        <div className="relative max-w-6xl mx-auto">
          <nav className={`flex items-center justify-between px-6 py-3 bg-papel/95 backdrop-blur-sm border border-lino/40 transition-shadow duration-300${scrolled ? ' shadow-[0_4px_24px_rgba(26,23,20,0.08)]' : ''}`}>
            <a href="#" className="cursor-pointer">
              <img
                src="/images/Logos/imagotipov2.svg"
                alt="La Trastienda"
                className="h-9 w-auto"
              />
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link font-mono text-[11px] font-medium text-cuero hover:text-tinta transition-colors duration-200 tracking-[0.08em] uppercase cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#contacto"
                className="btn hidden md:flex items-center justify-center font-sans text-[11px] font-medium text-papel bg-tinta px-5 min-h-[44px] hover:bg-acento hover:text-tinta tracking-[0.08em] uppercase cursor-pointer"
              >
                Contactar
              </a>
              <button
                type="button"
                onClick={() => setNavOpen(!navOpen)}
                className="md:hidden font-mono text-[11px] text-tinta uppercase tracking-[0.08em] min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label={navOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={navOpen}
              >
                {navOpen ? 'Cerrar' : 'Menú'}
              </button>
            </div>
          </nav>

          <div
            aria-hidden={!navOpen}
            className={`md:hidden absolute top-full left-0 right-0 mt-1 bg-papel border border-lino/40 px-6 py-6 transition-[opacity,transform] duration-200 ease-out${navOpen ? ' opacity-100 translate-y-0 pointer-events-auto' : ' opacity-0 -translate-y-2 pointer-events-none select-none'}`}
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setNavOpen(false)}
                  className="font-mono text-sm font-medium text-tinta uppercase tracking-[0.08em] cursor-pointer min-h-[44px] flex items-center"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={() => setNavOpen(false)}
                className="btn font-sans text-[11px] font-medium text-papel bg-tinta px-5 py-3.5 uppercase tracking-[0.08em] text-center cursor-pointer min-h-[44px] flex items-center justify-center hover:bg-acento hover:text-tinta"
              >
                Contactar
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* Decorative ghost text */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute right-[-4%] top-1/2 -translate-y-1/2 font-display font-medium leading-none text-tinta/[0.035]"
          style={{ fontSize: 'clamp(10rem, 22vw, 20rem)', letterSpacing: '-0.04em' }}
        >
          RETAIL
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl mx-auto px-6 md:px-12 w-full pt-36 pb-16">

          {/* Eyebrow */}
          <div className="anim-hero-1 flex items-center gap-4 mb-10">
            <div className="h-px w-10 bg-acento anim-line" />
            <span className="font-mono text-[9px] text-cuero uppercase tracking-[0.18em]">
              Formación · Retail · España
            </span>
          </div>

          {/* Headline */}
          <h1
            className="anim-hero-2 font-display font-medium text-tinta tracking-[-0.025em] leading-[1.05] mb-10 max-w-[20ch]"
            style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5.75rem)' }}
          >
            Formamos personas{' '}
            <em className="italic text-acento">de −25/+50</em>{' '}
            para crecer{' '}
            <span className="relative inline-block">
              en Retail.
              <span
                aria-hidden
                className="absolute left-0 bottom-1 h-px bg-acento/30 anim-line"
                style={{ right: 0 }}
              />
            </span>
          </h1>

          {/* Sub */}
          <p className="anim-hero-3 font-sans text-lg text-cuero leading-relaxed mb-12 max-w-[50ch]">
            Conectamos talento con empresas del sector. Formación real, impacto real.
          </p>

          {/* CTAs */}
          <div className="anim-hero-4 flex flex-col sm:flex-row gap-3 mb-20">
            <a
              href="#programas"
              className="btn group inline-flex items-center justify-center gap-2 font-sans text-[11px] font-medium text-tinta bg-acento px-8 min-h-[48px] uppercase tracking-[0.08em] hover:bg-tinta hover:text-papel cursor-pointer"
            >
              Quiero formarme
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#programas"
              className="btn group inline-flex items-center justify-center gap-2 font-sans text-[11px] font-medium text-tinta border border-tinta px-8 min-h-[48px] uppercase tracking-[0.08em] hover:bg-tinta hover:text-papel cursor-pointer"
            >
              Soy empresa
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </div>

          {/* Stats strip */}
          <div className="anim-hero-5 grid grid-cols-3 sm:grid-cols-3 gap-8 max-w-md border-t border-lino/40 pt-10">
            {[
              { num: '2',  label: 'Canales',    sub: 'Formación · Empresa' },
              { num: '3',  label: 'Audiencias', sub: 'Part. · Emp. · Inst.' },
              { num: '∞',  label: 'Potencial',  sub: 'Carrera en Retail' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="font-display font-medium text-tinta leading-none tracking-[-0.04em]"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                  {s.num}
                </div>
                <div className="font-mono text-[8px] text-acento uppercase tracking-[0.14em] mt-1.5 mb-0.5">
                  {s.label}
                </div>
                <div className="font-mono text-[9px] text-cuero/70">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee strip */}
        <div className="relative z-10 border-t border-lino/40 py-3 overflow-hidden bg-papel/80">
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

      {/* ── QUIÉNES SOMOS ─────────────────────────────────── */}
      <section id="quienes" className="bg-tinta py-28 md:py-36 scroll-mt-24">
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

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-px bg-papel/8">
            {founders.map((founder, i) => (
              <div
                key={founder.name}
                data-reveal
                data-delay={String(i + 1)}
                className="bg-tinta p-8 md:p-10 hover:bg-papel/[0.04] hover:-translate-y-1 transition duration-300 group cursor-default"
              >
                <div
                  className="font-display font-medium text-papel/[0.07] leading-none tracking-[-0.04em] mb-6 select-none group-hover:text-acento/20 transition-colors duration-500"
                  style={{ fontSize: '4.5rem' }}
                >
                  {founder.num}
                </div>
                <h3 className="font-display text-2xl font-medium text-papel tracking-[-0.01em] mb-1">
                  {founder.name}
                </h3>
                <div className="font-mono text-[9px] text-acento uppercase tracking-[0.14em] mb-5">
                  {founder.role}
                </div>
                <p className="font-sans text-sm text-papel/50 leading-relaxed">
                  {founder.description}
                </p>
                <div className="mt-8 h-px bg-papel/10 group-hover:bg-acento/25 transition-colors duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMAS ─────────────────────────────────────── */}
      <section id="programas" className="py-28 md:py-36 bg-papel scroll-mt-24">
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

          <div className="grid md:grid-cols-2 gap-6">
            {/* Particulares */}
            <div
              data-reveal
              data-delay="1"
              className="bg-blanco border border-lino/50 p-10 md:p-12 hover:border-acento/40 hover:shadow-[0_4px_24px_rgba(26,23,20,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-8">
                Para particulares
              </div>
              <h3
                className="font-display font-medium text-tinta leading-[1.05] tracking-[-0.02em] mb-6"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                Formación <em>real</em> para el sector Retail
              </h3>
              <p className="font-sans text-base text-cuero leading-relaxed mb-8">
                Si tienes menos de 25 o más de 50 años y quieres crecer en el comercio,
                estamos aquí. Formación práctica y gratuita, con conexión directa a
                empresas que buscan talento.
              </p>
              <ul className="space-y-3 mb-10 flex-1">
                {[
                  'Formación práctica en sector Retail',
                  'Conexión directa con empresas del sector',
                  'Acompañamiento personalizado',
                ].map((item) => (
                  <li key={item} className="font-sans text-sm text-tinta flex items-start gap-3">
                    <span className="text-acento font-medium mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contacto"
                className="btn group/btn inline-flex items-center gap-2 self-start font-sans text-[11px] font-medium text-tinta uppercase tracking-[0.08em] border border-tinta px-6 min-h-[44px] hover:bg-tinta hover:text-papel cursor-pointer"
              >
                Quiero formarme
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
                Para empresas
              </div>
              <h3
                className="font-display font-medium text-papel leading-[1.05] tracking-[-0.02em] mb-6"
                style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                Talento <em>formado</em> para tu equipo
              </h3>
              <p className="font-sans text-base text-papel/60 leading-relaxed mb-8">
                Accede a candidatos preformados en Retail: comprometidos, con experiencia
                práctica y perfil de impacto social. También ofrecemos consultoría
                especializada para tu operativa.
              </p>
              <ul className="space-y-3 mb-10 flex-1">
                {[
                  'Candidatos preseleccionados y formados',
                  'Valor añadido RSC para tu empresa',
                  'Consultoría Retail especializada',
                ].map((item) => (
                  <li key={item} className="font-sans text-sm text-papel/75 flex items-start gap-3">
                    <span className="text-acento font-medium mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contacto"
                className="btn group/btn inline-flex items-center gap-2 self-start font-sans text-[11px] font-medium text-papel uppercase tracking-[0.08em] border border-papel/30 px-6 min-h-[44px] hover:bg-acento hover:text-tinta hover:border-acento cursor-pointer"
              >
                Hablar con el equipo
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAMPUS ────────────────────────────────────────── */}
      <section id="campus" className="py-28 md:py-36 bg-blanco border-t border-lino/40 scroll-mt-24">
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
      <section id="podcast" className="py-28 md:py-36 bg-tinta scroll-mt-24">
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

          <div className="grid md:grid-cols-3 gap-6">
            {podcasts.map((p, i) => (
              <div
                key={p.videoId}
                data-reveal
                data-delay={String(i + 1)}
                className="flex flex-col group"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <YoutubeConsentGate videoId={p.videoId} title={p.title} />
                </div>
                <div className="pt-5 pb-5 border-b border-papel/10">
                  <span
                    className="block font-display font-medium text-papel/[0.07] leading-none tracking-[-0.04em] mb-2 select-none"
                    style={{ fontSize: '3.5rem' }}
                  >
                    {p.episode}
                  </span>
                  <h3 className="font-display text-xl font-medium text-papel leading-snug tracking-[-0.01em]">
                    {p.title}
                  </h3>
                  {p.guest && (
                    <p className="font-mono text-[11px] text-papel/40 mt-1 tracking-[0.04em]">{p.guest}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Placeholder Ep. 03 */}
            <div
              data-reveal
              data-delay="3"
              className="flex flex-col group"
            >
              <div className="aspect-video w-full border border-papel/10 flex items-center justify-center">
                <span className="font-mono text-[9px] text-papel/20 uppercase tracking-[0.14em]">
                  Próximamente
                </span>
              </div>
              <div className="pt-5 pb-5 border-b border-papel/10">
                <span
                  className="block font-display font-medium text-papel/[0.07] leading-none tracking-[-0.04em] mb-2 select-none"
                  style={{ fontSize: '3.5rem' }}
                >
                  03
                </span>
                <h3 className="font-display text-xl font-medium text-papel/20 leading-snug tracking-[-0.01em]">
                  Nuevo episodio en camino
                </h3>
              </div>
            </div>
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
        className="py-28 md:py-36 bg-papel border-t border-lino/40 scroll-mt-24"
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
                Tanto si buscas formación para crecer en Retail, como si quieres
                incorporar talento a tu empresa — estamos aquí.
              </p>
              <div className="border-t border-lino/60 pt-8">
                <p className="font-mono text-[9px] text-cuero uppercase tracking-[0.14em] mb-3">
                  Equipo
                </p>
                <p className="font-sans text-sm text-tinta">Javi · Yeray · David</p>
                <p className="font-sans text-sm text-cuero mt-1">La Trastienda</p>
              </div>
            </div>

            <div data-reveal="right" data-delay="1">
              <ContactForm />
            </div>
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
                Retail con propósito
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
              © 2026 La Trastienda
            </p>
          </div>
          <div className="border-t border-papel/10 pt-5 flex flex-wrap gap-5">
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
          </div>
        </div>
      </footer>

    </main>
  )
}
