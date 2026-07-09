'use client'

import { useEffect, useRef } from 'react'

// Lightweight canvas particle field: dark dots drifting on a light backdrop,
// with faint connecting lines when particles pass near one another.
// Pure canvas/JS — no extra dependencies, no third-party scene files.
const PARTICLE_COUNT_DESKTOP = 110
const PARTICLE_COUNT_MOBILE = 55
const LINK_DISTANCE = 130
const PARTICLE_RGB = '17, 17, 20' // dark ink dots

export default function ParticleField({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Touch/stylus devices (phones AND tablets) get the reduced particle
    // count. This used to be a `width < 640` check, which only caught
    // phones — a tablet in landscape (or many tablets even in portrait)
    // reports a width well above that, so it was silently getting the full
    // 110-particle desktop count with an O(n^2) link-distance pass between
    // every pair, every frame, on a mobile-class GPU.
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let particles = []
    let raf = 0
    let paused = false
    let visible = true

    function makeParticles() {
      const count = coarsePointer ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.7 + 0.6,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        alpha: Math.random() * 0.5 + 0.35,
      }))
    }

    function resize() {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      makeParticles()
    }

    function step() {
      if (paused || !visible) {
        raf = 0 // loop has stopped; lets the observer/visibilitychange handlers know they need to kick it off again
        return
      }
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10
      }

      // faint links between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_DISTANCE) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${PARTICLE_RGB}, ${0.14 * (1 - dist / LINK_DISTANCE)})`
            ctx.lineWidth = 1
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // dots
      for (const p of particles) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(${PARTICLE_RGB}, ${p.alpha})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduceMotion) raf = requestAnimationFrame(step)
    }

    // Pause entirely when the canvas is scrolled out of view — no reason to
    // keep computing ~6,000 pairwise distance checks a frame for a hero
    // background the user has already scrolled past.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true
        if (visible && !paused && !raf) {
          raf = requestAnimationFrame(step)
        }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const onVisibilityChange = () => {
      paused = document.visibilityState !== 'visible'
      if (!paused && visible && !raf) raf = requestAnimationFrame(step)
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      io.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`block h-full w-full ${className}`}
    />
  )
}
