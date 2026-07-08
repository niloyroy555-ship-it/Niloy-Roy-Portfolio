'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '@/lib/portfolio-data'

const ease = [0.22, 1, 0.36, 1]

// Full-screen preloader shown on first paint. Tracks real asset progress
// (window 'load' + a minimum floor so it never feels like a flash) then
// fades out and calls onDone(), which is what actually lets the hero
// video start playing and its reveal animations run.
export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [mounted, setMounted] = useState(true)
  const doneRef = useRef(false)

  useEffect(() => {
    const start = Date.now()
    const MIN_MS = 1400 // floor so the loader always reads intentionally, not as a flicker
    let raf
    let windowLoaded = document.readyState === 'complete'

    const onLoad = () => { windowLoaded = true }
    window.addEventListener('load', onLoad)

    const tick = () => {
      const elapsed = Date.now() - start
      // ease toward 90% while waiting on real load, then release to 100%
      const target = windowLoaded ? 100 : Math.min(90, (elapsed / MIN_MS) * 90)
      setProgress((p) => p + (target - p) * 0.12)

      if (windowLoaded && elapsed >= MIN_MS && !doneRef.current) {
        doneRef.current = true
        setProgress(100)
        setTimeout(() => setExiting(true), 220)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Hard fallback: never block the site for more than 4.5s
    const hardStop = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true
        setProgress(100)
        setExiting(true)
      }
    }, 4500)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hardStop)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence onExitComplete={() => { setMounted(false); onDone?.() }}>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.7, ease }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-950"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="font-graffiti text-3xl tracking-wide text-white/90 sm:text-4xl"
          >
            {profile.name}
          </motion.div>

          <div className="mt-7 h-px w-40 overflow-hidden bg-white/10 sm:w-56">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-200 via-brand to-brand-200"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 font-mono text-[11px] tracking-[0.3em] text-white/35"
          >
            {String(Math.round(progress)).padStart(2, '0')}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
