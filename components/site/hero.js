'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, ArrowDown } from 'lucide-react'
import ParticleField from './particle-field'
import Magnetic from './magnetic'
import { profile } from '@/lib/portfolio-data'
import { scrollToId } from './smooth-scroll'

const ease = [0.22, 1, 0.36, 1]
const letters = profile.name.split('')
const behanceUrl = profile.socials.find((s) => s.label === 'Behance')?.href

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const ref = useRef(null)

  // subtle 3D bend toward cursor
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 20 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 20 })

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % profile.roles.length), 2400)
    return () => clearInterval(id)
  }, [])

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <section id="top" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      
      <div className="hero-grid" />

      {/* ambient gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[38%] h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[60px] animate-aurora md:blur-[120px]" />
        <div className="absolute right-[12%] top-[18%] h-[34vh] w-[34vh] rounded-full bg-indigo-500/10 blur-[55px] animate-aurora md:blur-[110px]" style={{ animationDelay: '-6s' }} />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <ParticleField className="absolute inset-0 h-full w-full" />

      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }}
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-white/70"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Available for freelance & full-time · {profile.location}
        </motion.div>

        <h1 className="font-graffiti text-[27vw] sm:text-[22vw] md:text-[18rem] lg:text-[20rem] leading-[0.9] tracking-normal text-white">
          <span className="sr-only">{profile.name}</span>
          <span aria-hidden className="flex flex-wrap items-center justify-center">
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: '120%', opacity: 0, rotateX: -70 }}
                animate={{ y: '0%', opacity: 1, rotateX: 0 }}
                transition={{ delay: 0.35 + i * 0.05, duration: 0.9, ease }}
                className="inline-block"
                style={{ transformOrigin: 'bottom' }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* morphing role */}
        <div className="mt-6 flex h-9 items-center justify-center overflow-hidden md:h-11">
          <AnimatePresence mode="wait">
            <motion.p
              key={roleIdx}
              initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.6, ease }}
              className="bg-gradient-to-r from-white via-white to-brand-200 bg-clip-text text-xl font-medium text-transparent md:text-3xl"
            >
              {profile.roles[roleIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="mx-auto mt-6 max-w-xl text-balance text-sm leading-relaxed text-white/55 md:text-base"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic strength={0.5}>
            <a href={behanceUrl} target="_blank" rel="noopener noreferrer" data-cursor="link" className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink-950 transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]">
              View Portfolio
              <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
          <Magnetic strength={0.5}>
            <button onClick={() => scrollToId('#contact')} data-cursor="link" className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5">
              Contact Me
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => scrollToId('#work')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/40"
        aria-label="Scroll"
      >
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} className="block">
          <ArrowDown size={20} />
        </motion.span>
      </motion.button>
    </section>
  )
}
