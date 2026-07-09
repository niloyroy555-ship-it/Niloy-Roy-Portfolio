'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

// Site-wide background audio, now presented as a small "now playing" card
// (waveform + track name + live elapsed/duration time) instead of a bare
// icon button.
//
// Browsers block autoplay-with-sound until there's been a real user
// gesture, so this never calls .play() on mount. Instead it arms two
// independent triggers, whichever fires first:
//   1) the card itself (bottom-right, matches nav's glass-chip treatment)
//   2) a one-time "first interaction anywhere on the page" listener
//      (click/touchstart/keydown), so visitors who click a project card
//      or nav link before spotting the card still get sound.
// After the first successful start, clicking the play button becomes a
// normal play/pause toggle and the page-wide listener detaches.
const formatTime = (secs) => {
  if (!Number.isFinite(secs) || secs < 0) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

// Relative bar heights (px) for the idle "resting waveform" look and for
// the playing animation — kept as plain numbers so both states can share
// one array shape.
const BAR_PEAKS = [7, 15, 10, 18, 9]

export default function AudioPlayer({
  src = '/audio/theme.mp3',
  // Edit these two to whatever track is actually playing.
  title = 'Now Playing',
  artist = 'Kanye West - POWER (Instrumental)',
}) {
  const audioRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
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

  const togglePlay = () => {
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

  const onTimeUpdate = () => {
    const el = audioRef.current
    if (!el) return
    setCurrentTime(el.currentTime)
  }

  const onLoadedMetadata = () => {
    const el = audioRef.current
    if (!el || !Number.isFinite(el.duration)) return
    setDuration(el.duration)
  }

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        className="fixed bottom-6 right-6 z-50 lg:bottom-8 lg:right-8"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="relative flex items-center gap-3 rounded-2xl glass-chip py-2.5 pl-3 pr-3.5 shadow-[0_8px_28px_rgba(4,6,24,0.35)]">
          {/* mute toggle — small badge tucked in the top-right corner so it
              doesn't compete with the primary play control */}
          <button
            type="button"
            onClick={toggleMute}
            data-cursor="link"
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full glass-chip text-fg/60 transition-colors hover:text-fg"
          >
            {muted ? <VolumeX size={11} /> : <Volume2 size={11} />}
          </button>

          {/* waveform */}
          <span className="flex h-6 items-end gap-[3px]" aria-hidden>
            {BAR_PEAKS.map((peak, i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-gradient-to-t from-brand to-violet2"
                animate={
                  playing
                    ? { height: [4, peak, 5, peak * 0.7, 4] }
                    : { height: 4 }
                }
                transition={
                  playing
                    ? { duration: 1.1 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.3 }
                }
              />
            ))}
          </span>

          {/* song name + live time */}
          <div className="flex min-w-0 flex-col items-start leading-tight">
            <span className="max-w-[8.5rem] truncate text-xs font-semibold text-fg sm:max-w-[11rem]">
              {title}
            </span>
            <span className="max-w-[8.5rem] truncate text-[10px] font-medium uppercase tracking-wide text-fg/55 sm:max-w-[11rem]">
              {artist}
            </span>
            <span className="mt-1 flex w-full items-center gap-1.5 text-[10px] tabular-nums text-fg/45">
              <span>{formatTime(currentTime)}</span>
              <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-fg/10">
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-brand to-violet2"
                  style={{ width: `${progress * 100}%` }}
                />
              </span>
              <span>{formatTime(duration)}</span>
            </span>
          </div>

          {/* play / pause */}
          <button
            type="button"
            onClick={togglePlay}
            data-cursor="link"
            aria-label={!startedRef.current ? 'Play background audio' : playing ? 'Pause' : 'Play'}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-violet2 text-white shadow-[0_4px_16px_rgba(109,141,255,0.4)] transition-transform hover:scale-105"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={playing ? 'pause' : 'play'}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {playing ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} fill="currentColor" className="translate-x-[1px]" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </>
  )
}
