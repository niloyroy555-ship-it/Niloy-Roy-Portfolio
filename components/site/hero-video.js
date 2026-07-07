'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { isTouchDevice } from '@/utils/isTouch'

// Cyberpunk arm loop, played behind the hero content as a teased,
// never-fully-revealed background layer. Optimized so it doesn't
// tank performance on tablets/phones (paused off-screen, smaller
// source on coarse-pointer devices, respects reduced-motion).
export default function HeroVideo({ className = '' }) {
  const videoRef = useRef(null)
  const wrapRef = useRef(null)
  const [ready, setReady] = useState(false)
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

  useEffect(() => {
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // poster only, no autoplay

    const tryPlay = () => video.play().catch(() => {})

    // Only decode/play frames while the hero is actually on screen
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) tryPlay()
          else video.pause()
        })
      },
      { threshold: 0.15 }
    )
    io.observe(wrap)

    const onVisibility = () => {
      if (document.hidden) video.pause()
      else if (wrap.getBoundingClientRect().top < window.innerHeight) tryPlay()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [src])

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
            objectPosition: '62% 46%',
            filter: 'saturate(1.15) contrast(1.05) brightness(0.9)',
            opacity: 0.5,
          }}
          poster="/videos/hero-arm-poster.jpg"
          autoPlay
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

      {/* Tease mask: keep the center where the name sits obscured,
          let the arm only peek through the edges/corners. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 48%, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.72) 38%, rgba(8,8,10,0.35) 62%, rgba(8,8,10,0.05) 82%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0.1) 22%, rgba(8,8,10,0.1) 70%, rgba(8,8,10,0.85) 100%)' }}
      />
    </div>
  )
}
