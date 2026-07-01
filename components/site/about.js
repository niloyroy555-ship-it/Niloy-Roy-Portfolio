'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { profile, skills } from '@/lib/portfolio-data'
import { Reveal, TextReveal } from './reveal'
import RevealMedia from './reveal-media'

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const dur = 1400
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}

const pillGroups = [
  { label: 'Design', items: skills.design },
  { label: 'Motion & VFX', items: skills.motion },
  { label: 'AI Tools', items: skills.ai },
]

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        {/* Portrait placeholder */}
        <Reveal>
          <div className="relative">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
              <RevealMedia
                type="image"
                src="/portrait.jpg"
                alt="Niloy Roy portrait"
                className="h-full w-full scale-[1.03] object-cover object-top grayscale transition-all duration-700 ease-out group-hover:scale-100 group-hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/75 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-brand/15 opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
              <span className="absolute bottom-5 left-5 rounded-full glass px-3 py-1 text-xs text-white/70">Niloy Roy · {profile.location}</span>
            </div>
            <div className="absolute -bottom-5 -right-5 hidden rounded-2xl glass px-5 py-4 md:block">
              <p className="font-display text-3xl font-bold text-white">5+</p>
              <p className="text-xs text-white/50">Years crafting visuals</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand">
              <span className="h-px w-8 bg-brand" /> About
            </span>
          </Reveal>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            <TextReveal text="Designer, editor &" />
            <br />
            <TextReveal text="visual storyteller." wordClass="text-white/40" delay={0.12} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">{profile.shortIntro}</p>
          </Reveal>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {profile.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <p className="font-display text-3xl font-bold text-white md:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs leading-snug text-white/45">{s.label}</p>
              </Reveal>
            ))}
          </div>

          {/* Skills */}
          <div className="mt-12 space-y-6">
            {pillGroups.map((g, gi) => (
              <div key={g.label}>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-white/35">{g.label}</p>
                <div className="flex flex-wrap gap-2.5">
                  {g.items.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.85, y: 10 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: gi * 0.05 + i * 0.04, type: 'spring', stiffness: 240, damping: 18 }}
                      whileHover={{ y: -4, borderColor: 'rgba(91,140,255,0.6)' }}
                      className="cursor-default rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/80"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
