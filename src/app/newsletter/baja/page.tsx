import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Baja de la newsletter — La Trastienda',
  robots: { index: false },
}

export default async function NewsletterBajaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-papel flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full border border-lino/50 bg-blanco px-8 py-10">
        <div className="font-mono text-[9px] text-cuero uppercase tracking-[0.16em] mb-4">
          Newsletter
        </div>
        <h1 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium text-tinta leading-[1.1] tracking-[-0.02em] mb-4">
          {error ? 'Enlace no válido' : 'Te has dado de baja'}
        </h1>
        <p className="font-sans text-sm text-cuero leading-relaxed mb-8">
          {error
            ? 'El enlace de baja no es válido o ha caducado. Si quieres dejar de recibir la newsletter, escríbenos a latrastienda.retail@gmail.com y lo gestionamos.'
            : 'No volverás a recibir la newsletter de La Trastienda. Tus datos de suscripción se conservan sólo como prueba de la baja. Si cambias de idea, puedes volver a suscribirte en cualquier momento.'}
        </p>
        <a
          href="/"
          className="font-mono text-[11px] font-medium text-papel bg-tinta px-5 min-h-[44px] inline-flex items-center justify-center uppercase tracking-[0.08em] hover:bg-acento hover:text-tinta transition-colors duration-200"
        >
          Volver al inicio →
        </a>
      </div>
    </div>
  )
}
