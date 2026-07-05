'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '@/lib/portfolio-data'

const SEEN_KEY = 'nr_intro_seen'
const FALLBACK_MS = 2000 // static splash duration

// HUD wallpaper: full-bleed, responsive (WebP + JPEG fallback), preloaded from layout head.
function LoaderBackdrop() {
  return (
    <div className="absolute inset-0" aria-hidden>
      <picture>
        <source
          type="image/webp"
          srcSet="/loader/loader-bg-960.webp 960w, /loader/loader-bg-1900.webp 1900w"
          sizes="100vw"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/loader/loader-bg-1900.jpg"
          srcSet="/loader/loader-bg-960.jpg 960w, /loader/loader-bg-1900.jpg 1900w"
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </picture>
      {/* subtle scrim so the spinner / skip text stay readable on the bright HUD areas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/25" />
    </div>
  )
}

// Full-screen splash that shows the HUD wallpaper instantly, then morphs
// into the hero. Tap/click anywhere to skip. Plays once per session.
export default function IntroSplash({ onReveal }) {
  // boot -> fallback -> exiting -> done
  const [phase, setPhase] = useState('boot')
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

    setPhase('fallback')
    timers.current.push(setTimeout(finish, FALLBACK_MS))
    return () => timers.current.forEach(clearTimeout)
  }, [finish])

  if (phase === 'done') return null

  const showing = phase === 'boot' || phase === 'fallback'

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
          {/* HUD wallpaper — visible instantly on every device */}
          <LoaderBackdrop />

          {/* name on the static splash */}
          {phase === 'fallback' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.6em', filter: 'blur(10px)' }}
                animate={{ opacity: 1, letterSpacing: '0.25em', filter: 'blur(0px)' }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm font-light uppercase text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]"
              >
                {profile.name}
              </motion.p>
            </div>
          )}

          {/* loading spinner during initial boot */}
          {phase === 'boot' && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="grid place-items-center rounded-full bg-black/35 p-3 backdrop-blur-md">
                <span
                  className="h-9 w-9 animate-spin-slow rounded-full border-2 border-white/25 border-t-white/95"
                  style={{ animationDuration: '1.2s' }}
                />
              </span>
            </div>
          )}

          {/* skip hint — respects the iOS home-indicator safe area */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/40 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/90 backdrop-blur-md"
            style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            Tap anywhere to skip
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
