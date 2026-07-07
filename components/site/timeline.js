'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { experience } from '@/lib/portfolio-data'
import { Reveal, TextReveal } from './reveal'

const ease = [0.22, 1, 0.36, 1]

export default function Timeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="experience" className="relative mx-auto max-w-5xl scroll-mt-24 px-5 py-24 md:px-8 md:py-36">
      <div className="mb-16">
        <Reveal>
          <span className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand">
            <span className="h-px w-8 bg-brand" /> Experience
          </span>
        </Reveal>
        <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          <TextReveal text="A path through" /> <TextReveal text="pixels & motion." wordClass="text-white/40" delay={0.12} />
        </h2>
      </div>

      <div ref={ref} className="relative pl-8 md:pl-0">
        {/* center line */}
        <div className="absolute left-[7px] top-0 h-full w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
        <motion.div
          style={{ scaleY, transformOrigin: 'top' }}
          className="absolute left-[7px] top-0 h-full w-px bg-gradient-to-b from-brand via-brand to-transparent md:left-1/2 md:-translate-x-1/2"
        />

        <div className="space-y-10 md:space-y-2">
          {experience.map((job, i) => {
            const right = i % 2 === 1
            return (
              <div key={i} className={`relative md:grid md:grid-cols-2 md:gap-10 ${right ? '' : ''}`}>
                {/* node */}
                <span className="absolute -left-[26px] top-1.5 z-10 grid h-4 w-4 place-items-center rounded-full bg-ink-950 md:left-1/2 md:-translate-x-1/2">
                  <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_14px_rgba(91,140,255,0.9)]" />
                </span>

                <motion.div
                  initial={{ opacity: 0, x: right ? 40 : -40, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.75, ease }}
                  className={`rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-white/20 md:my-4 ${right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}`}
                >
                  <span className="text-xs font-medium text-brand">{job.period}</span>
                  <h3 className="mt-2 font-display text-xl font-semibold text-white">{job.company}</h3>
                  <p className="text-sm text-white/50">{job.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{job.desc}</p>
                  <div className={`mt-4 flex flex-wrap gap-2 ${right ? '' : 'md:justify-end'}`}>
                    {job.tags.map((t) => (
                      <span key={t} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/60">{t}</span>
                    ))}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
