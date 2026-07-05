'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import Magnetic from './magnetic'
import { profile } from '@/lib/portfolio-data'
import { scrollToId } from './smooth-scroll'

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

const ease = [0.22, 1, 0.36, 1]

function useLowPower() {
  const [low, setLow] = useState(true)
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const small = window.innerWidth < 768
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowMem = navigator.deviceMemory && navigator.deviceMemory < 4
    setLow(coarse || small || reduce || !!lowMem)
  }, [])
  return low
}

export default function Hero({ ready = true }) {
  const [roleIdx, setRoleIdx] = useState(0)
  const [sceneLoaded, setSceneLoaded] = useState(false)
  const [posterOk, setPosterOk] = useState(true)
  const lowPower = useLowPower()
  const ref = useRef(null)

  // gentle 3D tilt of the glass panel toward the cursor
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 110, damping: 20 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 110, damping: 20 })
  const panelX = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 60, damping: 20 })
  const panelY = useSpring(useTransform(my, [-0.5, 0.5], [-6, 6]), { stiffness: 60, damping: 20 })

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

  const showScene = ready && !lowPower

  return (
    <section id="top" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* ---- 3D Vision Pro scene / poster fallback ---- */}
      <div className="absolute inset-0" aria-hidden>
        {/* poster layer (always under the live scene; the only layer on mobile) */}
        <AnimatePresence>
          {!sceneLoaded && (
            <motion.div key="poster" className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 1 }}>
              {posterOk && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/scenes/vision-pro-poster.jpg"
                  alt=""
                  onError={() => setPosterOk(false)}
                  className="h-full w-full object-cover"
                />
              )}
              {!posterOk && <div className="intro-distort absolute inset-0" style={{ animationDuration: '9s' }} />}
              {showScene && !sceneLoaded && (
                <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-fg/40">
                  <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-brand" /> Loading 3D scene
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {showScene && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: sceneLoaded ? 1 : 0 }}
            transition={{ duration: 1.2, ease }}
          >
            <Spline scene="/scenes/vision-pro.splinecode" onLoad={() => setSceneLoaded(true)} style={{ width: '100%', height: '100%' }} />
          </motion.div>
        )}

        {/* blend edges into the page background */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-base to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-base/60 to-transparent" />
      </div>

      {/* ---- floating glass panel ---- */}
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, x: panelX, y: panelY, transformPerspective: 1400 }}
        className="relative z-10 mx-auto w-[92%] max-w-2xl px-2 py-24 text-center md:px-0"
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, ease, delay: 0.15 }}
          className="glass-panel rounded-[2.5rem] px-6 py-10 md:px-14 md:py-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full glass-chip px-4 py-1.5 text-xs text-fg/70"
          >
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" />
            Available for freelance &amp; full-time · {profile.location}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ delay: 0.35, duration: 1, ease }}
            className="text-5xl font-semibold tracking-tight text-fg sm:text-6xl md:text-7xl"
          >
            {profile.firstName} <span className="text-gradient">{profile.lastName}</span>
          </motion.h1>

          {/* morphing role */}
          <div className="mt-5 flex h-8 items-center justify-center overflow-hidden md:h-10">
            <AnimatePresence mode="wait">
              <motion.p
                key={roleIdx}
                initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease }}
                className="text-lg font-light text-fg/75 md:text-2xl"
              >
                {profile.roles[roleIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.75, duration: 0.9 }}
            className="mx-auto mt-5 max-w-lg text-balance text-sm font-light leading-relaxed text-fg/55 md:text-base"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.9 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <Magnetic strength={0.5}>
              <button
                onClick={() => scrollToId('#work')}
                data-cursor="link"
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-violet2-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(109,141,255,0.35)] transition-all hover:shadow-[0_14px_54px_rgba(109,141,255,0.5)]"
              >
                View My Work
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </Magnetic>
            <Magnetic strength={0.5}>
              <button
                onClick={() => scrollToId('#contact')}
                data-cursor="link"
                className="rounded-full glass-chip px-7 py-3.5 text-sm font-semibold text-fg transition-colors hover:bg-fg/5"
              >
                Contact Me
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => scrollToId('#work')}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.4 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-fg/40"
        aria-label="Scroll"
      >
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} className="block">
          <ArrowDown size={20} />
        </motion.span>
      </motion.button>
    </section>
  )
}
