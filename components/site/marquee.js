'use client'

import { brands } from '@/lib/portfolio-data'

function Row({ items, reverse = false, duration = '48s' }) {
  return (
    <div className="flex overflow-hidden mask-fade-x" style={{ '--marquee-duration': duration }}>
      <div className={`flex shrink-0 items-center gap-10 pr-10 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {items.concat(items).map((b, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="text-2xl font-light tracking-tight text-fg/35 transition-colors hover:text-fg/80 md:text-3xl">{b}</span>
            <span className="text-brand/40">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  const half = Math.ceil(brands.length / 2)
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="glass-card rounded-[2.5rem] py-10">
        <p className="mb-6 text-center text-xs uppercase tracking-[0.3em] text-fg/35">Trusted by brands &amp; agencies</p>
        <div className="flex flex-col gap-6">
          <Row items={brands.slice(0, half)} duration="55s" />
          <Row items={brands.slice(half)} reverse duration="48s" />
        </div>
      </div>
    </section>
  )
}
