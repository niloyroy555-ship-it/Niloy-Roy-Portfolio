'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { profile, skills } from '@/lib/portfolio-data'
import { Reveal, TextReveal } from './reveal'
import RevealMedia from './reveal-media'

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [n, setN] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    const run = () => {
      if (started.current) return
      started.current = true
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
    }
    if (inView) run()
    const fallback = setTimeout(run, 1000)
    return () => clearTimeout(fallback)
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
    <section id="about" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Floating portrait */}
        <Reveal>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="group relative overflow-hidden rounded-[2.5rem] glass-card p-2.5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                <RevealMedia
                  type="image"
                  src="/portrait.jpg"
                  alt="Niloy Roy portrait"
                  className="h-full w-full scale-[1.03] object-cover object-top transition-all duration-700 ease-out group-hover:scale-100"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full glass-chip px-3 py-1 text-xs text-white/85">Niloy Roy · {profile.location}</span>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 hidden rounded-3xl glass-panel px-5 py-4 lg:block">
              <p className="text-3xl font-semibold text-fg">5+</p>
              <p className="text-xs font-light text-fg/55">Years crafting visuals</p>
            </div>
          </motion.div>
        </Reveal>

        <div>
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full glass-chip px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-brand">
              About
            </span>
          </Reveal>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-fg lg:text-5xl">
            <TextReveal text="Designer, editor &" />
            <br />
            <TextReveal text="visual storyteller." wordClass="text-gradient" delay={0.12} />
          </h2>
          <Reveal delay={0.15}>
            <div className="mt-6 max-w-xl rounded-[2rem] glass-card p-6">
              <p className="text-base font-light leading-relaxed text-fg/70">{profile.shortIntro}</p>
            </div>
          </Reveal>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {profile.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <div className="rounded-3xl glass-chip px-4 py-4 text-center">
                  <p className="text-2xl font-semibold text-fg lg:text-3xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-[11px] font-light leading-snug text-fg/50">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Skills / Tools — floating badges in a glass panel */}
      <div id="skills" className="mt-16 scroll-mt-24">
        <Reveal>
          <div className="rounded-[2.5rem] glass-panel p-7 lg:p-10">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full glass-chip px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-brand">
              Skills &amp; Tools
            </span>
            <div className="mt-4 space-y-7">
              {pillGroups.map((g, gi) => (
                <div key={g.label}>
                  <p className="mb-3 text-xs uppercase tracking-[0.25em] text-fg/40">{g.label}</p>
                  <div className="flex flex-wrap gap-2.5">
                    {g.items.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: gi * 0.05 + i * 0.04, type: 'spring', stiffness: 240, damping: 18 }}
                        whileHover={{ y: -4 }}
                        className="cursor-default rounded-full glass-chip px-4 py-2 text-sm font-light text-fg/85 transition-colors hover:text-fg"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
