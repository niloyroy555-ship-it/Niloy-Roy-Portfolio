'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { isTouchDevice } from '@/utils/isTouch'

// Cyberpunk arm loop, played behind the hero content as a teased,
// never-fully-revealed background layer. Optimized so it doesn't
// tank performance on tablets/phones (paused off-screen, smaller
// source on coarse-pointer devices, respects reduced-motion).
export default function HeroVideo({ className = '', active = true }) {
  const videoRef = useRef(null)
  const wrapRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(false)
  const [src, setSrc] = useState({ webm: '/videos/hero-arm-1080.webm', mp4: '/videos/hero-arm-1080.mp4' })

  useEffect(() => {
    const coarse = isTouchDevice()
    // Smaller / cheaper-to-decode source for touch (tablet/phone) hardware
    setSrc(
      coarse
        ? { webm: '/videos/hero-arm-1080.webm', mp4: '/videos/hero-arm-720.mp4' }
        : { webm: '/videos/hero-arm-1080.webm', mp4: '/videos/hero-arm-1080.mp4' }
    )
  }, [])

  // Only decode/play frames while the hero is actually on screen
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold: 0.15 }
    )
    io.observe(wrap)
    return () => io.disconnect()
  }, [])

  // Gate actual playback on: loading screen finished (active), in view, and not reduced-motion.
  // This is what makes the loop start right after the loading screen fades out
  // instead of racing it while the rest of the page is still assembling.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // poster only, no autoplay

    const tryPlay = () => video.play().catch(() => {})

    if (active && inView) tryPlay()
    else video.pause()

    const onVisibility = () => {
      if (document.hidden) video.pause()
      else if (active && inView) tryPlay()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [active, inView, src])

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: '50% 42%',
            filter: 'saturate(1.15) contrast(1.05) brightness(0.95)',
            opacity: 0.62,
          }}
          poster="/videos/hero-arm-poster.jpg"
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setReady(true)}
        >
          <source src={src.webm} type="video/webm" />
          <source src={src.mp4} type="video/mp4" />
        </video>
      </motion.div>

      {/* Tease mask: keep the center where the name sits partially obscured,
          let the arm read clearly through the edges/corners and softly
          through the middle — never a full, clean reveal. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 58% 52% at 50% 46%, rgba(8,8,10,0.7) 0%, rgba(8,8,10,0.5) 40%, rgba(8,8,10,0.22) 64%, rgba(8,8,10,0.04) 84%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(8,8,10,0.45) 0%, rgba(8,8,10,0.08) 22%, rgba(8,8,10,0.08) 70%, rgba(8,8,10,0.8) 100%)' }}
      />
    </div>
  )
}
