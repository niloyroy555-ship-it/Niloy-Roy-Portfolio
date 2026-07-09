'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleField from './particle-field'

const SEEN_KEY = 'nr_intro_seen'
const REVEAL_MS = 2600 // let the particles + "Loading" play, then reveal

// Full-screen splash: light backdrop, dark drifting particle field, and a
// "Loading" wordmark. Tap/click anywhere to skip. Plays once per session.
export default function IntroSplash({ onReveal }) {
  // boot -> live -> exiting -> done
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

    setPhase('live')
    timers.current.push(setTimeout(finish, REVEAL_MS))
    return () => timers.current.forEach(clearTimeout)
  }, [finish])

  if (phase === 'done') return null

  const showing = phase === 'boot' || phase === 'live'

  return (
    <AnimatePresence onExitComplete={() => setPhase('done')}>
      {showing && (
        <motion.div
          key="intro-splash"
          onClick={finish}
          role="button"
          aria-label="Skip intro"
          className="fixed inset-0 z-[120] cursor-pointer overflow-hidden bg-[#F5F4F0]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.12, filter: 'blur(24px)' }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* dark particle field drifting on the light backdrop */}
          <ParticleField className="absolute inset-0" />

          {/* "Loading" wordmark with animated dots */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.6em', filter: 'blur(10px)' }}
              animate={{ opacity: 1, letterSpacing: '0.35em', filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline text-sm font-light uppercase text-ink-900"
            >
              Loading
              <motion.span
                className="ml-1 inline-flex"
                initial="hidden"
                animate="visible"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="mx-[1px]"
                    animate={{ opacity: [0.15, 1, 0.15] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                  >
                    .
                  </motion.span>
                ))}
              </motion.span>
            </motion.p>
          </div>

          {/* skip hint — respects the iOS home-indicator safe area */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/5 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-ink-900/70 backdrop-blur-md"
            style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
          >
            Tap anywhere to skip
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
