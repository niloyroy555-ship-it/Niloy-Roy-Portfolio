'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '@/lib/portfolio-data'

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

const SEEN_KEY = 'nr_intro_seen'
const PLAY_AFTER_LOAD_MS = 2800 // let the distortion play, then reveal
const HARD_CAP_MS = 7000 // never block the site longer than this
const FALLBACK_MS = 1800 // static/gradient splash duration on low-power devices

function isLowPower() {
  if (typeof window === 'undefined') return true
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = window.innerWidth < 768
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lowMem = typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory < 4
  return coarse || small || reduce || !!lowMem
}

// Full-screen splash that plays the Spline "distorting intro" once per session,
// then morphs into the hero. Tap/click anywhere to skip.
export default function IntroSplash({ onReveal }) {
  // boot -> live | fallback -> exiting -> done
  const [phase, setPhase] = useState('boot')
  const [sceneReady, setSceneReady] = useState(false)
  const finished = useRef(false)
  const timers = useRef([])
  const revealRef = useRef(onReveal)
  revealRef.current = onReveal

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    try { sessionStorage.setItem(SEEN_KEY, '1') } catch (e) { /* private mode */ }
    revealRef.current?.()
    setPhase('exiting')
  }, [])

  useEffect(() => {
    let seen = false
    try { seen = !!sessionStorage.getItem(SEEN_KEY) } catch (e) { seen = true }

    if (seen) {
      finished.current = true
      revealRef.current?.()
      setPhase('done')
      return
    }

    // Warm the hero scene cache while the intro plays
    try { fetch('/scenes/vision-pro.splinecode', { cache: 'force-cache' }).catch(() => {}) } catch (e) { /* noop */ }

    if (isLowPower()) {
      setPhase('fallback')
      timers.current.push(setTimeout(finish, FALLBACK_MS))
    } else {
      setPhase('live')
      timers.current.push(setTimeout(finish, HARD_CAP_MS))
    }
    return () => timers.current.forEach(clearTimeout)
  }, [finish])

  const onSceneLoad = useCallback(() => {
    setSceneReady(true)
    timers.current.push(setTimeout(finish, PLAY_AFTER_LOAD_MS))
  }, [finish])

  if (phase === 'done') return null

  const showing = phase === 'boot' || phase === 'live' || phase === 'fallback'

  return (
    <AnimatePresence onExitComplete={() => setPhase('done')}>
      {showing && (
        <motion.div
          key="intro-splash"
          onClick={finish}
          role="button"
          aria-label="Skip intro"
          className="fixed inset-0 z-[120] cursor-pointer overflow-hidden bg-[#0a0a12]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.12, filter: 'blur(24px)' }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          {phase === 'live' && (
            <div className="absolute inset-0">
              <Spline scene="/scenes/intro-distortion.splinecode" onLoad={onSceneLoad} style={{ width: '100%', height: '100%' }} />
            </div>
          )}

          {phase === 'fallback' && (
            <div className="intro-distort absolute inset-0">
              <div className="flex h-full w-full items-center justify-center">
                <motion.p
                  initial={{ opacity: 0, letterSpacing: '0.6em', filter: 'blur(10px)' }}
                  animate={{ opacity: 1, letterSpacing: '0.25em', filter: 'blur(0px)' }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-sm font-light uppercase text-white/85"
                >
                  {profile.name}
                </motion.p>
              </div>
            </div>
          )}

          {/* loading shimmer while the live scene initialises */}
          {phase === 'live' && !sceneReady && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="h-10 w-10 animate-spin-slow rounded-full border border-white/15 border-t-white/70" style={{ animationDuration: '1.2s' }} />
            </div>
          )}

          {/* skip hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-white/45"
          >
            Tap anywhere to skip
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
