import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '404 — La Trastienda',
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-tinta flex flex-col items-center justify-center px-6 py-20">

      {/* Logo grande */}
      <div className="w-full max-w-[680px] mb-12">
        <Image
          src="/images/Logos/imagotipov2.svg"
          alt="La Trastienda"
          width={3488}
          height={1260}
          className="w-full h-auto"
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }}
          priority
        />
      </div>

      {/* Divisor */}
      <div className="w-full max-w-[680px] h-px bg-lino/15 mb-12" />

      {/* Contenido */}
      <div className="text-center max-w-[520px]">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-acento mb-6">
          Error 404
        </p>
        <h1 className="font-display italic text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] text-papel mb-5">
          Esta página está<br />en la trastienda.
        </h1>
        <p className="font-sans text-[15px] leading-relaxed text-cuero mb-10">
          Puede que se haya movido o simplemente aún no exista.
          Pero siempre hay más por descubrir.
        </p>
        <Link
          href="/"
          className="inline-block border border-papel/25 text-papel font-sans text-[13px] font-medium tracking-[0.06em] uppercase px-8 py-3 rounded-sm transition-all duration-200 hover:bg-papel hover:text-tinta cursor-pointer"
        >
          Volver al inicio
        </Link>
      </div>

    </main>
  )
}
