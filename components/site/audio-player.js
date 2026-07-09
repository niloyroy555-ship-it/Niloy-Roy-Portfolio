'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

// Site-wide background audio.
//
// Browsers block autoplay-with-sound until there's been a real user
// gesture, so this never calls .play() on mount. Instead it arms two
// independent triggers, whichever fires first:
//   1) the dedicated glass-chip button (bottom-right, matches nav's
//      ThemeToggle treatment)
//   2) a one-time "first interaction anywhere on the page" listener
//      (click/touchstart/keydown), so visitors who click a project card
//      or nav link before spotting the button still get sound.
// After the first successful start, the button becomes a normal
// play/pause + mute toggle and the page-wide listener detaches.
export default function AudioPlayer({ src = '/audio/theme.mp3' }) {
  const audioRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => setReady(true), [])

  const start = () => {
    const el = audioRef.current
    if (!el || startedRef.current) return
    el.volume = 0
    el
      .play()
      .then(() => {
        startedRef.current = true
        setPlaying(true)
        // gentle fade-in instead of snapping straight to full volume
        const target = 0.55
        const step = 0.04
        const id = setInterval(() => {
          if (!audioRef.current) return clearInterval(id)
          const next = Math.min(target, audioRef.current.volume + step)
          audioRef.current.volume = next
          if (next >= target) clearInterval(id)
        }, 60)
      })
      .catch(() => {
        // Autoplay was refused (no real gesture yet, or user denied) —
        // stay in the "not started" state so the button remains a clear
        // call-to-action instead of silently failing.
      })
  }

  // First-click-anywhere fallback. Passive, capture phase, removes itself
  // after the first attempt so it never interferes with normal page
  // interactions (link clicks, form focus, etc.) after that.
  useEffect(() => {
    if (!ready) return
    const handler = () => {
      start()
      window.removeEventListener('click', handler, true)
      window.removeEventListener('touchstart', handler, true)
      window.removeEventListener('keydown', handler, true)
    }
    window.addEventListener('click', handler, true)
    window.addEventListener('touchstart', handler, true)
    window.addEventListener('keydown', handler, true)
    return () => {
      window.removeEventListener('click', handler, true)
      window.removeEventListener('touchstart', handler, true)
      window.removeEventListener('keydown', handler, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (!startedRef.current) {
      start()
      return
    }
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    const el = audioRef.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <motion.button
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        onClick={playing ? toggleMute : toggle}
        data-cursor="link"
        aria-label={!startedRef.current ? 'Play background audio' : muted ? 'Unmute' : 'Mute'}
        className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full glass-chip text-fg/80 transition-colors hover:text-fg lg:bottom-8 lg:right-8"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={playing && !muted ? 'on' : 'off'}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative block"
          >
            {playing && !muted ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {playing && !muted && (
              <motion.span
                className="absolute -inset-2 -z-10 rounded-full bg-gradient-to-r from-brand to-violet2 opacity-20"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  )
}
