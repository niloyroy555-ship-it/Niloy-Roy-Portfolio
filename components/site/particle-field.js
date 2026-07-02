'use client'

import { useEffect, useRef } from 'react'

// Lightweight Canvas2D particle field that reacts to the cursor.
export default function ParticleField({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = canvas.getContext('2d')
    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf
    const mouse = { x: -9999, y: -9999 }
    let rect = { left: 0, top: 0 }
    let frameCount = 0

    const resize = () => {
      const r = canvas.parentElement.getBoundingClientRect()
      rect = { left: r.left, top: r.top }
      width = Math.max(1, Math.floor(r.width))
      height = Math.max(1, Math.floor(r.height))
      canvas.width = width * dpr; canvas.height = height * dpr
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Particle count scaled down on small screens to reduce CPU/GPU pressure
    const baseCount = Math.min(90, Math.floor((width * height) / 16000))
    const smallScreen = width < 600
    const count = Math.max(8, Math.floor(baseCount * (smallScreen ? 0.5 : 1)))

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.5,
    }))

    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseout', onLeave)
    window.addEventListener('resize', resize)

    const draw = () => {
      frameCount++
      ctx.clearRect(0, 0, width, height)
      const mx = mouse.x - rect.left
      const my = mouse.y - rect.top

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // cursor influence
        const dx = p.x - mx, dy = p.y - my
        const dist = Math.hypot(dx, dy)
        if (dist < 130) {
          const force = (130 - dist) / 130
          p.x += (dx / (dist || 1)) * force * 1.2
          p.y += (dy / (dist || 1)) * force * 1.2
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = dist < 160 ? 'rgba(91,140,255,0.9)' : 'rgba(255,255,255,0.45)'
        ctx.fill()
      }

      // Draw connective lines less frequently to save CPU on mobile
      if (frameCount % 2 === 0) {
        const maxDist = 110
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i]
          // Limit j range to reduce O(n^2) work on larger particle counts
          for (let j = i + 1; j < particles.length && j < i + 10; j++) {
            const b = particles[j]
            const d = Math.hypot(a.x - b.x, a.y - b.y)
            if (d < maxDist) {
              ctx.beginPath()
              ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
              ctx.strokeStyle = `rgba(120,140,200,${(1 - d / maxDist) * 0.12})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    if (reduce) {
      // draw a single static frame
      draw()
      cancelAnimationFrame(raf)
    } else {
      draw()
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} />
}
