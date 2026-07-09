import Image from 'next/image'
import Link from 'next/link'

export function BlogHeader() {
  return (
    <header className="border-b" style={{ borderColor: 'var(--color-lino)' }}>
      <div className="max-w-[980px] mx-auto px-6 py-6">
        <Link href="/blog" className="inline-block cursor-pointer">
          <Image
            src="/images/Logos/imagotipov2.svg"
            alt="La Trastienda"
            width={140}
            height={46}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  )
}
