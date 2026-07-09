'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

// ---------------------------------------------------------------------------
// DEV-ONLY TRACK SOURCE
// ---------------------------------------------------------------------------
// This currently points at a local placeholder file so the widget can be
// built and tuned end-to-end. Swap TRACK.src for a cleared / royalty-free
// track (e.g. from Pixabay Music or StockTune) before deploying to Vercel —
// the placeholder file is a copyrighted master recording and is not licensed
// for public distribution.
const TRACK = {
  src: '/audio/now-playing-POWER (Instrumental).mp3',
  title: 'Now Playing',
  artist: 'Kanye West',
}

const BAR_COUNT = 4

function Bars({ playing }) {
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden="true">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-fg/80"
          animate={
            playing
              ? { height: ['30%', '100%', '55%', '85%', '30%'] }
              : { height: '25%' }
          }
          transition={
            playing
              ? {
                  duration: 1.1 + i * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : { duration: 0.25 }
          }
        />
      ))}
    </span>
  )
}

export default function NowPlaying() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.55
    const onCanPlay = () => setReady(true)
    audio.addEventListener('canplaythrough', onCanPlay)
    return () => audio.removeEventListener('canplaythrough', onCanPlay)
  }, [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      if (playing) {
        audio.pause()
        setPlaying(false)
      } else {
        await audio.play()
        setPlaying(true)
      }
    } catch {
      // Autoplay-policy or decode rejection — surface as simply not playing.
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="fixed bottom-5 left-5 z-40 lg:bottom-7 lg:left-7"
    >
      <audio ref={audioRef} src={TRACK.src} loop preload="auto" />
      <div className="glass-chip flex items-center gap-3 rounded-full py-2 pl-2 pr-4 text-fg">
        <button
          onClick={toggle}
          disabled={!ready}
          data-cursor="link"
          aria-label={playing ? 'Pause background track' : 'Play background track'}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-fg/10 text-fg transition-colors hover:bg-fg/20 disabled:opacity-40"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={playing ? 'pause' : 'play'}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="grid place-items-center"
            >
              {playing ? <Pause size={14} /> : <Play size={14} className="ml-[1px]" />}
            </motion.span>
          </AnimatePresence>
        </button>

        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-medium tracking-wide text-fg/90">
            {TRACK.title}
          </span>
          <span className="text-[10px] text-fg/50">{TRACK.artist}</span>
        </div>

        <Bars playing={playing} />

        <button
          onClick={toggleMute}
          data-cursor="link"
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-fg/60 transition-colors hover:text-fg"
        >
          {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </div>
    </motion.div>
  )
}
