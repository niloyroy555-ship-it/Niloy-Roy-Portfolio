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
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let particles = []
    let raf = 0
    let lastFrame = 0
    const FRAME_BUDGET = 1000 / 60 // cap work to ~60fps even on 120/144Hz screens

    function makeParticles() {
      const isSmall = width < 640
      const count = isSmall ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
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

    function step(now) {
      if (now - lastFrame < FRAME_BUDGET) {
        if (!reduceMotion) raf = requestAnimationFrame(step)
        return
      }
      lastFrame = now

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

    resize()
    window.addEventListener('resize', resize)
    step()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
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
