'use client'

import { useEffect, useRef, useState } from 'react'

// Lightweight Canvas2D particle field ("stars & constellation" effect).
//
// Perf notes:
// - Runs on ALL devices, including mobile — but mobile gets a lighter
//   version: fewer particles, a lower fps ceiling, and shorter connective
//   lines, since it's an ambient background effect and doesn't need to
//   match desktop density to read as "stars."
// - Pauses itself via IntersectionObserver when scrolled off-screen, and
//   pauses on tab visibility change, so it never burns battery for a
//   section the person isn't even looking at.
// - Dynamic fps: measures real frame spacing and backs off the target fps
//   under load, easing back up when the device is keeping up comfortably.
// - On touch devices there's no persistent hover, so touches nudge the
//   particles briefly instead of a constant cursor-follow.
export default function ParticleField({ className = '' }) {
  const canvasRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const small = window.innerWidth < 768
    setIsMobile(coarse || small)
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    let width = 0, height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
    let raf = null
    let running = false
    const mouse = { x: -9999, y: -9999 }

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      width = rect.width; height = rect.height
      canvas.width = width * dpr; canvas.height = height * dpr
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const count = isMobile
      ? Math.min(20, Math.floor((width * height) / 42000))
      : Math.min(60, Math.floor((width * height) / 22000))
    const linkDist = isMobile ? 85 : 110
    const influenceDist = isMobile ? 100 : 130

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.5,
    }))

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    const onTouchMove = (e) => {
      const t = e.touches && e.touches[0]
      if (t) { mouse.x = t.clientX; mouse.y = t.clientY }
    }
    const onTouchEnd = () => { mouse.x = -9999; mouse.y = -9999 }

    if (isMobile) {
      window.addEventListener('touchmove', onTouchMove, { passive: true })
      window.addEventListener('touchend', onTouchEnd, { passive: true })
      window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    } else {
      window.addEventListener('mousemove', onMove, { passive: true })
      window.addEventListener('mouseout', onLeave)
    }
    window.addEventListener('resize', resize)

    const MAX_FPS = isMobile ? 30 : 60
    const MIN_FPS = isMobile ? 15 : 24
    let targetFps = MAX_FPS
    let frameInterval = 1000 / targetFps
    let lastFrameTime = 0
    let avgFrameMs = 1000 / MAX_FPS
    let evalCounter = 0

    const draw = (now) => {
      if (!running) return
      raf = requestAnimationFrame(draw)

      const elapsed = now - lastFrameTime
      if (elapsed < frameInterval) return
      const actualDelta = lastFrameTime ? elapsed : frameInterval
      lastFrameTime = now - (elapsed % frameInterval)

      avgFrameMs = avgFrameMs * 0.9 + actualDelta * 0.1

      evalCounter++
      if (evalCounter >= 30) {
        evalCounter = 0
        const currentFps = 1000 / avgFrameMs
        if (currentFps < targetFps - 8 && targetFps > MIN_FPS) {
          targetFps = Math.max(MIN_FPS, targetFps - 8)
          frameInterval = 1000 / targetFps
        } else if (currentFps > targetFps + 10 && targetFps < MAX_FPS) {
          targetFps = Math.min(MAX_FPS, targetFps + 6)
          frameInterval = 1000 / targetFps
        }
      }

      ctx.clearRect(0, 0, width, height)
      const rect = canvas.getBoundingClientRect()
      const mx = mouse.x - rect.left
      const my = mouse.y - rect.top

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        const dx = p.x - mx, dy = p.y - my
        const dist = Math.hypot(dx, dy)
        if (dist < influenceDist) {
          const force = (influenceDist - dist) / influenceDist
          p.x += (dx / (dist || 1)) * force * 1.2
          p.y += (dy / (dist || 1)) * force * 1.2
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = dist < influenceDist + 30 ? 'rgba(91,140,255,0.9)' : 'rgba(255,255,255,0.45)'
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < linkDist) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(120,140,200,${(1 - d / linkDist) * 0.14})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
    }

    const start = () => {
      if (running) return
      running = true
      lastFrameTime = 0
      raf = requestAnimationFrame(draw)
    }
    const stop = () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = null
    }

    let cleanupObservers = null

    if (reduce) {
      running = true
      draw(performance.now())
      running = false
    } else {
      const io = new IntersectionObserver(
        ([entry]) => { entry.isIntersecting ? start() : stop() },
        { threshold: 0 }
      )
      io.observe(canvas)

      const onVisibility = () => { document.hidden ? stop() : start() }
      document.addEventListener('visibilitychange', onVisibility)

      cleanupObservers = () => {
        io.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
      }
    }

    return () => {
      stop()
      if (cleanupObservers) cleanupObservers()
      if (isMobile) {
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('touchend', onTouchEnd)
        window.removeEventListener('touchcancel', onTouchEnd)
      } else {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseout', onLeave)
      }
      window.removeEventListener('resize', resize)
    }
  }, [enabled, isMobile])

  if (!enabled) return null
  return <canvas ref={canvasRef} className={className} />
}
